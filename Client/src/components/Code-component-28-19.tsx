import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageUpload } from "./ImageUpload";
import { X, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  condition?: string;
  description?: string;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface ComprehensiveEditProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, updates: Partial<Product>) => void;
}

const categories = [
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Garden" },
  { value: "toys", label: "Toys & Games" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "other", label: "Other" },
];

const conditions = [
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export function ComprehensiveEditProductDialog({ product, isOpen, onClose, onSave }: ComprehensiveEditProductDialogProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<UploadedImage[]>([]);

  // Reset form when product changes or dialog opens
  useEffect(() => {
    if (product && isOpen) {
      setTitle(product.title);
      setPrice(product.price.toString());
      setDescription(product.description || "");
      setSelectedCategory(product.category.toLowerCase());
      setSelectedCondition(product.condition || "");
      setExistingImages(product.images || []);
      setNewImages([]);
    }
  }, [product, isOpen]);

  const handleSave = () => {
    if (product && title && price && selectedCategory && selectedCondition) {
      // Combine existing images and new images
      const allImages = [
        ...existingImages,
        ...newImages.map(img => img.preview) // In a real app, you'd upload these and get URLs
      ];

      const updates: Partial<Product> = {
        title,
        price: parseFloat(price),
        description,
        category: categories.find(c => c.value === selectedCategory)?.label || selectedCategory,
        condition: selectedCondition,
        images: allImages
      };

      onSave(product.id, updates);
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleNewImagesChange = (images: UploadedImage[]) => {
    setNewImages(images);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const isFormValid = title && price && selectedCategory && selectedCondition;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update all details for "{product?.title}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Product Title */}
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Product Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Vintage Oak Coffee Table"
              className="rounded-lg"
            />
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-condition">Condition *</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label htmlFor="edit-price">Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="edit-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="pl-8 rounded-lg"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item's condition, size, features, and any other relevant details..."
              className="rounded-lg min-h-[100px] resize-none"
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="grid gap-2">
              <Label>Current Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                      <ImageWithFallback
                        src={image}
                        alt={`Current image ${index + 1}`}
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
                      onClick={() => removeExistingImage(index)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div className="grid gap-2">
            <ImageUpload
              onImagesChange={handleNewImagesChange}
              maxImages={5 - existingImages.length}
              maxSizeMB={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}