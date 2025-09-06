import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  condition?: string;
}

interface MyListingsScreenProps {
  onNavigate: (screen: string) => void;
}

// Mock user's listings
const userListings: Product[] = [
  {
    id: "1",
    title: "Vintage Oak Coffee Table",
    price: 125,
    category: "Home",
    image: "https://images.unsplash.com/photo-1577176434922-803273eba97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Good"
  },
  {
    id: "3",
    title: "Classic Literature Collection",
    price: 30,
    category: "Books",
    image: "https://images.unsplash.com/photo-1657211689102-0ec23b523fa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNvbmRoYW5kJTIwYm9va3N8ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Good"
  }
];

export function MyListingsScreen({ onNavigate }: MyListingsScreenProps) {
  const handleEdit = (productId: string) => {
    // Navigate to edit product screen
    console.log("Edit product:", productId);
  };

  const handleDelete = (productId: string) => {
    // Handle product deletion
    console.log("Delete product:", productId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate("home")}
                className="rounded-lg mr-4 md:hidden"
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-lg font-medium">My Listings</h1>
            </div>
            
            <Button
              onClick={() => onNavigate("add-product")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {userListings.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                You have {userListings.length} active listing{userListings.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userListings.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate("product-detail", product.id)}
                  showActions={true}
                  onEdit={() => handleEdit(product.id)}
                  onDelete={() => handleDelete(product.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center">
                <Plus size={32} className="text-muted-foreground" />
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-foreground mb-2">
              No listings yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your sustainable journey by listing your first item. Help others find great pre-loved treasures!
            </p>
            
            <Button
              onClick={() => onNavigate("add-product")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              <Plus size={16} className="mr-2" />
              List Your First Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}