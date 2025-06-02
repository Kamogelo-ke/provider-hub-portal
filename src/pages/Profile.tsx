
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    bio: "",
    is_provider: false
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: userServices = [] } = useQuery({
    queryKey: ['user-services', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        is_provider: profile.is_provider || false
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error("No user");
      
      const { error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: user.id,
            ...data,
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const activeServices = userServices.filter(s => s.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {formData.full_name || user?.email || "User"}
            </CardTitle>
            <CardDescription>
              {formData.is_provider ? "Service Provider" : "Customer"}
            </CardDescription>
            <div className="flex justify-center gap-2 mt-2">
              <Badge>Verified</Badge>
              {formData.is_provider && <Badge variant="secondary">Provider</Badge>}
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <Input 
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <Input 
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_provider"
                  name="is_provider"
                  checked={formData.is_provider}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="rounded"
                />
                <Label htmlFor="is_provider">I want to offer services as a provider</Label>
              </div>

              {isEditing && (
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Account Stats */}
        {formData.is_provider && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{activeServices}</div>
                  <div className="text-sm text-gray-600">Active Services</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">--</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {userServices.reduce((sum, s) => sum + (s.views || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">--</div>
                  <div className="text-sm text-gray-600">Inquiries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
