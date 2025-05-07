import { TrendingUp, Package, Tractor } from "lucide-react";

export default function StatsSummary() {
  const stats = [
    {
      icon: <TrendingUp className="h-10 w-10 text-[#2E7D32] mb-3" />,
      title: "Live Price Updates",
      description: "Real-time data for 50+ crops from major markets"
    },
    {
      icon: <Package className="h-10 w-10 text-[#2E7D32] mb-3" />,
      title: "Verified Suppliers",
      description: "Over 200 verified suppliers of farming products"
    },
    {
      icon: <Tractor className="h-10 w-10 text-[#2E7D32] mb-3" />,
      title: "Equipment Network",
      description: "Access to 500+ rental equipment options nearby"
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-[#F5F5F5] rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center">
                {stat.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{stat.title}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
