import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
// import { Logo } from "./Logo"; // Assuming Logo component exists

// The URL where your backend server is running
<<<<<<< HEAD
const API_URL = "http://localhost:5001"; // Make sure this port matches your Express server
=======
const API_URL = "https://toolbar-starring-difficult-dreams.trycloudflare.com"; // Make sure this port matches your Express server
>>>>>>> main

// --- CHANGE 1: Interface updated to expect 'onLogin' ---
interface LoginScreenProps {
  // This prop now matches what App.tsx provides
  onLogin: () => void;
  onNavigate: (screen: string) => void;
}

<<<<<<< HEAD
// --- CHANGE 2: Destructure 'onLogin' instead of 'onLoginSuccess' ---
export function LoginScreen({ onLogin }: LoginScreenProps) {
=======
export function LoginScreen({ onLogin, onNavigate }: LoginScreenProps) {
>>>>>>> main
  // State for all form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // State for UI control
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

<<<<<<< HEAD
    // Note: You had /user/signup, I've kept it but make sure your backend route matches
    const endpoint = isSignUp ? `${API_URL}/user/signup` : `${API_URL}/user/login`;
    
    const body = isSignUp
      ? { email, password, firstName, lastName, userAddress, phone: phoneNumber }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unexpected error occurred.');
      }

      console.log("API Success:", data);
      localStorage.setItem('authToken', data.token);
      
      // --- CHANGE 3: Call 'onLogin()' without any arguments ---
      // This now correctly calls the handleLogin function from App.tsx
      onLogin();

=======
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const endpoint = isSignUp ? `${API_URL}/user/signup` : `${API_URL}/user/login`;
    
    const body = isSignUp
      ? { email, password, firstName, lastName, userAddress, phone: phoneNumber }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unexpected error occurred.');
      }

      // --- API Call Success ---
      console.log("API Success:", data);
      
      // Store the token in the browser's local storage
      localStorage.setItem('authToken', data.token);
      
      // Notify the parent component (App.tsx) that login was successful
      onLogin();

>>>>>>> main
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-6 text-center">
          {/* <Logo size="lg" className="justify-center" /> */}
          <h1 className="text-2xl font-bold">EcoFinds</h1>
          <div>
            <h2 className="text-xl font-medium text-foreground">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? "Join our sustainable marketplace" : "Sign in to continue"}
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="flex gap-4">
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userAddress">Address</Label>
                  <Input id="userAddress" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} required />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            )}
            
            {error && <p className="text-sm text-red-500 text-center font-medium">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button type="button" onClick={toggleForm} className="ml-1 text-primary hover:underline font-medium">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
=======
  // Toggles between Sign In and Sign Up forms
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(""); // Clear errors when switching forms
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" onClick={() => onNavigate("home")} className="rounded-lg mr-4">
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
                {isSignUp ? "Create Your Account" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isSignUp ? "Join our sustainable marketplace" : "Sign in to your account"}
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- NEW FIELDS FOR SIGN UP --- */}
              {isSignUp && (
                <>
                  <div className="flex gap-4">
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userAddress">Address</Label>
                    <Input id="userAddress" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              )}
              
              {error && <p className="text-sm text-red-500 text-center font-medium">{error}</p>}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isSignUp ? "Create Account" : "Sign In")}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button type="button" onClick={toggleForm} className="ml-1 text-primary hover:underline font-medium">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
>>>>>>> main
    </div>
  );
}
