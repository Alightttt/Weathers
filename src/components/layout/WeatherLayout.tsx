
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import WeatherNavBar from './WeatherNavBar';

interface WeatherLayoutProps {
  children: React.ReactNode;
  bgGradient?: string;
}

const WeatherLayout: React.FC<WeatherLayoutProps> = ({ 
  children, 
  bgGradient = "from-blue-400 to-blue-600" 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-1000 relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPC9zdmc+')] opacity-30"></div>
      
      {/* Main content */}
      <div className="relative z-10 py-8 px-4 md:px-6 max-w-md mx-auto min-h-screen flex flex-col">
        <div className="flex-grow pb-16">{children}</div>
        <WeatherNavBar />
      </div>
      
      <Toaster />
      <Sonner />
    </div>
  );
};

export default WeatherLayout;
