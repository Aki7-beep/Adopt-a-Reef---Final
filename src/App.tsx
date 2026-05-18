import { Router, Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { HomePage } from "@/pages/HomePage";
import { AdoptPage } from "@/pages/AdoptPage";
import { VolunteerPage } from "@/pages/VolunteerPage";
import { DonatePage } from "@/pages/DonatePage";
import { AuthPage } from "@/pages/AuthPage";
import { AccountPage } from "@/pages/AccountPage";
import { AdminPage } from "@/pages/AdminPage";
import { QRPaymentPage } from "@/pages/QRPaymentPage";
import { CardPaymentPage } from "@/pages/CardPaymentPage";
import { AboutPage } from "@/pages/AboutPage";

const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/adopt": "Adopt",
  "/volunteer": "Volunteer",
  "/donate": "Donate",
  "/donate/qr": "Donate",
  "/donate/card": "Donate",
  "/about": "About Us",
  "/auth": "Login",
  "/login": "Login",
  "/signup": "Sign Up",
  "/account": "My Account",
  "/my-adoptions": "My Adoptions",
  "/admin": "Admin",
};

/** Must match Vite `base` (e.g. /adopt-a-reef) so routes work under a subfolder */
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRoutes() {
  const [location] = useLocation();

  useEffect(() => {
    const label = PAGE_TITLES[location] ?? "Page Not Found";
    document.title = `${label} | Adopt a Reef`;
  }, [location]);

  return (
    <div
      key={location}
      className="page-fade-in"
      style={{ minHeight: "100vh" }}
    >
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/adopt" component={AdoptPage} />
        <Route path="/volunteer" component={VolunteerPage} />
        <Route path="/donate" component={DonatePage} />
        <Route path="/donate/qr" component={QRPaymentPage} />
        <Route path="/donate/card" component={CardPaymentPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/login" component={AuthPage} />
        <Route path="/signup" component={AuthPage} />
        <Route path="/account" component={AccountPage} />
        <Route path="/my-adoptions" component={AccountPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router base={ROUTER_BASE}>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
