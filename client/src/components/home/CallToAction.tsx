import { Link } from "wouter";
import { UserPlus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-12 bg-[#2E7D32] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to streamline your farm operations?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Join thousands of farmers who use AgriConnect to save time, reduce costs, and increase productivity.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg"
            className="bg-white text-[#2E7D32] hover:bg-gray-100 border-0"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Create Free Account
          </Button>
          <Button 
            size="lg"
            variant="outline" 
            className="bg-transparent text-white hover:bg-white hover:text-[#2E7D32] border-white"
          >
            <Video className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
