import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json();

    // 1. Lấy danh sách sản phẩm từ DB dựa trên ID gửi lên từ giỏ hàng
    // ⚠️ Bảo mật: Luôn lấy giá từ DB, không tin tưởng giá từ client gửi lên!
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
    });

    // 2. Tạo Session thanh toán với Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email, // Thêm email khách hàng vào đây
      line_items: items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Không tìm thấy sản phẩm ${item.productId}`);

        return {
          price_data: {
            currency: "vnd",
            product_data: { 
              name: product.name 
            },
            // Stripe tính theo đơn vị nhỏ nhất (ví dụ VND thì là 1đ, USD thì là cent)
            unit_amount: Number(product.price), 
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      // Link quay về khi thành công hoặc hủy
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      // Lưu thông tin để Webhook xử lý sau này
      metadata: {
        orderItems: JSON.stringify(items),
        email: email
      }
    });

    // 3. Trả về đường link thanh toán của Stripe
    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Lỗi Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}