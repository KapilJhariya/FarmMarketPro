import { Helmet } from "react-helmet";
import Hero from "@/components/home/Hero";
import StatsSummary from "@/components/home/StatsSummary";
import CropPriceTracker from "@/components/crops/CropPriceTracker";
import ProductList from "@/components/marketplace/ProductList";
import RentalList from "@/components/rentals/RentalList";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>AgriConnect - Smart Farming Solutions</title>
        <meta
          name="description"
          content="Monitor crop prices, purchase farming supplies, and arrange equipment rentals all in one place with AgriConnect, your all-in-one agricultural management platform."
        />
        <meta property="og:title" content="AgriConnect - Smart Farming Solutions" />
        <meta
          property="og:description"
          content="Monitor crop prices, purchase farming supplies, and arrange equipment rentals all in one place."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex flex-col">
        <Hero />
        <StatsSummary />
        <CropPriceTracker />
        <ProductList />
        <RentalList />
        <CallToAction />
      </div>
    </>
  );
}
