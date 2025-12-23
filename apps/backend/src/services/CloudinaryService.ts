import { v2 as cloudinary } from "cloudinary";
import { injectable } from "inversify";
import { config } from "../config";

@injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: config.cloudinary.cloudName,
            api_key: config.cloudinary.apiKey,
            api_secret: config.cloudinary.apiSecret,
        });
    }

    async uploadImage(fileBuffer: Buffer, folder: string = "avatars"): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder, resource_type: "image" },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error("Upload failed"));
                    resolve({ url: result.secure_url, publicId: result.public_id });
                }
            );
            uploadStream.end(fileBuffer);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        if (!publicId) return;
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
            // We usually don't want to throw here to avoid blocking the main operation
        }
    }
}
