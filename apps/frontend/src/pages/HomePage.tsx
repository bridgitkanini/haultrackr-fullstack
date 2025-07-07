import React from "react";
import { useNavigate } from "react-router-dom";
import TripForm from "../components/TripForm";
import { TripData } from "../types/tripTypes";
import { Truck, BarChart } from "lucide-react";
interface HomePageProps {
  onTripSubmit: (data: TripData) => void;
}
const HomePage: React.FC<HomePageProps> = ({ onTripSubmit }) => {
  const navigate = useNavigate();
  const handleSubmit = (data: TripData) => {
    onTripSubmit(data);
    navigate("/route-details");
  };
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="w-full flex justify-center items-center py-8 md:py-12 relative">
        {/* Left Green Circle */}
        <div className="hidden md:block absolute left-56 top-2 z-0">
          <div className="w-32 h-32 bg-[#14B8A6] rounded-full opacity-90"></div>
        </div>
        {/* Mobile Left Green Circle */}
        <div className="md:hidden absolute -left-6 top-4 z-0">
          <div className="w-24 h-24 bg-[#14B8A6] rounded-full opacity-90"></div>
        </div>
        <div className="w-full max-w-4xl px-4 relative z-10">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Truck on highway"
            className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white"
            style={{ objectPosition: "center" }}
          />
        </div>
        {/* Right Green Circle */}
        <div className="hidden md:block absolute right-56 -bottom-6 z-0">
          <div className="w-48 h-48 bg-teal-700 rounded-full opacity-90"></div>
        </div>
        {/* Mobile Right Green Circle */}
        <div className="md:hidden absolute -right-6 bottom-4 z-0">
          <div className="w-32 h-32 bg-teal-700 rounded-full opacity-90"></div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Trip Route & ELD Log Generator
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Plan your routes, manage your hours, and stay compliant with our
              easy-to-use tool
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900 rounded-full mb-4">
                <div className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                Route Planning
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get optimized routes with rest stops and fueling points
                automatically calculated
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900 rounded-full mb-4">
                <BarChart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                ELD Compliance
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Generate HOS-compliant logs automatically based on your planned
                route
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900 rounded-full mb-4">
                <Truck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                Driver-Focused
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Designed by drivers for drivers to make your job easier and more
                efficient
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#14B8A6] rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-700 rounded-full"></div>
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Truck on highway"
                  className="w-full h-auto rounded-lg shadow-lg relative z-10"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <TripForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
