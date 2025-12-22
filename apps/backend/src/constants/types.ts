export const TYPES = {
    // Repositories
    UserRepository: Symbol.for("UserRepository"),
    NotificationRepository: Symbol.for("NotificationRepository"),

    // Services
    AuthService: Symbol.for("AuthService"),
    ProfileService: Symbol.for("ProfileService"),
    NotificationService: Symbol.for("NotificationService"),

    // Controllers
    AuthController: Symbol.for("AuthController"),
    ProfileController: Symbol.for("ProfileController"),
    NotificationController: Symbol.for("NotificationController"),
};
