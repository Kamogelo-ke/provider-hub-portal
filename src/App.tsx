
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Browse from "./pages/Browse";
import ProviderDashboard from "./pages/ProviderDashboard";
import SubmitService from "./pages/SubmitService";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/provider-signup" element={<Signup />} />
          <Route 
            path="/browse" 
            element={
              <ProtectedRoute>
                <Browse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/provider-dashboard" 
            element={
              <ProtectedRoute>
                <ProviderDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit-service" 
            element={
              <ProtectedRoute>
                <SubmitService />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {user && <BottomNavigation />}
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
