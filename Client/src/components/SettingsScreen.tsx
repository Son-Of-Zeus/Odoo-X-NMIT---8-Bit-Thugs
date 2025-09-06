import { useState } from "react";
import { ArrowLeft, Bell, Shield, Palette, Globe, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  onGoBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  newMessages: boolean;
  priceDrops: boolean;
  newListings: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
  showLocation: boolean;
  allowMessages: boolean;
}

export function SettingsScreen({ onNavigate, onGoBack, isDarkMode, onToggleDarkMode }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    marketing: false,
    newMessages: true,
    priceDrops: true,
    newListings: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    allowMessages: true
  });

  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success("Notification preference updated");
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean | string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success("Privacy setting updated");
  };

  const handleSaveSettings = () => {
    toast.success("All settings have been saved");
  };

  const handleLogout = () => {
    // In a real app, you'd handle logout logic here
    toast.success("Logged out successfully");
    onNavigate("login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={onGoBack}
              className="rounded-lg mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-medium">Settings & Preferences</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="border-border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette size={20} className="text-primary" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize how EcoFinds looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={onToggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications on your device
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={() => handleNotificationChange('push')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>New Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    When someone sends you a message
                  </p>
                </div>
                <Switch
                  checked={notifications.newMessages}
                  onCheckedChange={() => handleNotificationChange('newMessages')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Price Drops</Label>
                  <p className="text-sm text-muted-foreground">
                    When items in your saved list drop in price
                  </p>
                </div>
                <Switch
                  checked={notifications.priceDrops}
                  onCheckedChange={() => handleNotificationChange('priceDrops')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Marketing Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Tips, trends, and promotional offers
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={() => handleNotificationChange('marketing')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="border-border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>
                Control your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Who can see your profile
                  </p>
                </div>
                <Select 
                  value={privacy.profileVisibility} 
                  onValueChange={(value: 'public' | 'private') => handlePrivacyChange('profileVisibility', value)}
                >
                  <SelectTrigger className="w-32 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your email on your public profile
                  </p>
                </div>
                <Switch
                  checked={privacy.showEmail}
                  onCheckedChange={(value) => handlePrivacyChange('showEmail', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your location on your profile
                  </p>
                </div>
                <Switch
                  checked={privacy.showLocation}
                  onCheckedChange={(value) => handlePrivacyChange('showLocation', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Let other users send you messages
                  </p>
                </div>
                <Switch
                  checked={privacy.allowMessages}
                  onCheckedChange={(value) => handlePrivacyChange('allowMessages', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="border-border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe size={20} className="text-primary" />
                <CardTitle>Regional Settings</CardTitle>
              </div>
              <CardDescription>
                Set your language and currency preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language
                  </p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Currency</Label>
                  <p className="text-sm text-muted-foreground">
                    Display prices in your preferred currency
                  </p>
                </div>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-32 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-border rounded-xl">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-border rounded-lg"
              >
                <CreditCard size={16} />
                Payment Methods
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-border rounded-lg"
              >
                <HelpCircle size={16} />
                Help & Support
              </Button>
              
              <Separator />
              
              <Button
                variant="destructive"
                className="w-full justify-start gap-2 rounded-lg"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              onClick={handleSaveSettings}
            >
              Save All Changes
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-border rounded-lg"
              onClick={onGoBack}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}