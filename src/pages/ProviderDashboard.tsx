
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Edit, Eye, Star, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ProviderDashboard = () => {
  const { user } = useAuth();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['provider-services', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          categories(name)
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const totalViews = services.reduce((sum, service) => sum + (service.views || 0), 0);
  const activeServices = services.filter(service => service.status === "active").length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-600">Manage your services and track performance</p>
          </div>
          <Link to="/submit-service">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Badge variant="secondary">{activeServices}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">Total listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Services</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services.filter(s => s.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">No reviews yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Services</CardTitle>
            <CardDescription>
              Manage and track the performance of your service listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't posted any services yet.</p>
                <Link to="/submit-service">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Service
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{service.title}</h3>
                        <Badge variant={service.status === "active" ? "default" : "secondary"}>
                          {service.status}
                        </Badge>
                        {service.categories && (
                          <Badge variant="outline">{service.categories.name}</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{service.views || 0} views</span>
                        {service.location && <span>{service.location}</span>}
                        {service.price_range && <span>{service.price_range}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;
