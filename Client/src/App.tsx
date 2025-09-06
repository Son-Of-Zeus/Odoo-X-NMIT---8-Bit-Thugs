import { useState, useRef, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { Header } from "./components/Header";
import { ProductListingFeed } from "./components/ProductListingFeed";
import { AddProductScreen } from "./components/AddProductScreen";
import { MyListingsScreen } from "./components/MyListingsScreen";
import { ProductDetailScreen } from "./components/ProductDetailScreen";
import { CartScreen } from "./components/CartScreen";
import { UserProfileScreen } from "./components/UserProfileScreen";
import { PreviousPurchasesScreen } from "./components/PreviousPurchasesScreen";
import { SavedItemsScreen } from "./components/SavedItemsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { MobileNavigation } from "./components/MobileNavigation";
import { Toaster } from "./components/ui/sonner";

// Define types for data structures used in the app
interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  seller: string;
}

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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedProduct[]>([
    // Initial mock data for saved items
    {
      id: "1",
      title: "Vintage Oak Coffee Table",
      price: 125,
      category: "Home",
      image: "https://images.unsplash.com/photo-1577176434922-803273eba97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      condition: "good",
      seller: "Sarah M.",
      savedDate: "2024-12-01",
      isAvailable: true
    },
  ]);
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["home"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const productListingRef = useRef<{ handleSearch: (query: string) => void; handleFilter: (condition: string) => void } | null>(null);

  // Apply dark mode class to the root element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleToggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen("home");
  };

  const handleNavigate = (screen: string, productId?: string) => {
    const authRequiredScreens = ["profile", "my-listings", "cart", "add-product", "purchases", "saved-items", "settings"];
    if (!isLoggedIn && authRequiredScreens.includes(screen)) {
      setCurrentScreen("login");
      return;
    }

    setNavigationHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen("home"); // Default fallback
    }
  };

  const handleAddToCart = () => {
    // This is mock functionality, replace with real logic as needed
    const newItem: CartItem = {
      id: "1",
      title: "Vintage Oak Coffee Table",
      price: 125,
      image: "https://images.unsplash.com/photo-1577176434922-803273eba97a",
      quantity: 1,
      seller: "Sarah M."
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  
  const toggleSaveItem = (productId: string) => {
    const isSaved = savedItems.some(item => item.id === productId);
    if (isSaved) {
      setSavedItems(prev => prev.filter(item => item.id !== productId));
    } else {
      // In a real app, you'd fetch product details here before adding
      const mockProduct: SavedProduct = {
        id: productId,
        title: "Newly Saved Item",
        price: 99,
        category: "Misc",
        image: "https://via.placeholder.com/150",
        condition: "new",
        seller: "System",
        savedDate: new Date().toISOString().split('T')[0],
        isAvailable: true,
      };
      setSavedItems(prev => [...prev, mockProduct]);
    }
  };

  const handleSearch = (query: string) => {
    productListingRef.current?.handleSearch(query);
  };
  
  const handleFilter = (condition: string) => {
    productListingRef.current?.handleFilter(condition);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderScreen = () => {
    if (!isLoggedIn) {
      return <LoginScreen onLogin={handleLogin} onNavigate={handleNavigate} />;
    }

    switch (currentScreen) {
      case "home":
        return <ProductListingFeed 
                  onNavigate={handleNavigate} 
                  ref={productListingRef} 
                  savedItemIds={savedItems.map(item => item.id)}
                  onToggleSave={toggleSaveItem}
                />;
      case "add-product":
        return <AddProductScreen onNavigate={handleNavigate} onGoBack={handleGoBack} />;
      case "my-listings":
        return <MyListingsScreen onNavigate={handleNavigate} onGoBack={handleGoBack} />;
      case "product-detail":
        return <ProductDetailScreen 
                  onNavigate={handleNavigate}
                  onAddToCart={handleAddToCart}
                  onGoBack={handleGoBack}
                  isSaved={!!selectedProductId && savedItems.some(item => item.id === selectedProductId)}
                  onToggleSave={selectedProductId ? () => toggleSaveItem(selectedProductId) : undefined}
                />;
      case "cart":
        return <CartScreen
                  onNavigate={handleNavigate}
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onGoBack={handleGoBack}
                />;
      case "profile":
        // UserProfileScreen now fetches its own data and requires no extra props
        return <UserProfileScreen onNavigate={handleNavigate} onGoBack={handleGoBack} />;
      case "purchases":
        return <PreviousPurchasesScreen onNavigate={handleNavigate} onGoBack={handleGoBack} />;
      case "saved-items":
        return <SavedItemsScreen 
                  onNavigate={handleNavigate} 
                  onGoBack={handleGoBack}
                  savedItems={savedItems}
                  onRemoveFromSaved={(id) => setSavedItems(prev => prev.filter(item => item.id !== id))}
                />;
      case "settings":
        return <SettingsScreen 
                  onNavigate={handleNavigate} 
                  onGoBack={handleGoBack}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={handleToggleDarkMode}
                />;
      default:
        return <LoginScreen onLogin={handleLogin} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoggedIn && (
        <Header 
          currentScreen={currentScreen} 
          onNavigate={handleNavigate}
          cartCount={cartCount}
          isLoggedIn={isLoggedIn}
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
      )}
      
      <main className="pb-16 md:pb-0">
        {renderScreen()}
      </main>
      
      {isLoggedIn && (
        <MobileNavigation 
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          cartCount={cartCount}
        />
      )}
      
      <Toaster />
    </div>
  );
}
