"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileService } from "@/services/profile.service";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/error-utils";

interface AvatarUploadProps {
    currentAvatarUrl?: string;
    onUploadSuccess: () => void;
    className?: string;
    firstName?: string;
    lastName?: string;
}

export function AvatarUpload({
    currentAvatarUrl,
    onUploadSuccess,
    className,
    firstName,
    lastName,
}: AvatarUploadProps) {
    const [preview, setPreview] = React.useState<string | null>(currentAvatarUrl || null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDragOver, setIsDragOver] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const getInitials = () => {
        if (!firstName && !lastName) return "U";
        return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            await handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {
        // Validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file (JPEG, PNG, WebP).");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB.");
            return;
        }

        try {
            setIsLoading(true);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl); // Optimistic update

            await profileService.uploadAvatar(file);
            toast.success("Avatar updated successfully!");
            onUploadSuccess();
        } catch (error) {
            console.error(error);
            toast.error(getErrorMessage(error) || "Failed to upload avatar.");
            setPreview(currentAvatarUrl || null); // Revert on failure
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div
                className={cn(
                    "relative group cursor-pointer rounded-full transition-all duration-200",
                    isDragOver && "ring-2 ring-primary ring-offset-2 opacity-80"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <Avatar className="w-32 h-32 border-2 border-border">
                    <AvatarImage src={preview || ""} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-8 h-8 text-white" />
                </div>

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}
            </div>

            <div className="text-center space-y-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClick}
                    disabled={isLoading}
                    className="relative"
                >
                    Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground">
                    Max 5MB. JPG, PNG, WebP.
                </p>
                <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileSelect}
                />
            </div>
        </div>
    );
}
