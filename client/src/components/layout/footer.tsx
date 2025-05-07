import { Recycle, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Recycle className="h-6 w-6" />
              <h2 className="text-xl font-bold text-white font-roboto">AgriManage</h2>
            </div>
            <p className="mb-4 text-sm">
              Your complete agricultural management platform. Track prices, purchase supplies, and arrange equipment rentals all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="hover:text-white">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/prices">
                  <a className="hover:text-white">Crop Prices</a>
                </Link>
              </li>
              <li>
                <Link href="/marketplace">
                  <a className="hover:text-white">Marketplace</a>
                </Link>
              </li>
              <li>
                <Link href="/rentals">
                  <a className="hover:text-white">Equipment Rentals</a>
                </Link>
              </li>
              <li>
                <Link href="/order-history">
                  <a className="hover:text-white">My Account</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">Farming Guides</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Market Reports</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Weather Forecast</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Sustainable Practices</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Community Forum</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                <span>123 Farm Road, Agriville, AG 54321</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-secondary mr-2" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-secondary mr-2" />
                <span>support@agrimanage.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} AgriManage. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
