import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import CropPrices from "@/pages/CropPrices";
import Marketplace from "@/pages/Marketplace";
import Rentals from "@/pages/Rentals";
import OrderHistory from "@/pages/OrderHistory";
import Checkout from "@/pages/Checkout";
import OrderDetails from "@/pages/OrderDetails";
import RentalDetails from "@/pages/RentalDetails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/crops" component={CropPrices} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/rentals" component={Rentals} />
          <Route path="/order-history" component={OrderHistory} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders/:id" component={OrderDetails} />
          <Route path="/rentals/:id" component={RentalDetails} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
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
