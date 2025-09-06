import { useState } from "react";
import { Plus, Filter, Grid, List } from "lucide-react";
import { Button } from "./ui/button";
import { ProductCard } from "./ProductCard";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  condition?: string;
}

interface ProductListingFeedProps {
  onNavigate: (screen: string, productId?: string) => void;
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Vintage Oak Coffee Table",
    price: 125,
    category: "Home",
    image: "https://images.unsplash.com/photo-1577176434922-803273eba97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Good"
  },
  {
    id: "2",
    title: "Sustainable Cotton Jacket",
    price: 45,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1750343293522-2f08b60a317a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VkJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Excellent"
  },
  {
    id: "3",
    title: "Classic Literature Collection",
    price: 30,
    category: "Books",
    image: "https://images.unsplash.com/photo-1657211689102-0ec23b523fa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNvbmRoYW5kJTIwYm9va3N8ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Good"
  },
  {
    id: "4",
    title: "Refurbished Bluetooth Speaker",
    price: 85,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1743741031690-9b4358532806?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZWxlY3Ryb25pY3MlMjBnYWRnZXRzfGVufDF8fHx8MTc1NzEyODEyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Like New"
  },
  {
    id: "5",
    title: "Handmade Ceramic Vase",
    price: 22,
    category: "Home",
    image: "https://images.unsplash.com/photo-1577176434922-803273eba97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Excellent"
  },
  {
    id: "6",
    title: "Organic Cotton T-Shirt",
    price: 18,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1750343293522-2f08b60a317a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VkJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Good"
  }
];

export function ProductListingFeed({ onNavigate }: ProductListingFeedProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = selectedCategory === "all" 
    ? mockProducts 
    : mockProducts.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Category Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:grid-cols-5 bg-muted rounded-lg">
            <TabsTrigger value="all" className="rounded-md">All</TabsTrigger>
            <TabsTrigger value="clothing" className="rounded-md">Clothing</TabsTrigger>
            <TabsTrigger value="books" className="rounded-md">Books</TabsTrigger>
            <TabsTrigger value="electronics" className="rounded-md">Electronics</TabsTrigger>
            <TabsTrigger value="home" className="rounded-md">Home</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-lg">
            <Filter size={18} />
          </Button>
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-md h-8 w-8"
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-md h-8 w-8"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      }`}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onNavigate("product-detail", product.id)}
          />
        ))}
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={() => onNavigate("add-product")}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground md:bottom-8 md:right-8"
        size="icon"
      >
        <Plus size={24} />
      </Button>
    </div>
  );
}