import { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const FeatureCard = ({ icon, title, description, link, linkText }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center mb-4">
        <div className="text-4xl text-primary mr-3">{icon}</div>
        <h3 className="text-xl font-bold font-roboto">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={link} className="text-primary font-medium flex items-center hover:underline">
        {linkText} <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default FeatureCard;
