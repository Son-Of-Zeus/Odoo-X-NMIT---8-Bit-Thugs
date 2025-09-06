import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Logo } from "./Logo";
// For demonstration of hashing, you would install and import bcryptjs
// import bcrypt from 'bcryptjs';

interface LoginScreenProps {
  onLogin: () => void;
  onNavigate: (screen: string) => void;
}

export function LoginScreen({ onLogin, onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error on new submission

    // Logic for new user sign-up
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Best Practice: Password hashing should be done on the backend.
      // Send the plain password over HTTPS to your server, which then
      // hashes it before storing it.
      console.log("New user data for submission:");
      console.log(`Email: ${email}`);
      console.log(`Phone Number: ${phoneNumber}`);
      console.log("Password would be sent to the backend for hashing.");
      
      // Example API call to backend for user creation:
      // await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, phoneNumber, password }),
      // });
    }

    // After successful sign-up or for sign-in, call onLogin
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button and dynamic title */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("home")}
              className="rounded-lg mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-medium">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h1>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4">
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

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-input-background border-border rounded-lg"
                    required
                  />
                </div>
              )}
              
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

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-input-background border-border rounded-lg"
                    required
                  />
                </div>
              )}
              
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              
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
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(""); // Clear errors when switching form
                  }}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
