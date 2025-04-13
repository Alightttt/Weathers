
import React from 'react';
import { Github } from 'lucide-react';
import WeatherLayout from '@/components/layout/WeatherLayout';

const AboutPage: React.FC = () => {
  return (
    <WeatherLayout>
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-black">About Weather App</h1>
        
        <div className="space-y-6 text-black/80">
          <p>
            This weather application provides real-time weather data from around the world,
            including current conditions, hourly forecasts, and weekly outlooks.
          </p>
          
          <div>
            <h2 className="text-xl font-semibold mb-2 text-black">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Real-time weather data</li>
              <li>Location-based forecasts</li>
              <li>Daily and weekly forecasts</li>
              <li>Beautiful weather visualizations</li>
              <li>Responsive design for all devices</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2 text-black">GitHub</h2>
            <div className="flex items-center space-x-2">
              <Github className="h-5 w-5" />
              <a 
                href="https://github.com/Alightttt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                github.com/Alightttt
              </a>
            </div>
            <p className="mt-2">
              Check out our GitHub repository for the source code and to contribute to the project.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2 text-black">Data Sources</h2>
            <p>
              Weather data is provided by Open-Meteo and OpenWeatherMap APIs,
              delivering accurate forecasts for locations worldwide.
            </p>
          </div>

          <div className="pt-4">
            <p className="text-xs opacity-70">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </WeatherLayout>
  );
};

export default AboutPage;
