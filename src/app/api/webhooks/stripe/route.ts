import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import prisma from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    // 1. Xác thực xem có đúng là Stripe gửi không (tránh hacker giả mạo)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. Xử lý khi thanh toán thành công
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    // Lấy thông tin đã lưu ở bước trước (Checkout Session)
    const { orderItems, email } = session.metadata;
    const items = JSON.parse(orderItems);

    // 3. Lưu đơn hàng vào Database qua Prisma
    await prisma.order.create({
      data: {
        email: email,
        total: session.amount_total / 1, // Đơn vị VND
        status: "PAID",
        stripeId: session.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price, // Giá tại thời điểm mua
          })),
        },
      },
    });

    // 4. (Tùy chọn) Gửi email xác nhận ở đây
    console.log("Đã tạo đơn hàng thành công cho:", email);
  }

  return NextResponse.json({ received: true });
}