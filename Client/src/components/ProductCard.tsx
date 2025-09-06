import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  condition?: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductCard({ product, onClick, showActions, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 border-border rounded-xl overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="text-sm text-destructive hover:text-destructive/80"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}