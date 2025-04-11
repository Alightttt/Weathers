
import React from 'react';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastSection from '@/components/ForecastSection';
import HourlyChart from '@/components/HourlyChart';
import { WeatherData, ForecastData } from '../types/weather';
import { Skeleton } from '@/components/ui/skeleton';

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
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  return (
    <>
      <CurrentWeather data={currentWeather} isLoading={isLoading} />
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-white/80 mb-2">Hourly Forecast</h3>
        <HourlyChart data={forecast} isLoading={isLoading} />
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-white/80 mb-2">5-Day Forecast</h3>
        <ForecastSection data={forecast} isLoading={isLoading} />
      </div>
      
      <div className="mt-8 text-center text-sm text-white/40">
        <p>Data provided by Open-Meteo</p>
      </div>
    </>
  );
};

const LoadingSkeleton = () => {
  return (
    <>
      <div className="glass-card p-8 min-h-[300px] animate-pulse">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-4 w-full md:w-1/2">
            <Skeleton className="h-24 w-32 bg-gray-700/30" />
            <Skeleton className="h-6 w-48 bg-gray-700/30" />
            <Skeleton className="h-4 w-24 bg-gray-700/30" />
            <div className="flex flex-wrap gap-4 mt-8">
              <Skeleton className="h-16 w-24 bg-gray-700/30" />
              <Skeleton className="h-16 w-24 bg-gray-700/30" />
              <Skeleton className="h-16 w-24 bg-gray-700/30" />
            </div>
          </div>
          <div className="md:w-1/2 flex justify-end">
            <Skeleton className="h-40 w-40 rounded-full bg-gray-700/30" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Skeleton className="h-6 w-48 mb-2 bg-gray-700/30" />
        <div className="glass-card p-6 h-[180px]">
          <div className="flex justify-between items-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-3 w-8 mb-2 bg-gray-700/30" />
                <Skeleton className="h-8 w-8 rounded-full mb-2 bg-gray-700/30" />
                <Skeleton className="h-3 w-6 bg-gray-700/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Skeleton className="h-6 w-48 mb-2 bg-gray-700/30" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-4 h-[140px]">
              <div className="flex flex-col items-center space-y-3">
                <Skeleton className="h-3 w-16 bg-gray-700/30" />
                <Skeleton className="h-12 w-12 rounded-full bg-gray-700/30" />
                <Skeleton className="h-3 w-8 bg-gray-700/30" />
                <Skeleton className="h-3 w-8 bg-gray-700/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeatherDashboard;
