import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormModalProvider } from "@/contexts/FormModalContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import LpV2 from "./pages/LpV2";
import LpV3 from "./pages/LpV3";

const Analytics = lazy(() => import("./pages/Analytics"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FormModalProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/lp-v2" element={<LpV2 />} />
            <Route path="/lp-v3" element={<LpV3 />} />
            <Route path="/analytics" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}><Analytics /></Suspense>} />
{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FormModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
