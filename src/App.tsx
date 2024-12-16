import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Audience from "./pages/Audience";
import Naming from "./pages/Naming";
import Sentiment from "./pages/Sentiment";
import Performance from "./pages/Performance";
import Reports from "./pages/Reports";
import Planning from "./pages/Planning";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Connections from "./pages/Connections";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Campaigns from "./pages/Campaigns";
import Brands from "./pages/Brands";
import WebsitePerformance from "./pages/WebsitePerformance";
import LaunchAds from "./pages/LaunchAds";
import Auth from "./pages/Auth";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/naming" element={<Naming />} />
          <Route path="/audience" element={<Audience />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/website-performance" element={<WebsitePerformance />} />
          <Route path="/launch-ads" element={<LaunchAds />} />
          <Route path="/ad-performance" element={<Performance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<Index />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;