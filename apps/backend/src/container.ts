import { Container } from "inversify";
import { TYPES } from "./constants/types";

// Import Controllers
import { AuthController } from "./controllers/AuthController";
import { ProfileController } from "./controllers/ProfileController";
import { NotificationController } from "./controllers/NotificationController";
import { IAdminRepository } from "./interfaces/IAdminRepository";
import { AdminRepository } from "./repositories/AdminRepository";
import { IAdminService } from "./interfaces/IAdminService";
import { AdminService } from "./services/AdminService";
import { AdminController } from "./controllers/AdminController";
import { IEmailService } from "./interfaces/IEmailService";
import { NodemailerEmailService } from "./services/NodemailerEmailService";

// Import Services
import { AuthService } from "./services/AuthService";
import { ProfileService } from "./services/ProfileService";
import { NotificationService } from "./services/NotificationService";
import { CloudinaryService } from "./services/CloudinaryService";

// Import Repositories
import { UserRepository } from "./repositories/UserRepository";
import { NotificationRepository } from "./repositories/NotificationRepository";

// Interfaces
import { IAuthService } from "./interfaces/IAuthService";
import { IProfileService } from "./interfaces/IProfileService";
import { INotificationService } from "./interfaces/INotificationService";
import { IUserRepository } from "./interfaces/IUserRepository";
import { INotificationRepository } from "./interfaces/INotificationRepository";

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);
container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService);
container.bind<IEmailService>(TYPES.EmailService).to(NodemailerEmailService);
container.bind<CloudinaryService>(TYPES.CloudinaryService).to(CloudinaryService);

// Admin Module Bindings
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<ProfileController>(TYPES.ProfileController).to(ProfileController);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController);

export { container };
