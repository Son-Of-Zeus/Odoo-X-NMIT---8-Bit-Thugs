import { useState } from "react";
import { ArrowLeft, Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface SavedProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  condition: string;
  seller: string;
  savedDate: string;
  isAvailable: boolean;
}

interface SavedItemsScreenProps {
  onNavigate: (screen: string, productId?: string) => void;
  onGoBack: () => void;
  savedItems: SavedProduct[];
  onRemoveFromSaved: (productId: string) => void;
}

export function SavedItemsScreen({ onNavigate, onGoBack, savedItems, onRemoveFromSaved }: SavedItemsScreenProps) {
  const [localSavedItems, setLocalSavedItems] = useState(savedItems);

  const handleRemoveItem = (productId: string) => {
    const item = localSavedItems.find(item => item.id === productId);
    setLocalSavedItems(prev => prev.filter(item => item.id !== productId));
    onRemoveFromSaved(productId);
    toast.success(`"${item?.title}" removed from saved items`);
  };

  const handleProductClick = (productId: string) => {
    onNavigate("product-detail", productId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={onGoBack}
              className="rounded-lg mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-primary" />
              <h1 className="text-lg font-medium">Saved Items</h1>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                {localSavedItems.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {localSavedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No saved items yet</h3>
            <p className="text-muted-foreground mb-6">
              Save items you're interested in to keep track of them easily.
            </p>
            <Button 
              onClick={() => onNavigate("home")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Options */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              <Button variant="outline" size="sm" className="rounded-lg">
                All Items
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg">
                Available
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg">
                Recently Saved
              </Button>
            </div>

            {/* Saved Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localSavedItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="group cursor-pointer border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onClick={() => handleProductClick(item.id)}
                      />
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.id);
                      }}
                    >
                      <X size={14} />
                    </Button>

                    {/* Availability Status */}
                    {!item.isAvailable && (
                      <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-md">
                        Sold
                      </div>
                    )}

                    {/* Heart Icon */}
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5">
                      <Heart size={14} className="text-primary fill-current" />
                    </div>
                  </div>

                  <CardContent className="p-4" onClick={() => handleProductClick(item.id)}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-foreground line-clamp-2 leading-tight">
                          {item.title}
                        </h3>
                        <span className="text-lg font-medium text-primary shrink-0">
                          ${item.price}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.condition}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>by {item.seller}</span>
                        <span>Saved {formatDate(item.savedDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}