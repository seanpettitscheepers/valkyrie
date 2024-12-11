import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Audience from "./pages/Audience";
import Naming from "./pages/Naming";
import Sentiment from "./pages/Sentiment";
import Performance from "./pages/Performance";
import Reports from "./pages/Reports";
import Planning from "./pages/Planning";
import Account from "./pages/Account";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Index />} />
          <Route path="/naming" element={<Naming />} />
          <Route path="/audience" element={<Audience />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/settings" element={<Index />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;