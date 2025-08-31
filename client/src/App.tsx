import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import VehicleDetailsPage from "@/pages/vehicle-details";
import ServicesPage from "@/pages/services";
import DocumentsPage from "@/pages/documents";
import EVStationsPage from "@/pages/ev-stations";
import DashboardPage from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import SupportPage from "@/pages/support";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/ev-stations" component={EVStationsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/vehicle-details" component={VehicleDetailsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
