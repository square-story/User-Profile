import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/user_profile_db",
    jwtSecret: process.env.JWT_SECRET || "supersecretkey",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "superrefreshsecret",
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
    env: process.env.NODE_ENV || "development",
};
