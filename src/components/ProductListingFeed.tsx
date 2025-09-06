import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Plus, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { ProductCard } from "./ProductCard";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  condition?: string;
}

interface ProductListingFeedProps {
  onNavigate: (screen: string, productId?: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  savedItemIds?: string[];
  onToggleSave?: (productId: string) => void;
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Vintage Oak Coffee Table",
    price: 125,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1577176434922-803273eba97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kJTIwdGFibGUlMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBkZXRhaWx8ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    condition: "Like-New"
  },
  {
    id: "2",
    title: "Sustainable Cotton Jacket",
    price: 45,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1750343293522-2f08b60a317a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VkJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGphY2tldHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    condition: "Excellent"
  },
  {
    id: "3",
    title: "Classic Literature Collection",
    price: 30,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1657211689102-0ec23b523fa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNvbmRoYW5kJTIwYm9va3N8ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHN0YWNrfGVufDF8fHx8MTc1NzEyODQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    condition: "Good"
  },
  {
    id: "4",
    title: "Refurbished Bluetooth Speaker",
    price: 85,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1743741031690-9b4358532806?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZWxlY3Ryb25pY3MlMjBnYWRnZXRzfGVufDF8fHx8MTc1NzEyODEyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVha2VyJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    condition: "Fair"
  },
  {
    id: "5",
    title: "Handmade Ceramic Vase",
    price: 22,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwdmFzZXxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1599582909645-9754ae5a888e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeXxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    condition: "Like-New"
  },
  {
    id: "6",
    title: "Organic Cotton T-Shirt",
    price: 18,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGphY2tldHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0c2hpcnQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    condition: "Poor"
  }
];

export const ProductListingFeed = forwardRef<
  { handleSearch: (query: string) => void; handleFilter: (condition: string) => void },
  ProductListingFeedProps
>(({ onNavigate, isDarkMode = false, onToggleDarkMode, savedItemIds = [], onToggleSave }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    let products = mockProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      products = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by condition
    if (filterCondition !== "all") {
      products = products.filter(product =>
        product.condition?.toLowerCase() === filterCondition.toLowerCase()
      );
    }

    setFilteredProducts(products);
  }, [selectedCategory, searchQuery, filterCondition]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (condition: string) => {
    setFilterCondition(condition);
  };

  useImperativeHandle(ref, () => ({
    handleSearch,
    handleFilter,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Category Tabs and Dark Mode Toggle */}
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

        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          className="rounded-lg border-border hover:bg-accent"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onNavigate("product-detail", product.id)}
            isSaved={savedItemIds.includes(product.id)}
            onToggleSave={() => onToggleSave?.(product.id)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}

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
});
