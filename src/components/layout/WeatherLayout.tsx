
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import WeatherNavBar from './WeatherNavBar';

interface WeatherLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  bgGradient?: string;
}

const WeatherLayout: React.FC<WeatherLayoutProps> = ({ 
  children, 
  showFooter = true,
  bgGradient
}) => {
  return (
    <div className={`min-h-screen ${bgGradient || 'bg-[#FFDE5F]'} transition-colors duration-1000 relative overflow-hidden`}>
      {/* Main content */}
      <div className="relative z-10 py-6 px-4 md:px-6 max-w-md mx-auto min-h-screen flex flex-col">
        <div className="flex-grow">{children}</div>
      </div>
      
      {/* Only show footer on main pages, not on prompts */}
      {showFooter && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <WeatherNavBar />
        </div>
      )}
      
      <Toaster position="top-center" />
    </div>
  );
};

export default WeatherLayout;
