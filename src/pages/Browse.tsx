
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Phone, Mail } from "lucide-react";

// Mock data - will be replaced with Supabase data
const mockServices = [
  {
    id: 1,
    title: "Professional House Cleaning",
    provider: "Clean Masters LLC",
    description: "Thorough residential cleaning services with eco-friendly products",
    category: "Cleaning",
    location: "Downtown",
    rating: 4.8,
    reviews: 124,
    price: "$50-80/hour",
    contact: {
      phone: "(555) 123-4567",
      email: "info@cleanmasters.com"
    }
  },
  {
    id: 2,
    title: "Plumbing Repairs & Installation",
    provider: "Fix-It Plumbing",
    description: "Licensed plumber with 10+ years experience. Emergency services available",
    category: "Home Repair",
    location: "Westside",
    rating: 4.9,
    reviews: 89,
    price: "$75-120/hour",
    contact: {
      phone: "(555) 987-6543",
      email: "contact@fixitplumbing.com"
    }
  },
  {
    id: 3,
    title: "Dog Walking & Pet Sitting",
    provider: "Happy Paws Services",
    description: "Reliable pet care services with flexible scheduling",
    category: "Pet Care",
    location: "Eastside",
    rating: 4.7,
    reviews: 156,
    price: "$25-40/visit",
    contact: {
      phone: "(555) 456-7890",
      email: "hello@happypaws.com"
    }
  }
];

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Cleaning", "Home Repair", "Pet Care", "Gardening", "Tutoring"];

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
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
            {categories.map(category => (
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
          {filteredServices.map(service => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">{service.category}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {service.rating} ({service.reviews})
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription className="font-medium text-blue-600">
                  {service.provider}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {service.location}
                </div>
                
                <div className="text-lg font-semibold text-green-600 mb-4">
                  {service.price}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`tel:${service.contact.phone}`} className="text-blue-600 hover:underline">
                      {service.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`mailto:${service.contact.email}`} className="text-blue-600 hover:underline">
                      {service.contact.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
