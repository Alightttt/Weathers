
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface WeatherLayoutProps {
  children: React.ReactNode;
  bgGradient?: string;
}

const WeatherLayout: React.FC<WeatherLayoutProps> = ({ 
  children, 
  bgGradient = "from-gray-950 to-gray-900" 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} py-8 px-4 transition-colors duration-1000`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
      <Toaster />
      <Sonner />
    </div>
  );
};

export default WeatherLayout;
