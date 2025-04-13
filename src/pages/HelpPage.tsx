
import React from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { ArrowLeft, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <WeatherLayout bgGradient="from-gray-800 to-gray-900">
      <div className="relative z-10 pb-20">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-medium text-white">Help & Support</h1>
          <div className="w-9"></div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">
            <h3 className="text-white font-medium mb-3">How to use the app</h3>
            <p className="text-white/80 text-sm mb-4">
              Weather App provides real-time weather information for locations around the world.
              Here's how to get started:
            </p>
            <ul className="text-white/70 text-sm space-y-2 ml-4 list-disc">
              <li>Allow location access to see weather at your current location</li>
              <li>Search for any city using the search icon</li>
              <li>Switch between different units in settings</li>
              <li>View hourly and weekly forecasts</li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">
            <h3 className="text-white font-medium mb-3">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white/90 font-medium mb-1">How accurate is the weather data?</h4>
                <p className="text-white/70 text-sm">
                  We use reliable weather APIs to provide accurate forecasts, typically updated every hour.
                </p>
              </div>
              
              <div>
                <h4 className="text-white/90 font-medium mb-1">Can I change temperature units?</h4>
                <p className="text-white/70 text-sm">
                  Yes, go to Settings and tap on Temperature Unit to toggle between Celsius and Fahrenheit.
                </p>
              </div>
              
              <div>
                <h4 className="text-white/90 font-medium mb-1">How do I enable notifications?</h4>
                <p className="text-white/70 text-sm">
                  Go to Settings, find Notifications and toggle it on to receive weather alerts.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">
            <h3 className="text-white font-medium mb-3">Contact & Source Code</h3>
            <p className="text-white/80 text-sm mb-3">
              Find the source code for this project on GitHub:
            </p>
            <a 
              href="https://github.com/Alightttt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-3 bg-blue-500/80 hover:bg-blue-600/80 py-2 px-4 rounded-xl text-white flex items-center justify-center w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </WeatherLayout>
  );
};

export default HelpPage;
