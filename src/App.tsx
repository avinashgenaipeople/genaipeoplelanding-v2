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
import LpV1 from "./pages/LpV1";
import LpV3 from "./pages/LpV3";
import LpV4 from "./pages/LpV4";
import LpV5 from "./pages/LpV5";
import LpV6 from "./pages/LpV6";
import LpV7 from "./pages/LpV7";
import LpV1Short from "./pages/LpV1Short";
import LpV2Short from "./pages/LpV2Short";

const Analytics = lazy(() => import("./pages/Analytics"));
const Webinar = lazy(() => import("./pages/Webinar"));
const WebinarMeeting = lazy(() => import("./pages/WebinarMeeting"));

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
            <Route path="/lp-v1" element={<LpV1 />} />
            <Route path="/lp-v2" element={<LpV2 />} />
            <Route path="/lp-v3" element={<LpV3 />} />
            <Route path="/lp-v4" element={<LpV4 />} />
            <Route path="/lp-v5" element={<LpV5 />} />
            <Route path="/lp-v6" element={<LpV6 />} />
            <Route path="/lp-v7" element={<LpV7 />} />
            <Route path="/lp-v1-short" element={<LpV1Short />} />
            <Route path="/lp-v2-short" element={<LpV2Short />} />
            <Route path="/analytics" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}><Analytics /></Suspense>} />
            <Route path="/webinar" element={<Suspense fallback={null}><Webinar /></Suspense>} />
            <Route path="/webinar/meeting" element={<Suspense fallback={null}><WebinarMeeting /></Suspense>} />
{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FormModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
