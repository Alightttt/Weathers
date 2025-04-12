
import { ForecastData } from '@/features/weather/types/weather';
import { getHourlyForecast, getHour } from '@/lib/weather-utils';
import { WeatherIcon } from './WeatherIcons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface HourlyChartProps {
  data: ForecastData | null;
  isLoading: boolean;
}

const HourlyChart = ({ data, isLoading }: HourlyChartProps) => {
  const [offset, setOffset] = useState(0);
  const DISPLAY_COUNT = 8;

  if (isLoading || !data) {
    return (
      <div className="glass-card p-4 mt-6 h-[180px] animate-pulse">
        <div className="flex justify-between items-center mb-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-3 w-10 bg-gray-600/30 rounded mb-2" />
              <Skeleton className="h-8 w-8 bg-gray-600/30 rounded-full mb-2" />
              <Skeleton className="h-3 w-8 bg-gray-600/30 rounded" />
            </div>
          ))}
        </div>
        <div className="relative h-16 mt-6">
          <Skeleton className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600/30 rounded" />
        </div>
      </div>
    );
  }

  // Safely handle potential null/undefined values
  const hourlyData = data ? getHourlyForecast(data) : [];
  
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="glass-card p-6 mt-6 text-center">
        <p className="text-white/60">No hourly forecast data available</p>
      </div>
    );
  }
  
  const visibleData = hourlyData.slice(offset, offset + DISPLAY_COUNT);
  
  const handlePrevious = () => {
    if (offset > 0) {
      setOffset(offset - 1);
    }
  };

  const handleNext = () => {
    if (offset + DISPLAY_COUNT < hourlyData.length) {
      setOffset(offset + 1);
    }
  };
  
  // Calculate min/max temperature only if we have data
  const minTemp = visibleData.length > 0 ? Math.min(...visibleData.map(h => h.main.temp)) : 0;
  const maxTemp = visibleData.length > 0 ? Math.max(...visibleData.map(h => h.main.temp)) : 0;
  const range = maxTemp - minTemp;
  
  return (
    <div className="glass-card p-6 mt-6 animate-fade-in relative">
      <div className="flex justify-between items-end mb-4 overflow-x-hidden">
        {visibleData.map((hour, i) => {
          const temp = Math.round(hour.main.temp);
          
          return (
            <div key={i} className="flex flex-col items-center mx-1 relative">
              <p className="hourly-temp mb-1">{temp}°</p>
              <div className="w-8 my-2">
                <WeatherIcon weatherCondition={hour.weather[0].main} size="small" />
              </div>
              <div className="text-xs mt-1 font-medium text-gray-400">
                {getHour(hour.dt)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="relative h-20 mt-4">
        <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${visibleData.length - 1} 100`}>
          <path
            d={visibleData.map((hour, i) => {
              const temp = hour.main.temp;
              const height = range === 0 ? 50 : 20 + ((temp - minTemp) / range) * 80;
              
              return `${i === 0 ? 'M' : 'L'} ${i} ${100 - height}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {visibleData.map((hour, i) => {
            const temp = hour.main.temp;
            const height = range === 0 ? 50 : 20 + ((temp - minTemp) / range) * 80;
            
            return (
              <circle 
                key={i}
                cx={i} 
                cy={100 - height} 
                r="3" 
                fill="white" 
              />
            );
          })}
        </svg>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
        <Button 
          size="icon" 
          variant="ghost" 
          className="w-8 h-8 rounded-full text-white/70 hover:text-white"
          onClick={handlePrevious}
          disabled={offset === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          className="w-8 h-8 rounded-full text-white/70 hover:text-white"
          onClick={handleNext}
          disabled={offset + DISPLAY_COUNT >= hourlyData.length}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HourlyChart;
