import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  initialImages?: UploadedImage[];
  label?: string;
  buttonText?: string;
  addMoreText?: string;
  dragText?: string;
  className?: string;
}

export function ImageUpload({ 
  onImagesChange, 
  maxImages = 5, 
  maxSizeMB = 5, 
  initialImages = [],
  label = "Product Images",
  buttonText = "Choose Images",
  addMoreText = "Add More Images",
  dragText = "Drag and drop images here, or click to select",
  className = ""
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let firstError: string | null = null;

    // Validate files
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error && !firstError) {
        firstError = error;
      } else if (!error) {
        validFiles.push(file);
      }
    }

    // Check if adding these files would exceed max images
    if (images.length + validFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(firstError);

    // Process valid files
    const newImages: UploadedImage[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: UploadedImage = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          name: file.name,
          size: file.size
        };
        newImages.push(newImage);
        
        if (newImages.length === validFiles.length) {
          const updatedImages = [...images, ...newImages];
          setImages(updatedImages);
          onImagesChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images, maxImages, maxSizeMB, onImagesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      processFiles(files);
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label} {images.length > 0 && `(${images.length}/${maxImages})`}</Label>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-accent/50'
            : 'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {images.length === 0 ? (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 bg-muted rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxImages}
                className="rounded-lg"
              >
                <Plus size={16} className="mr-2" />
                {buttonText}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {dragText}<br />
              Up to {maxImages} image{maxImages !== 1 ? 's' : ''}, max {maxSizeMB}MB each
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto h-8 w-8 bg-muted rounded-full flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxImages}
                className="rounded-lg"
              >
                <Plus size={16} className="mr-2" />
                {addMoreText}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {maxImages - images.length} more image{maxImages - images.length !== 1 ? 's' : ''} allowed
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Cover Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                  Cover
                </div>
              )}
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(image.id)}
              >
                <X size={14} />
              </Button>
              
              {/* File Info */}
              <div className="mt-2 text-xs text-muted-foreground">
                <p className="truncate" title={image.name}>{image.name}</p>
                <p>{formatFileSize(image.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Helper Text */}
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          The first image will be used as the cover photo. Drag images to reorder them.
        </p>
      )}
    </div>
  );
}