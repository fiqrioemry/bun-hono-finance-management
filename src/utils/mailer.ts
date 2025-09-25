import c from "@/utils/constant";
import transporter from "@/config/mailer";
import { HTTPException } from "hono/http-exception";

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: `"${c.APP_NAME} Support" <${c.SMTP_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🔐 Verification Code</h2>
          <p>Use the following OTP to complete your verification process:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <br/>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("OTP email sent:", info.messageId);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    throw new HTTPException(500, { message: "Failed to send OTP email" });
  }
}

export async function sendVerificationLink(to: string, link: string) {
  try {
    const info = await transporter.sendMail({
      from: `"${c.APP_NAME} Support" <${c.SMTP_USER}>`,
      to,
      subject: "Your Verification Link",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🔐 Verification Link</h2>
          <p>Use the following link to complete your verification process:</p>
          <a href="${link}">${link}</a>
          <p>This code will expire in 30 minutes.</p>
          <br/>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Verification link sent:", info.messageId);
  } catch (err) {
    throw new HTTPException(500, {
      message: "Failed to send verification link",
    });
  }
}

export async function sendResetLink(to: string, link: string) {
  try {
    const info = await transporter.sendMail({
      from: `"${c.APP_NAME} Support" <${c.SMTP_USER}>`,
      to,
      subject: "Your Reset Password Link",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🔐 Verification Link</h2>
          <p>Use the following link to recovery your password:</p>
          <a href="${link}">${link}</a>
          <p>This code will expire in 30 minutes.</p>
          <br/>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Reset link send : ", info.messageId);
  } catch (err) {
    console.error("Failed to send verification link:", err);
    throw new HTTPException(500, { message: "Failed to send reset link" });
  }
}
