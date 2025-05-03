import React from "react";
import { Search, Info, Settings, LayoutDashboard } from "lucide-react";
import { features } from "@/lib/data";

const featureIcons = {
  search: <Search className="h-6 w-6" />,
  info: <Info className="h-6 w-6" />,
  settings: <Settings className="h-6 w-6" />,
  dashboard: <LayoutDashboard className="h-6 w-6" />,
};

const Features = () => {
  return (
    <section className="bg-gray-50 section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-gradient">WheelsTrust</span>
          </h2>
          <p className="text-gray-600">
            We're revolutionizing the way people buy, sell, and service vehicles by
            prioritizing transparency and building trust between all parties.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover-scale"
            >
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {featureIcons[feature.icon as keyof typeof featureIcons]}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Join the WheelsTrust community today
              </h3>
              <p className="text-blue-100 mb-6 md:mb-0">
                Experience a new standard in automotive transactions and services.
                Whether you're buying, selling, or maintaining your vehicle, we're
                here to help every step of the way.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <button className="bg-white text-primary font-medium px-6 py-3 rounded-lg hover:shadow-lg transition duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
