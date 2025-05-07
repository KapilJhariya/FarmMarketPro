import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="h-80 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-roboto">Grow Your Farm. Grow Your Future.</h1>
          <p className="text-xl md:text-2xl mb-8">All your farming needs in one platform</p>
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
    </div>
  );
};

export default HeroSection;
