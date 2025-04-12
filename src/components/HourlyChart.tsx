
import { ForecastData } from '@/features/weather/types/weather';
import { getHourlyForecast, getHour } from '@/lib/weather-utils';
import { WeatherIcon } from './WeatherIcons';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface HourlyChartProps {
  data: ForecastData | null;
  isLoading: boolean;
}

const HourlyChart = ({ data, isLoading }: HourlyChartProps) => {
  const [offset, setOffset] = useState(0);
  const DISPLAY_COUNT = 5;

  if (isLoading || !data) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-32 bg-white/10" />
          <Skeleton className="h-5 w-8 bg-white/10" />
        </div>
        <div className="flex justify-between items-end">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className="h-3 w-12 bg-white/10" />
              <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
              <Skeleton className="h-4 w-8 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Safely handle potential null/undefined values
  const hourlyData = data ? getHourlyForecast(data) : [];
  
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">
        <p className="text-white/60 text-center">No hourly forecast data available</p>
      </div>
    );
  }
  
  const visibleData = hourlyData.slice(offset, offset + DISPLAY_COUNT);
  
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white/90 font-medium">Hourly Forecast</h3>
        <ChevronRight className="h-4 w-4 text-white/60" />
      </div>
      <div className="flex justify-between mb-2">
        {visibleData.map((hour, i) => {
          const temp = Math.round(hour.main.temp);
          
          return (
            <div key={i} className="flex flex-col items-center space-y-2">
              <span className="text-xs text-white/70">{getHour(hour.dt)}</span>
              <div className="w-10 h-10">
                <WeatherIcon weatherCondition={hour.weather[0].main} size="small" />
              </div>
              <span className="text-white font-medium">{temp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyChart;
