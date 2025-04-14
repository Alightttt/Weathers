
import React from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { ArrowLeft, Cloud, Sun, CloudRain, Wind, Github, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
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
          <h1 className="text-xl font-medium text-white">About</h1>
          <div className="w-9"></div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 text-center">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <Sun className="h-14 w-14 text-amber-300 animate-spin-slow" />
                <Cloud className="h-10 w-10 text-white/80 absolute -right-3 -bottom-2" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">Weathers</h2>
            <p className="text-white/70 text-sm">Version 2.0.0</p>
            
            <div className="mt-6 flex justify-center space-x-4">
              <a 
                href="https://x.com/alightcodess" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20"
              >
                <Github className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">
            <h3 className="text-white font-medium mb-3">About the App</h3>
            <p className="text-white/80 text-sm">
              Weathers is a modern, intuitive weather application designed to provide accurate and 
              detailed weather information for any location around the world. With beautiful visualizations, 
              hourly and 30-day forecasts, and an interactive map, Weathers helps you stay prepared 
              for any weather conditions.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">
            <h3 className="text-white font-medium mb-3">Features</h3>
            <ul className="text-white/80 text-sm space-y-3">
              <li className="flex items-center">
                <CloudRain className="h-4 w-4 mr-2 text-blue-400" />
                Real-time weather data
              </li>
              <li className="flex items-center">
                <Sun className="h-4 w-4 mr-2 text-amber-300" />
                Hourly and 30-day forecasts
              </li>
              <li className="flex items-center">
                <Wind className="h-4 w-4 mr-2 text-gray-300" />
                Detailed weather conditions
              </li>
              <li className="flex items-center">
                <Cloud className="h-4 w-4 mr-2 text-white" />
                Interactive weather map
              </li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">
            <h3 className="text-white font-medium mb-3">Credits</h3>
            <p className="text-white/80 text-sm">
              Weather data provided by Open-Meteo Weather API. Icons by Lucide Icons.
              Background images from Unsplash.
            </p>
            <p className="text-white/80 text-sm mt-2">
              Developed by Weather App Team. For any inquiries, please contact us on Twitter.
            </p>
          </div>
        </div>
      </div>
    </WeatherLayout>
  );
};

export default AboutPage;
