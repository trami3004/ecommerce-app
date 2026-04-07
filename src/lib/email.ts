import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(order: any) {
  // 1. Tạo nội dung Email bằng HTML đơn giản (Hoặc dùng React component nếu bạn có)
  const emailHtml = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
      <h1 style="color: #333;">Xác nhận đơn hàng #${order.orderNumber}</h1>
      <p>Chào bạn, cảm ơn bạn đã mua sắm tại <strong>Shop của Trà Mi</strong>!</p>
      <hr />
      <p><strong>Tổng tiền:</strong> ${order.totalPrice} VND</p>
      <p>Trạng thái: Đã thanh toán thành công qua Stripe.</p>
      <p>Chúng tôi sẽ giao hàng cho bạn sớm nhất có thể.</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // Bắt buộc dùng email này nếu chưa có Domain riêng
      to: "nguyenthitrami3004@gmail.com",              // Email người nhận
      subject: `Xác nhận đơn hàng #${order.orderNumber}`,
      html: emailHtml,
    });
    console.log("✅ Đã gửi email xác nhận thành công!");
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
  }
}