import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  condition?: string;
}

interface EditProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, updates: { category: string; condition: string }) => void;
}

const categories = [
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home" },
];

const conditions = [
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

export function EditProductDialog({ product, isOpen, onClose, onSave }: EditProductDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  // Reset form when product changes or dialog opens
  useEffect(() => {
    if (product && isOpen) {
      setSelectedCategory(product.category.toLowerCase());
      setSelectedCondition(product.condition || "");
    }
  }, [product, isOpen]);

  const handleSave = () => {
    if (product && selectedCategory && selectedCondition) {
      onSave(product.id, {
        category: categories.find(c => c.value === selectedCategory)?.label || selectedCategory,
        condition: selectedCondition
      });
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the category and condition for "{product?.title}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
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
            <Label htmlFor="condition">Condition</Label>
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedCategory || !selectedCondition}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}