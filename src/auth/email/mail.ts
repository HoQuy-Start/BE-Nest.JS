import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 0,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  public async sendMail(email: string, token: string): Promise<void> {
    try {
      // Tạo liên kết đặt lại bằng mã thông báo được cung cấp
      const resetLink: string = `http://localhost:3000/api/v2/auth/reset-password?token=${token}`;

      // Styled HTML email content
      const htmlContent: string = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Cơ khí Hồ Văn</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
          <p>
            <a href="${resetLink}" style="background-color: rgba(168,26,44,0.87); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
          </p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <hr>
          <p style="font-size: 0.9em; color: #555;">
            Trân trọng,<br>
            Cơ khí Hồ Văn
          </p>
        </div>
      `;

      // Send the email
      const message = await this.transporter.sendMail({
        from: "\"Cơ khí Hồ Văn 👻\" <maddison53@ethereal.email>",
        to: email,
        subject: "Yêu cầu đặt lại mật khẩu - Cơ khí Hồ Văn",
        text: "Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào liên kết để đặt lại mật khẩu của bạn.",
        html: htmlContent
      });
      console.log("Message sent: %s", message.messageId);
    } catch (error) {
      console.error("Error in sending email:", error);
    }
  }

}
