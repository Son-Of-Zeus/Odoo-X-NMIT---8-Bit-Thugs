import { ArrowLeft, Package, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Purchase {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  orderDate: string;
  status: "delivered" | "shipped" | "processing";
}

interface PreviousPurchasesScreenProps {
  onNavigate: (screen: string) => void;
}

// Mock purchase data
const mockPurchases: Purchase[] = [
  {
    id: "order-001",
    title: "Sustainable Cotton Jacket",
    price: 45,
    image: "https://images.unsplash.com/photo-1750343293522-2f08b60a317a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VkJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Alex Chen",
    orderDate: "2024-01-15",
    status: "delivered"
  },
  {
    id: "order-002",
    title: "Refurbished Bluetooth Speaker",
    price: 85,
    image: "https://images.unsplash.com/photo-1743741031690-9b4358532806?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZWxlY3Ryb25pY3MlMjBnYWRnZXRzfGVufDF8fHx8MTc1NzEyODEyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Maria Rodriguez",
    orderDate: "2024-01-08",
    status: "delivered"
  },
  {
    id: "order-003",
    title: "Handmade Ceramic Vase",
    price: 22,
    image: "https://images.unsplash.com/photo-1577176434922-803273eba97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "David Kim",
    orderDate: "2023-12-22",
    status: "delivered"
  }
];

export function PreviousPurchasesScreen({ onNavigate }: PreviousPurchasesScreenProps) {
  const getStatusColor = (status: Purchase["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
              onClick={() => onNavigate("profile")}
              className="rounded-lg mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-medium">Previous Purchases</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {mockPurchases.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                You have purchased {mockPurchases.length} item{mockPurchases.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="space-y-4">
              {mockPurchases.map((purchase) => (
                <Card key={purchase.id} className="border-border rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <ImageWithFallback
                          src={purchase.image}
                          alt={purchase.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-foreground line-clamp-1">
                            {purchase.title}
                          </h3>
                          <Badge 
                            className={`ml-2 ${getStatusColor(purchase.status)} capitalize`}
                          >
                            {purchase.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">
                          Sold by {purchase.seller}
                        </p>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          Ordered on {formatDate(purchase.orderDate)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-medium text-primary">
                            ${purchase.price}
                          </div>
                          
                          <div className="flex gap-2">
                            {purchase.status === "delivered" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border rounded-lg"
                              >
                                <Star size={14} className="mr-1" />
                                Rate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border rounded-lg"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center">
                <Package size={32} className="text-muted-foreground" />
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-foreground mb-2">
              No purchases yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring our sustainable marketplace and find your first eco-friendly treasure!
            </p>
            
            <Button
              onClick={() => onNavigate("home")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}