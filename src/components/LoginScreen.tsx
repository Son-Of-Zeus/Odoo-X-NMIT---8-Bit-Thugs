import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Logo } from "./Logo";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-6 text-center">
          <Logo size="lg" className="justify-center" />
          <div>
            <h1 className="text-xl font-medium text-foreground">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp 
                ? "Join our sustainable marketplace" 
                : "Sign in to your account"
              }
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background border-border rounded-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background border-border rounded-lg"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
            
            <p className="text-center text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary/80 font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}