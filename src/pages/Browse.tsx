
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select(`
          *,
          categories!inner(name),
          profiles!inner(full_name)
        `)
        .eq('status', 'active');

      if (selectedCategory !== "All") {
        const category = categories.find(cat => cat.name === selectedCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const allCategories = ["All", ...categories.map(cat => cat.name)];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Services</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">{service.categories?.name}</Badge>
                  <div className="text-sm text-gray-500">
                    {service.views} views
                  </div>
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription className="font-medium text-blue-600">
                  {service.profiles?.full_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                {service.location && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {service.location}
                  </div>
                )}
                
                {service.price_range && (
                  <div className="text-lg font-semibold text-green-600 mb-4">
                    {service.price_range}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {service.contact_phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`tel:${service.contact_phone}`} className="text-blue-600 hover:underline">
                        {service.contact_phone}
                      </a>
                    </div>
                  )}
                  {service.contact_email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${service.contact_email}`} className="text-blue-600 hover:underline">
                        {service.contact_email}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
