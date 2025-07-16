'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploadProps {
    onUpload: (url: string) => void;
    multiple?: boolean;
    className?: string;
}

declare global {
    interface Window {
        cloudinary: any;
    }
}

export default function CloudinaryUpload({ onUpload, multiple = false, className = '' }: CloudinaryUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const openUploadWidget = useCallback(() => {
        if (!window.cloudinary) {
            console.error('Cloudinary widget not loaded');
            return;
        }

        setIsUploading(true);

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
                sources: ['local', 'url', 'camera'],
                multiple: multiple,
                maxFiles: multiple ? 10 : 1,
                maxFileSize: 10000000, // 10MB
                allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                showAdvancedOptions: false,
                cropping: true,
                croppingAspectRatio: 16 / 9,
                croppingShowDimensions: true,
                theme: 'minimal',
                styles: {
                    palette: {
                        window: '#FFFFFF',
                        windowBorder: '#90A0B3',
                        tabIcon: '#0078FF',
                        menuIcons: '#5A616A',
                        textDark: '#000000',
                        textLight: '#FFFFFF',
                        link: '#0078FF',
                        action: '#FF620C',
                        inactiveTabIcon: '#0E2F5A',
                        error: '#F44235',
                        inProgress: '#0078FF',
                        complete: '#20B832',
                        sourceBg: '#E4EBF1'
                    }
                }
            },
            (error: any, result: any) => {
                if (!error && result && result.event === 'success') {
                    const imageUrl = result.info.secure_url;

                    if (multiple) {
                        setUploadedImages(prev => [...prev, imageUrl]);
                        onUpload(imageUrl);
                    } else {
                        setUploadedImages([imageUrl]);
                        onUpload(imageUrl);
                    }
                }

                if (error) {
                    console.error('Upload error:', error);
                }

                setIsUploading(false);
            }
        );

        widget.open();
    }, [multiple, onUpload]);

    const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Button */}
            <button
                type="button"
                onClick={openUploadWidget}
                disabled={isUploading}
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                        <span>Uploading...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                        <Upload className="w-8 h-8" />
                        <span className="font-medium">Click to upload images</span>
                        <span className="text-sm">JPG, PNG, GIF, WebP up to 10MB</span>
                    </div>
                )}
            </button>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={imageUrl}
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 