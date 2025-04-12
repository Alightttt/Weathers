
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import WeatherNavBar from './WeatherNavBar';

interface WeatherLayoutProps {
  children: React.ReactNode;
  bgGradient?: string;
}

const WeatherLayout: React.FC<WeatherLayoutProps> = ({ 
  children, 
  bgGradient = "from-blue-400/70 to-blue-600/70" 
}) => {
  // Add weather animations to the background based on the current condition
  useEffect(() => {
    const weatherClass = document.documentElement.style.getPropertyValue('--weather-animation');
    const animationContainer = document.querySelector('.weather-animation-container');
    if (animationContainer) {
      animationContainer.className = `weather-animation-container w-full h-full ${weatherClass || ''}`;
    }
  }, [bgGradient]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-1000 relative overflow-hidden`}>
      {/* Nature background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000" 
          alt="Nature background" 
          className="object-cover w-full h-full opacity-40"
        />
      </div>
      
      {/* Content overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-0"></div>
      
      {/* Weather animation container - positioned in background but with lower opacity */}
      <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none opacity-20">
        <div className="weather-animation-container w-full h-full"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 py-6 px-4 md:px-6 max-w-7xl mx-auto min-h-screen flex flex-col">
        <div className="flex-grow">{children}</div>
        <div className="h-16"></div> {/* Space for footer */}
      </div>
      
      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <WeatherNavBar />
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default WeatherLayout;
