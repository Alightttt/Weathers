
import React from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage: React.FC = () => {
  return (
    <WeatherLayout bgGradient="bg-[#FFDE5F]">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-6 text-black">About</h1>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/10 mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold text-black">Weather App</h2>
          </CardHeader>
          <CardContent>
            <p className="text-black/80 mb-4">
              A beautiful and responsive weather application that provides accurate weather forecasts and hourly data. 
              Get real-time updates on temperature, precipitation, wind speed, and more.
            </p>
            <p className="text-black/80 mb-4">
              This app uses Open-Meteo APIs to fetch accurate weather data and presents it in an easy-to-understand format.
            </p>
            <div className="mt-6">
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-black/80"
                onClick={() => window.open('https://github.com/lovableio/weather-app', '_blank')}
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/10">
          <CardHeader>
            <h2 className="text-xl font-semibold text-black">Version</h2>
          </CardHeader>
          <CardContent>
            <p className="text-black/80">Weather App v1.0.0</p>
            <p className="text-black/60 text-sm mt-1">Last updated: April 2025</p>
          </CardContent>
        </Card>
      </div>
    </WeatherLayout>
  );
};

export default AboutPage;
