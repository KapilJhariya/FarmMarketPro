import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-primary/10 to-primary/5">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
          नमस्ते किसान
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-700">
          Your trusted agricultural management platform
        </p>
        <Link href="/marketplace">
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-yellow-600 text-white py-3 px-8 rounded-full text-lg font-medium"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;