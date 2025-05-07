import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HomePage from "@/pages/home-page";
import CropPrices from "@/pages/crop-prices";
import Marketplace from "@/pages/marketplace";
import Rentals from "@/pages/rentals";
import OrderConfirmation from "@/pages/order-confirmation";
import OrderHistory from "@/pages/order-history";
import RentalHistory from "@/pages/rental-history";
import MockReceipt from "@/pages/mock-receipt";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/prices" component={CropPrices} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/rentals" component={Rentals} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/order-confirmation/:orderId" component={OrderConfirmation} />
      <ProtectedRoute path="/order-history" component={OrderHistory} />
      <ProtectedRoute path="/rentals/history" component={RentalHistory} />
      <ProtectedRoute path="/mock-receipt" component={MockReceipt} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Router />
                </main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
