export interface IEmailService {
  sendVerificationEmail(to: string, name: string, token: string): Promise<void>;
  sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void>;
  sendLoginAlertEmail(
    to: string,
    name: string,
    deviceInfo: string,
  ): Promise<void>;
  sendProfileUpdateEmail(to: string, name: string): Promise<void>;
}
