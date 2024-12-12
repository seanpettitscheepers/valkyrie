import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Audience from "./pages/Audience";
import Naming from "./pages/Naming";
import Sentiment from "./pages/Sentiment";
import Performance from "./pages/Performance";
import Reports from "./pages/Reports";
import Planning from "./pages/Planning";
import Account from "./pages/Account";
import Connections from "./pages/Connections";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Campaigns from "./pages/Campaigns";
import Brands from "./pages/Brands";
import WebsitePerformance from "./pages/WebsitePerformance";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";

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
          <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
          <Route path="/naming" element={<ProtectedRoute><Naming /></ProtectedRoute>} />
          <Route path="/audience" element={<ProtectedRoute><Audience /></ProtectedRoute>} />
          <Route path="/sentiment" element={<ProtectedRoute><Sentiment /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
          <Route path="/website-performance" element={<ProtectedRoute><WebsitePerformance /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/planning" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/brands" element={<ProtectedRoute><Brands /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;