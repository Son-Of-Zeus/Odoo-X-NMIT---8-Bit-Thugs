import { Home, Plus, User, List, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

interface MobileNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  cartCount?: number;
}

export function MobileNavigation({ currentScreen, onNavigate, cartCount = 0 }: MobileNavigationProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "my-listings", icon: List, label: "Listings" },
    { id: "add-product", icon: Plus, label: "Sell", isSpecial: true },
    { id: "cart", icon: ShoppingCart, label: "Cart", badge: cartCount },
    { id: "profile", icon: User, label: "Profile" }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center h-full rounded-none relative ${
                item.isSpecial 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
              
              {item.badge && item.badge > 0 && (
                <span className="absolute top-1 right-4 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}