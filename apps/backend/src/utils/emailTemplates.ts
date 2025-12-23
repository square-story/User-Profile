export const emailTemplates = {
    verification: (name: string, code: string) => `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Verify Your Email</h2>
            <p>Hi ${name},</p>
            <p>Please use the following code to verify your email address:</p>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0;">${code}</div>
            <p>If you didn't request this, you can ignore this email.</p>
        </div>
    `,
    passwordReset: (name: string, token: string) => `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset Your Password</h2>
            <p>Hi ${name},</p>
            <p>You requested a password reset. Click the link below to reset it:</p>
            <a href="http://localhost:3000/reset-password?token=${token}" style="padding: 10px 20px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link expires in 1 hour.</p>
        </div>
    `,
    loginAlert: (name: string, deviceInfo: string) => `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Login Detected</h2>
            <p>Hi ${name},</p>
            <p>We detected a new login to your account from:</p>
            <p><strong>${deviceInfo}</strong></p>
            <p>If this was you, you can ignore this email. If not, please reset your password immediately.</p>
        </div>
    `,
    profileUpdate: (name: string) => `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Profile Updated</h2>
            <p>Hi ${name},</p>
            <p>Your profile information has been successfully updated.</p>
            <p>If you didn't make these changes, please contact support.</p>
        </div>
    `
};
