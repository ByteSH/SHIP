package com.connect.SHIP_ADMIN.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("🔐 SHIP Admin - Your Login OTP");
        helper.setText(buildEmailBody(otp), true); // true = HTML

        mailSender.send(message);
    }

    private String buildEmailBody(String otp) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">
                
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding: 40px 0;">
                        <tr>
                            <td align="center">
                                <table width="480" cellpadding="0" cellspacing="0"
                                       style="background-color:#ffffff; border-radius:12px;
                                              box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
                
                                    <!-- Header -->
                                    <tr>
                                        <td align="center"
                                            style="background-color:#1a1a2e; padding: 32px 40px;">
                                            <h1 style="margin:0; color:#ffffff; font-size:22px;
                                                        letter-spacing:2px; text-transform:uppercase;">
                                                ⚓ SHIP ADMIN
                                            </h1>
                                            <p style="margin:6px 0 0; color:#a0a8c0; font-size:13px;">
                                                Secure Login Verification
                                            </p>
                                        </td>
                                    </tr>
                
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 40px 40px 20px;">
                                            <p style="margin:0 0 8px; color:#333333; font-size:15px;">
                                                Hello Admin,
                                            </p>
                                            <p style="margin:0 0 28px; color:#555555; font-size:14px; line-height:1.6;">
                                                A login attempt was made to your SHIP Admin account.
                                                Use the OTP below to complete your login.
                                            </p>
                
                                            <!-- OTP Box -->
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center"
                                                        style="background-color:#f0f4ff; border: 2px dashed #4a6cf7;
                                                               border-radius:10px; padding: 24px;">
                                                        <p style="margin:0 0 6px; color:#888888; font-size:12px;
                                                                   text-transform:uppercase; letter-spacing:1px;">
                                                            Your One-Time Password
                                                        </p>
                                                        <p style="margin:0; color:#1a1a2e; font-size:38px;
                                                                   font-weight:bold; letter-spacing:10px;">
                                                """ + otp + """
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                
                                            <!-- Expiry Note -->
                                            <p style="margin:24px 0 0; color:#e74c3c; font-size:13px; text-align:center;">
                                                ⏱ This OTP expires in <strong>5 minutes</strong>
                                            </p>
                
                                            <p style="margin:16px 0 0; color:#777777; font-size:13px;
                                                       text-align:center; line-height:1.6;">
                                                If you did not request this OTP, please secure your account immediately.
                                            </p>
                                        </td>
                                    </tr>
                
                                    <!-- Footer -->
                                    <tr>
                                        <td align="center"
                                            style="background-color:#f8f9fc; padding: 20px 40px;
                                                   border-top: 1px solid #eeeeee;">
                                            <p style="margin:0; color:#aaaaaa; font-size:12px;">
                                                © 2026 SHIP Admin Panel · Do not reply to this email
                                            </p>
                                        </td>
                                    </tr>
                
                                </table>
                            </td>
                        </tr>
                    </table>
                
                </body>
                </html>
                """;
    }
}