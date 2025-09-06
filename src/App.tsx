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

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  location: string;
  bio: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedProduct[]>([
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
    {
      id: "5",
      title: "Leather Messenger Bag",
      price: 75,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFnJTIwc2Vjb25kaGFuZHxlbnwxfHx8fDE3NTcxMjg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      condition: "excellent",
      seller: "Mike R.",
      savedDate: "2024-11-28",
      isAvailable: false
    }
  ]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Sarah Miller",
    email: "sarah.miller@email.com",
    avatar: "https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnxlbnwxfHx8fDE3NTcwOTI3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "San Francisco, CA",
    bio: "Passionate about sustainable living and finding treasures new homes. I love vintage furniture and helping reduce waste through second-hand shopping!"
  });
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["home"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const productListingRef = useRef<{ handleSearch: (query: string) => void; handleFilter: (condition: string) => void } | null>(null);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen("home");
  };

  const handleNavigate = (screen: string, productId?: string) => {
    // Handle authentication-required screens
    if (!isLoggedIn && (screen === "profile" || screen === "my-listings" || screen === "cart" || screen === "add-product" || screen === "purchases" || screen === "saved-items" || screen === "settings")) {
      if (screen === "profile") {
        setCurrentScreen("login");
        return;
      } else {
        setCurrentScreen("login");
        return;
      }
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

  const handleAddToSaved = (productId: string) => {
    // In a real app, you'd fetch the full product details
    const mockProduct: SavedProduct = {
      id: productId,
      title: "New Saved Item",
      price: 50,
      category: "Other",
      image: "https://images.unsplash.com/photo-1565043666747-69f6646db2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNvbmRoYW5kJTIwaXRlbXN8ZW58MXx8fHwxNzU3MTI4NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      condition: "good",
      seller: "Unknown",
      savedDate: new Date().toISOString().split('T')[0],
      isAvailable: true
    };
    
    setSavedItems(prev => {
      const exists = prev.find(item => item.id === productId);
      if (!exists) {
        return [...prev, mockProduct];
      }
      return prev;
    });
  };

  const handleRemoveFromSaved = (productId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleSearch = (query: string) => {
    if (currentScreen === "home" && productListingRef.current) {
      productListingRef.current.handleSearch(query);
    }
  };

  const handleFilter = (condition: string) => {
    if (currentScreen === "home" && productListingRef.current) {
      productListingRef.current.handleFilter(condition);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {currentScreen !== "login" && (
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
        {currentScreen === "login" && (
          <LoginScreen onLogin={handleLogin} onNavigate={handleNavigate} />
        )}
        
        {currentScreen === "home" && (
          <ProductListingFeed 
            onNavigate={handleNavigate} 
            ref={productListingRef}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            savedItemIds={savedItems.map(item => item.id)}
            onToggleSave={(productId) => {
              const isCurrentlySaved = savedItems.some(item => item.id === productId);
              if (isCurrentlySaved) {
                handleRemoveFromSaved(productId);
              } else {
                handleAddToSaved(productId);
              }
            }}
          />
        )}
        
        {currentScreen === "add-product" && (
          <AddProductScreen onNavigate={handleNavigate} onGoBack={handleGoBack} />
        )}
        
        {currentScreen === "my-listings" && (
          <MyListingsScreen onNavigate={handleNavigate} onGoBack={handleGoBack} />
        )}
        
        {currentScreen === "product-detail" && (
          <ProductDetailScreen 
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onGoBack={handleGoBack}
            isSaved={selectedProductId ? savedItems.some(item => item.id === selectedProductId) : false}
            onToggleSave={selectedProductId ? () => {
              const isCurrentlySaved = savedItems.some(item => item.id === selectedProductId);
              if (isCurrentlySaved) {
                handleRemoveFromSaved(selectedProductId);
              } else {
                handleAddToSaved(selectedProductId);
              }
            } : undefined}
          />
        )}
        
        {currentScreen === "cart" && (
          <CartScreen
            onNavigate={handleNavigate}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onGoBack={handleGoBack}
          />
        )}
        
        {currentScreen === "profile" && (
          <UserProfileScreen 
            onNavigate={handleNavigate} 
            onGoBack={handleGoBack}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
        
        {currentScreen === "purchases" && (
          <PreviousPurchasesScreen onNavigate={handleNavigate} onGoBack={handleGoBack} />
        )}
        
        {currentScreen === "saved-items" && (
          <SavedItemsScreen 
            onNavigate={handleNavigate} 
            onGoBack={handleGoBack}
            savedItems={savedItems}
            onRemoveFromSaved={handleRemoveFromSaved}
          />
        )}
        
        {currentScreen === "settings" && (
          <SettingsScreen 
            onNavigate={handleNavigate} 
            onGoBack={handleGoBack}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        )}
      </main>
      
      <MobileNavigation 
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        cartCount={cartCount}
      />
      
      <Toaster />
    </div>
  );
}