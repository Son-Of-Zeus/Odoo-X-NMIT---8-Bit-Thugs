import { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

// This interface should match the data structure used across your app
interface UserProfile {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  location?: string;
  userAddress?: string;
  phone?: string;
  profilePictureUrl?: string;
  bio?: string;
}

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSave: (updatedProfile: UserProfile) => void;
}

// Ensure you have this in your .env file
const API_URL ="https://toolbar-starring-difficult-dreams.trycloudflare.com";

export function EditProfileDialog({ isOpen, onClose, userProfile, onSave }: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    userAddress: "",
    phone: "",
    bio: "",
    profilePictureUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile && isOpen) {
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        location: userProfile.location || "",
        userAddress: userProfile.userAddress || "",
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
        profilePictureUrl: userProfile.profilePictureUrl || "",
      });
    }
  }, [userProfile, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    const newAvatarUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profilePictureUrl: newAvatarUrl }));
    toast.info("Image staged for upload. Click 'Save Changes' to confirm.");
  };

  const handleSave = async () => {
    if (!formData.firstName.trim()) {
      toast.error("First Name is required");
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Authentication session has expired. Please log in again.");
      return;
    }

    setIsSaving(true);

    try {
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userAddress: formData.userAddress,
        phone: formData.phone,
        location: formData.location,
      };

      // --- THIS IS THE CORRECTED FETCH CALL ---
      const response = await fetch(`${API_URL}/user/update-profile`, { // Corrected URL
        method: 'POST', // Corrected Method
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        let errorMsg = `Request failed: ${response.statusText}`;
        try {
            const errorResult = await response.json();
            errorMsg = errorResult.error || errorMsg;
        } catch (e) {
            // Response was not JSON, stick with the status text
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      onSave(result.user);
      toast.success("Profile updated successfully!");
      onClose();

    } catch (error: any) {
      console.error("Failed to save profile:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-border rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.profilePictureUrl} />
              <AvatarFallback className="text-xl">
                {(formData.firstName?.[0] || '') + (formData.lastName?.[0] || '')}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={isSaving}
            >
              <Camera size={16} className="mr-2" />
              Change Photo
            </Button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="bg-input-background border-border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                className="bg-input-background border-border rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              className="bg-muted border-border rounded-lg"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className="bg-input-background border-border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userAddress">Address</Label>
            <Input
              id="userAddress"
              name="userAddress"
              value={formData.userAddress || ''}
              onChange={handleInputChange}
              className="bg-input-background border-border rounded-lg"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
