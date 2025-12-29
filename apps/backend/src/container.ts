import { Container } from "inversify";
import { TYPES } from "./constants/types";
import { AdminController } from "./controllers/AdminController";
// Import Controllers
import { AuthController } from "./controllers/AuthController";
import { NotificationController } from "./controllers/NotificationController";
import { ProfileController } from "./controllers/ProfileController";
import type { IAdminRepository } from "./interfaces/IAdminRepository";
import type { IAdminService } from "./interfaces/IAdminService";
// Interfaces
import type { IAuthService } from "./interfaces/IAuthService";
import type { IEmailService } from "./interfaces/IEmailService";
import type { ILoginActivityService } from "./interfaces/ILoginActivityService";
import type { INotificationRepository } from "./interfaces/INotificationRepository";
import type { INotificationService } from "./interfaces/INotificationService";
import type { IProfileService } from "./interfaces/IProfileService";
import type { IUserRepository } from "./interfaces/IUserRepository";
import { AdminRepository } from "./repositories/AdminRepository";
import { NotificationRepository } from "./repositories/NotificationRepository";
// Import Repositories
import { UserRepository } from "./repositories/UserRepository";
import { AdminService } from "./services/AdminService";
// Import Services
import { AuthService } from "./services/AuthService";
import { CloudinaryService } from "./services/CloudinaryService";
import { LoginActivityService } from "./services/LoginActivityService";
import { NodemailerEmailService } from "./services/NodemailerEmailService";
import { NotificationService } from "./services/NotificationService";
import { ProfileService } from "./services/ProfileService";

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container
  .bind<INotificationRepository>(TYPES.NotificationRepository)
  .to(NotificationRepository);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);
container
  .bind<INotificationService>(TYPES.NotificationService)
  .to(NotificationService);
container.bind<IEmailService>(TYPES.EmailService).to(NodemailerEmailService);
container
  .bind<CloudinaryService>(TYPES.CloudinaryService)
  .to(CloudinaryService);
container
  .bind<ILoginActivityService>(TYPES.LoginActivityService)
  .to(LoginActivityService);

// Admin Module Bindings
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container
  .bind<ProfileController>(TYPES.ProfileController)
  .to(ProfileController);
container
  .bind<NotificationController>(TYPES.NotificationController)
  .to(NotificationController);

export { container };
