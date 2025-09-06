import { ArrowLeft, Heart, Share2, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface ProductDetailScreenProps {
  onNavigate: (screen: string) => void;
  onAddToCart: () => void;
  onGoBack: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

// Mock product data
const mockProduct = {
  id: "1",
  title: "Vintage Oak Coffee Table",
  price: 125,
  category: "Home",
  condition: "Good",
  description: "Beautiful vintage oak coffee table with a rich, warm finish. This piece has been well-maintained and shows minimal wear. Perfect for adding character to any living room. Dimensions: 48\" L x 24\" W x 16\" H. Some minor scratches on the surface that add to its vintage charm.",
  images: [
    "https://images.unsplash.com/photo-1577176434922-803273eba97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  ],
  seller: {
    name: "Sarah M.",
    avatar: "https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnxlbnwxfHx8fDE3NTcwOTI3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    location: "San Francisco, CA"
  },
  posted: "3 days ago"
};

export function ProductDetailScreen({ onNavigate, onAddToCart, onGoBack, isSaved, onToggleSave }: ProductDetailScreenProps) {
  const handleAddToCart = () => {
    onAddToCart();
    toast.success("Added to cart!");
  };

  const handleToggleSave = () => {
    onToggleSave?.();
    toast.success(isSaved ? "Removed from saved items" : "Added to saved items");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={onGoBack}
              className="rounded-lg"
            >
              <ArrowLeft size={20} />
            </Button>
            
            <div className="flex items-center gap-2">
              {onToggleSave && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg"
                  onClick={handleToggleSave}
                >
                  <Heart 
                    size={20} 
                    className={`transition-colors ${isSaved ? 'text-primary fill-current' : 'text-muted-foreground'}`} 
                  />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="rounded-lg">
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl border border-border">
              <ImageWithFallback
                src={mockProduct.images[0]}
                alt={mockProduct.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Badge variant="secondary" className="bg-accent text-accent-foreground rounded-md">
                  {mockProduct.category}
                </Badge>
                <Badge variant="outline" className="border-border rounded-md">
                  {mockProduct.condition}
                </Badge>
              </div>
              
              <h1 className="text-2xl font-medium text-foreground mb-2">
                {mockProduct.title}
              </h1>
              
              <div className="text-3xl font-semibold text-primary mb-4">
                ${mockProduct.price}
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {mockProduct.description}
              </p>
            </div>

            {/* Seller Info */}
            <Card className="border-border rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mockProduct.seller.avatar} />
                    <AvatarFallback>{mockProduct.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {mockProduct.seller.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ⭐ {mockProduct.seller.rating} • {mockProduct.seller.location}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12"
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-border rounded-lg h-12"
              >
                Message Seller
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between py-2">
                <span>Posted</span>
                <span>{mockProduct.posted}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2">
                <span>Item ID</span>
                <span>#{mockProduct.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}