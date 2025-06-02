
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const SubmitService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    location: "",
    price_range: "",
    contact_phone: "",
    contact_email: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to submit a service");
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .insert([
          {
            ...formData,
            provider_id: user.id,
            category_id: formData.category_id || null,
          }
        ]);

      if (error) throw error;

      toast.success("Service submitted successfully! It will be reviewed and published soon.");
      navigate('/provider-dashboard');
    } catch (error) {
      console.error('Error submitting service:', error);
      toast.error("Failed to submit service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submit Your Service</CardTitle>
            <CardDescription>
              Fill out the form below to list your service on our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Title */}
              <div>
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Professional House Cleaning"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe your service in detail..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Service Area</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Downtown, Westside, or specific neighborhoods"
                />
              </div>

              {/* Price Range */}
              <div>
                <Label htmlFor="price_range">Price Range</Label>
                <Input
                  id="price_range"
                  name="price_range"
                  value={formData.price_range}
                  onChange={handleChange}
                  placeholder="e.g., $50-80/hour, $100-200/project"
                />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Phone Number</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email Address</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Service"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitService;
