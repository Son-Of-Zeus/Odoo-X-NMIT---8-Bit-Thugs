import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { Header } from "./components/Header";
import { ProductListingFeed } from "./components/ProductListingFeed";
import { AddProductScreen } from "./components/AddProductScreen";
import { MyListingsScreen } from "./components/MyListingsScreen";
import { ProductDetailScreen } from "./components/ProductDetailScreen";
import { CartScreen } from "./components/CartScreen";
import { UserProfileScreen } from "./components/UserProfileScreen";
import { PreviousPurchasesScreen } from "./components/PreviousPurchasesScreen";
import { MobileNavigation } from "./components/MobileNavigation";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  seller: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleNavigate = (screen: string, productId?: string) => {
    setCurrentScreen(screen);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  const handleAddToCart = () => {
    // Mock add to cart functionality
    const newItem: CartItem = {
      id: "1",
      title: "Vintage Oak Coffee Table",
      price: 125,
      image: "https://images.unsplash.com/photo-1577176434922-803273eba97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      quantity: 1,
      seller: "Sarah M."
    };
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {currentScreen !== "login" && (
        <Header 
          currentScreen={currentScreen} 
          onNavigate={handleNavigate}
          cartCount={cartCount}
        />
      )}
      
      <main className="pb-16 md:pb-0">
        {currentScreen === "home" && (
          <ProductListingFeed onNavigate={handleNavigate} />
        )}
        
        {currentScreen === "add-product" && (
          <AddProductScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === "my-listings" && (
          <MyListingsScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === "product-detail" && (
          <ProductDetailScreen 
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}
        
        {currentScreen === "cart" && (
          <CartScreen
            onNavigate={handleNavigate}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        )}
        
        {currentScreen === "profile" && (
          <UserProfileScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === "purchases" && (
          <PreviousPurchasesScreen onNavigate={handleNavigate} />
        )}
      </main>
      
      <MobileNavigation 
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        cartCount={cartCount}
      />
    </div>
  );
}