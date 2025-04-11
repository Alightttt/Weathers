
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
  
  return (
    <div className="glass-card p-6 mt-6 animate-fade-in relative">
      <div className="flex justify-between items-end mb-4 overflow-x-hidden">
        {hourlyData.map((hour, i) => {
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
        <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${hourlyData.length - 1} 100`}>
          <path
            d={hourlyData.map((hour, i) => {
              const temp = hour.main.temp;
              const minTemp = Math.min(...hourlyData.map(h => h.main.temp));
              const maxTemp = Math.max(...hourlyData.map(h => h.main.temp));
              const range = maxTemp - minTemp;
              const height = range === 0 ? 50 : 20 + ((temp - minTemp) / range) * 80;
              
              return `${i === 0 ? 'M' : 'L'} ${i} ${100 - height}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
        <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full text-white/70 hover:text-white">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full text-white/70 hover:text-white">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HourlyChart;
