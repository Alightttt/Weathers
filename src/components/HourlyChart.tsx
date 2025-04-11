
import { ForecastData, getHourlyForecast, getHour } from '@/lib/weather-utils';
import { WeatherIcon } from './WeatherIcons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HourlyChartProps {
  data: ForecastData;
  isLoading: boolean;
}

const HourlyChart = ({ data, isLoading }: HourlyChartProps) => {
  if (isLoading) {
    return (
      <div className="glass-card p-4 mt-6 h-[180px] animate-pulse">
        <div className="flex justify-between items-center mb-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-3 w-10 bg-gray-600/30 rounded mb-2"></div>
              <div className="h-8 w-8 bg-gray-600/30 rounded-full mb-2"></div>
              <div className="h-3 w-8 bg-gray-600/30 rounded"></div>
            </div>
          ))}
        </div>
        <div className="relative h-16 mt-6">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const hourlyData = getHourlyForecast(data);
  const maxTemp = Math.max(...hourlyData.map(hour => hour.main.temp));
  const minTemp = Math.min(...hourlyData.map(hour => hour.main.temp));
  const range = maxTemp - minTemp;
  
  const calculateHeight = (temp: number) => {
    // Min height should be 20% of available space
    return range === 0 ? 50 : 20 + ((temp - minTemp) / range) * 80;
  };

  return (
    <div className="glass-card p-6 mt-6 animate-fade-in relative">
      <div className="flex justify-between items-end mb-4 overflow-x-hidden">
        {hourlyData.map((hour, i) => {
          const temp = Math.round(hour.main.temp);
          const height = calculateHeight(hour.main.temp);
          
          return (
            <div key={i} className="flex flex-col items-center mx-1 relative">
              <div className="mb-1 text-xs text-gray-300">
                {getHour(hour.dt)}
              </div>
              <div className="w-8">
                <WeatherIcon weatherCondition={hour.weather[0].main} size="small" />
              </div>
              <div className="text-xs mt-1 font-medium">{temp}°</div>
            </div>
          );
        })}
      </div>
      
      <div className="relative h-16 mt-4">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-600/50"></div>
        {hourlyData.map((hour, i) => {
          const height = calculateHeight(hour.main.temp);
          const xPos = (i / (hourlyData.length - 1)) * 100;
          
          return (
            <div
              key={i}
              className="absolute bottom-0 w-1 rounded-t-full bg-blue-500"
              style={{
                left: `${xPos}%`,
                height: `${height}%`,
                transform: 'translateX(-50%)',
              }}
            ></div>
          );
        })}
        
        <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${hourlyData.length - 1} 100`}>
          <path
            d={hourlyData.map((hour, i) => {
              const height = calculateHeight(hour.main.temp);
              return `${i === 0 ? 'M' : 'L'} ${i} ${100 - height}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(96, 165, 250, 0.7)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
        <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HourlyChart;
