import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-[#FFA000] h-8 w-8 mr-2"
              >
                <path d="M12 2a9 9 0 0 0-9 9c0 4.17 2.95 7.92 7 8.8V22l4-2 .5 2 .5-2 4 2v-2.2c4.05-.88 7-4.63 7-8.8a9 9 0 0 0-9-9Z"/>
                <path d="M8 12h8"/>
                <path d="M10 9v6"/>
                <path d="M14 9v6"/>
              </svg>
              <h2 className="font-bold text-xl">AgriConnect</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Your all-in-one platform for agricultural management and supplies.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/crops" className="text-gray-400 hover:text-white transition">
                  Crop Prices
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-400 hover:text-white transition">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/rentals" className="text-gray-400 hover:text-white transition">
                  Equipment Rentals
                </Link>
              </li>
              <li>
                <Link to="/order-history" className="text-gray-400 hover:text-white transition">
                  Order History
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Weather Forecasts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Crop Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Farming Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Market Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Community Forum
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-[#FFA000] mr-2 mt-1 h-5 w-5" />
                <span className="text-gray-400">
                  123 Farming Road<br />Agriville, CA 95864
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="text-[#FFA000] mr-2 h-5 w-5" />
                <span className="text-gray-400">(800) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-[#FFA000] mr-2 h-5 w-5" />
                <span className="text-gray-400">support@agriconnect.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AgriConnect. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
