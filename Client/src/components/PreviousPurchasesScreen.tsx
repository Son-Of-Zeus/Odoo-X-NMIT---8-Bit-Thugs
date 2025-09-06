import { useState } from "react";
import { ArrowLeft, Package, Star, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  seller: string;
}

interface Order {
  orderId: string;
  orderDate: string;
  status: "delivered" | "shipped" | "processing";
  products: Product[];
  total: number;
}

interface PreviousPurchasesScreenProps {
  onNavigate: (screen: string, productId?: string) => void;
  onGoBack: () => void;
}

// Mock order data grouped by order ID
const mockOrders: Order[] = [
  {
    orderId: "ORD-2024-001",
    orderDate: "2024-01-15",
    status: "delivered",
    total: 130,
    products: [
      {
        id: "2",
        title: "Sustainable Cotton Jacket",
        price: 45,
        images: [
          "https://images.unsplash.com/photo-1750343293522-2f08b60a317a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VkJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        ],
        seller: "Alex Chen"
      },
      {
        id: "4",
        title: "Refurbished Bluetooth Speaker",
        price: 85,
        images: [
          "https://images.unsplash.com/photo-1743741031690-9b4358532806?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZWxlY3Ryb25pY3MlMjBnYWRnZXRzfGVufDF8fHx8MTc1NzEyODEyM3ww&ixlib=rb-4.1.0&q=80&w=1080"
        ],
        seller: "Maria Rodriguez"
      }
    ]
  },
  {
    orderId: "ORD-2024-002", 
    orderDate: "2024-01-08",
    status: "delivered",
    total: 22,
    products: [
      {
        id: "5",
        title: "Handmade Ceramic Vase",
        price: 22,
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwdmFzZXxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        ],
        seller: "David Kim"
      }
    ]
  },
  {
    orderId: "ORD-2023-089",
    orderDate: "2023-12-22", 
    status: "delivered", 
    total: 48,
    products: [
      {
        id: "3",
        title: "Classic Literature Collection",
        price: 30,
        images: [
          "https://images.unsplash.com/photo-1657211689102-0ec23b523fa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNvbmRoYW5kJTIwYm9va3N8ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        ],
        seller: "Emma Wilson"
      },
      {
        id: "6",
        title: "Organic Cotton T-Shirt",
        price: 18,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGphY2tldHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        ],
        seller: "Sarah Jones"
      }
    ]
  }
];

export function PreviousPurchasesScreen({ onNavigate, onGoBack }: PreviousPurchasesScreenProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: Order["status"]) => {
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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleProductClick = (productId: string) => {
    onNavigate("product-detail", productId);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  // If viewing order details
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToOrders}
                className="rounded-lg mr-4"
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-lg font-medium">Order Details - {selectedOrder.orderId}</h1>
            </div>
          </div>
        </div>

        {/* Order Details Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium mb-2">Order {selectedOrder.orderId}</h2>
                <p className="text-muted-foreground">
                  Ordered on {formatDate(selectedOrder.orderDate)}
                </p>
              </div>
              <Badge className={`${getStatusColor(selectedOrder.status)} capitalize`}>
                {selectedOrder.status}
              </Badge>
            </div>
            
            <div className="text-lg font-medium text-primary mb-6">
              Total: ${selectedOrder.total}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Items in this order:</h3>
            {selectedOrder.products.map((product) => (
              <Card 
                key={product.id} 
                className="border-border rounded-xl cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground line-clamp-1 mb-1">
                            {product.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Sold by {product.seller}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">${product.price}</span>
                          <ChevronRight size={16} className="text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main orders list view
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
            <h1 className="text-lg font-medium">Purchase History</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {mockOrders.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                You have {mockOrders.length} order{mockOrders.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.orderId} className="border-border rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Order {order.orderId}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.orderDate)} • {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} capitalize`}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium text-primary">
                        ${order.total}
                      </div>
                      
                      <Button
                        onClick={() => handleViewDetails(order)}
                        variant="outline"
                        size="sm"
                        className="border-border rounded-lg"
                      >
                        View Details
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
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