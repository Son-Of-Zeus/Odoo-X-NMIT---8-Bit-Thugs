import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit2, Trash2, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  condition?: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export function ProductCard({ product, onClick, showActions, onEdit, onDelete, isSaved, onToggleSave }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Ensure images array exists and has at least one image
  const images = product.images && product.images.length > 0 ? product.images : [""];
  
  const handleThumbnailClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const handleThumbnailHover = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 border-border rounded-xl overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden relative">
        <ImageWithFallback
          src={images[currentImageIndex] || images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Save Button */}
        {onToggleSave && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
          >
            <Heart 
              size={14} 
              className={`transition-colors ${isSaved ? 'text-primary fill-current' : 'text-muted-foreground'}`} 
            />
          </Button>
        )}

        {/* Thumbnail images on hover */}
        {isHovered && images.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => handleThumbnailClick(index, e)}
                onMouseEnter={() => handleThumbnailHover(index)}
                className={`w-8 h-8 rounded border-2 overflow-hidden transition-all ${
                  index === currentImageIndex 
                    ? 'border-primary scale-110' 
                    : 'border-white/60 hover:border-white scale-100'
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-foreground line-clamp-2 flex-1">
              {product.title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-accent text-accent-foreground rounded-md">
              {product.category}
            </Badge>
            {product.condition && (
              <Badge variant="outline" className="border-border rounded-md">
                {product.condition}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-medium text-primary">
              ${product.price}
            </span>
            
            {showActions && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                  className="h-8 px-3 border-border hover:bg-accent rounded-lg"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="h-8 px-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}