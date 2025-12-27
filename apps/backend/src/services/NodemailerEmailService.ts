import { injectable } from "inversify";
import nodemailer from "nodemailer";
import { IEmailService } from "../interfaces/IEmailService";
import { emailTemplates } from "../utils/emailTemplates";
import { config } from "../config";

@injectable()
export class NodemailerEmailService implements IEmailService {
    private _transporter: nodemailer.Transporter;

    constructor() {
        // Use Ethereal for dev if no env vars, or standard SMTP
        this._transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.ethereal.email",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: parseInt(process.env.SMTP_PORT || "587") === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || "test_user",
                pass: process.env.SMTP_PASS || "test_pass",
            },
        });
    }

    private async _sendMail(to: string, subject: string, html: string) {
        try {
            const info = await this._transporter.sendMail({
                from: '"SecureApp" <no-reply@secureapp.com>',
                to,
                subject,
                html,
            });
            console.log(`Email sent: ${info.messageId}`);
            if (process.env.NODE_ENV !== "production") {
                console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
        } catch (error) {
            console.error("Error sending email:", error);
            // In a real job queue, we would retry here
        }
    }

    async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
        await this._sendMail(to, "Verify Your Email", emailTemplates.verification(name, token));
    }

    async sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
        await this._sendMail(to, "Reset Your Password", emailTemplates.passwordReset(name, token));
    }

    async sendLoginAlertEmail(to: string, name: string, deviceInfo: string): Promise<void> {
        await this._sendMail(to, "New Login Detected", emailTemplates.loginAlert(name, deviceInfo));
    }

    async sendProfileUpdateEmail(to: string, name: string): Promise<void> {
        await this._sendMail(to, "Profile Updated", emailTemplates.profileUpdate(name));
    }
}
