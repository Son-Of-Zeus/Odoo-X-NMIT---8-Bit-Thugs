import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner@2.0.3";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface AddProductScreenProps {
  onNavigate: (screen: string) => void;
  onGoBack: () => void;
}

export function AddProductScreen({ onNavigate, onGoBack }: AddProductScreenProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !price || !condition) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    // Here you would normally save the product
    toast.success("Product listed successfully!");
    onNavigate("my-listings");
  };

  const handleImagesChange = (uploadedImages: UploadedImage[]) => {
    setImages(uploadedImages);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={onGoBack}
              className="rounded-lg mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-medium">Add New Product</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="border-border rounded-xl">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <ImageUpload
                onImagesChange={handleImagesChange}
                maxImages={5}
                maxSizeMB={5}
              />

              {/* Product Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Vintage Oak Coffee Table"
                  className="bg-input-background border-border rounded-lg"
                  required
                />
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="bg-input-background border-border rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <Select value={condition} onValueChange={setCondition} required>
                    <SelectTrigger className="bg-input-background border-border rounded-lg">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 bg-input-background border-border rounded-lg"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item's condition, size, features, and any other relevant details..."
                  className="bg-input-background border-border rounded-lg min-h-[120px] resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Include details about condition, dimensions, materials, and any flaws or wear.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12"
                >
                  List Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}