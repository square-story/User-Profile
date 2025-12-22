import { Container } from "inversify";
import { TYPES } from "./constants/types";

// Import Controllers
import { AuthController } from "./controllers/AuthController";
import { ProfileController } from "./controllers/ProfileController";
import { NotificationController } from "./controllers/NotificationController";

// Import Services
import { AuthService } from "./services/AuthService";
import { ProfileService } from "./services/ProfileService";
import { NotificationService } from "./services/NotificationService";

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

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<ProfileController>(TYPES.ProfileController).to(ProfileController);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController);

export { container };
