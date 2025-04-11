
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
  return (
    <>
      <CurrentWeather data={currentWeather as any} isLoading={isLoading} />
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-white/80 mb-2">Hourly Forecast</h3>
        <HourlyChart data={forecast as any} isLoading={isLoading} />
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-white/80 mb-2">5-Day Forecast</h3>
        <ForecastSection data={forecast as any} isLoading={isLoading} />
      </div>
      
      <div className="mt-8 text-center text-sm text-white/40">
        <p>Data provided by Open-Meteo</p>
      </div>
    </>
  );
};

export default WeatherDashboard;
