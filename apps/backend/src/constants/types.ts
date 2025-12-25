export const TYPES = {
    // Repositories
    UserRepository: Symbol.for("UserRepository"),
    NotificationRepository: Symbol.for("NotificationRepository"),

    // Services
    AuthService: Symbol.for("AuthService"),
    ProfileService: Symbol.for("ProfileService"),
    NotificationService: Symbol.for("NotificationService"),
    EmailService: Symbol.for("EmailService"),
    CloudinaryService: Symbol.for("CloudinaryService"),

    // Controllers
    AuthController: Symbol.for("AuthController"),
    ProfileController: Symbol.for("ProfileController"),
    NotificationController: Symbol.for("NotificationController"),
    AdminController: Symbol.for("AdminController"),

    // Repositories (Admin)
    AdminRepository: Symbol.for("AdminRepository"),

    // Services (Admin)
    AdminService: Symbol.for("AdminService"),

    // Services (Activity)
    LoginActivityService: Symbol.for("LoginActivityService"),
};
