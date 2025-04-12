
import { ForecastData } from '@/features/weather/types/weather';
import { getHourlyForecast, getHour } from '@/lib/weather-utils';
import { WeatherIcon } from './WeatherIcons';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface HourlyChartProps {
  data: ForecastData | null;
  isLoading: boolean;
}

const HourlyChart = ({ data, isLoading }: HourlyChartProps) => {
  const [offset, setOffset] = useState(0);
  const [temperatureUnit, setTemperatureUnit] = useState<string>(localStorage.getItem('temperatureUnit') || '°C');
  const DISPLAY_COUNT = 5;

  useEffect(() => {
    // Set temperature unit from settings
    const savedTempUnit = localStorage.getItem('temperatureUnit');
    if (savedTempUnit) {
      setTemperatureUnit(savedTempUnit);
    }
  }, []);

  // Convert temperature based on unit
  const convertTemperature = (temp: number): number => {
    if (temperatureUnit === '°C') {
      return temp;
    } else {
      // Convert to Fahrenheit
      return (temp * 9/5) + 32;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-white/10 rounded-3xl shadow-xl">
        <CardHeader className="pb-2 pt-4">
          <Skeleton className="h-5 w-32 bg-white/10" />
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex justify-between items-end">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-3 w-12 bg-white/10" />
                <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                <Skeleton className="h-4 w-8 bg-white/10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Safely handle potential null/undefined values
  const hourlyData = data ? getHourlyForecast(data) : [];
  
  if (!hourlyData || hourlyData.length === 0) {
    return null;
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
  
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 rounded-3xl shadow-xl">
      <CardHeader className="pb-2 pt-4 flex flex-row justify-between items-center">
        <h3 className="text-white/90 font-medium">Hourly Forecast</h3>
        <div className="flex space-x-1">
          <button 
            onClick={handlePrevious} 
            disabled={offset === 0}
            className="text-white/60 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={handleNext} 
            disabled={offset + DISPLAY_COUNT >= hourlyData.length}
            className="text-white/60 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex justify-between">
          {visibleData.map((hour, i) => {
            // Convert temperature based on selected unit
            const temp = Math.round(convertTemperature(hour.main.temp));
            
            return (
              <div key={i} className="flex flex-col items-center space-y-3">
                <span className="text-sm font-medium text-white">{getHour(hour.dt)}</span>
                <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
                  <WeatherIcon weatherCondition={hour.weather[0].main} size="small" />
                </div>
                <span className="text-white font-bold">{temp}{temperatureUnit}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyChart;
