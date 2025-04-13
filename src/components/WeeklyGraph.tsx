
import { ForecastData } from '@/features/weather/types/weather';
import { getDailyForecasts } from '@/lib/weather-utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { WeatherIcon } from './WeatherIcons';

interface WeeklyGraphProps {
  data: ForecastData | null;
  isLoading: boolean;
}

const WeeklyGraph = ({ data, isLoading }: WeeklyGraphProps) => {
  const [temperatureUnit, setTemperatureUnit] = useState<string>(localStorage.getItem('temperatureUnit') || '°C');

  useEffect(() => {
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
      return (temp * 9/5) + 32;
    }
  };

  if (!data) {
    return null;
  }

  // Get daily forecast data
  const dailyForecasts = getDailyForecasts(data);
  
  if (!dailyForecasts || dailyForecasts.length === 0) {
    return null;
  }

  // Format data for the chart with temperature conversion
  const chartData = dailyForecasts.map(day => ({
    name: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    max: Math.round(convertTemperature(day.temp_max)),
    min: Math.round(convertTemperature(day.temp_min)),
    icon: day.weather.icon,
    condition: day.weather.main
  }));

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 rounded-3xl shadow-xl">
      <CardHeader className="pb-2 pt-4">
        <h3 className="text-white/90 font-medium">Weekly Forecast</h3>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-32 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                tick={false}
                axisLine={{ stroke: '#ffffff30' }}
                tickLine={false}
              />
              <YAxis 
                tick={false}
                axisLine={false}
                tickLine={false}
              />
              <Line 
                type="monotone" 
                dataKey="max" 
                stroke="#FFD700" 
                strokeWidth={3}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mt-2">
          {chartData.slice(0, 7).map((day, i) => (
            <div key={i} className="flex flex-col items-center bg-black/30 rounded-xl p-3">
              <span className="text-xs text-white/70 mb-1">{day.name}</span>
              <div className="my-2">
                <WeatherIcon weatherCondition={day.condition} size="medium" />
              </div>
              <div className="text-center">
                <div className="text-amber-400 font-bold">{day.max}°</div>
                <div className="text-blue-300 text-xs">{day.min}°</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGraph;
