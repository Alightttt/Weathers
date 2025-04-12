
import React from 'react';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastSection from '@/components/ForecastSection';
import HourlyChart from '@/components/HourlyChart';
import { WeatherData, ForecastData } from '../types/weather';

interface WeatherDashboardProps {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ 
  currentWeather,
  forecast,
  isLoading
}) => {
  if (!currentWeather && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/70">No weather data available. Please search for a city or allow location access.</p>
      </div>
    );
  }
  
  return (
    <>
      <CurrentWeather data={currentWeather} isLoading={isLoading} />
      
      <div className="mt-4">
        <HourlyChart data={forecast} isLoading={isLoading} />
      </div>
      
      <div className="mt-4">
        <ForecastSection data={forecast} isLoading={isLoading} />
      </div>
      
      <div className="mt-8 mb-4 text-center">
        <p className="text-xs text-white/50">Data provided by Open-Meteo</p>
      </div>
    </>
  );
};

export default WeatherDashboard;
