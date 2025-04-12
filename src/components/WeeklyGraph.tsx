
import { ForecastData } from '@/features/weather/types/weather';
import { getDailyForecasts } from '@/lib/weather-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { WeatherIcon } from './WeatherIcons';

interface WeeklyGraphProps {
  data: ForecastData | null;
  isLoading: boolean;
}

const WeeklyGraph = ({ data, isLoading }: WeeklyGraphProps) => {
  const [temperatureUnit, setTemperatureUnit] = useState<string>(localStorage.getItem('temperatureUnit') || '°C');

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
          <Skeleton className="h-40 w-full bg-white/10" />
        </CardContent>
      </Card>
    );
  }

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
        <h3 className="text-white/90 font-medium">Next 30 Days</h3>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF8C00" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1E90FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#fff', fontSize: 12 }} 
                axisLine={{ stroke: '#ffffff30' }}
                tickLine={{ stroke: '#ffffff30' }}
              />
              <YAxis 
                tick={{ fill: '#fff', fontSize: 12 }} 
                axisLine={{ stroke: '#ffffff30' }}
                tickLine={{ stroke: '#ffffff30' }}
                width={30}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                formatter={(value: number) => [`${value}${temperatureUnit}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey="max" 
                stroke="#FF8C00" 
                strokeWidth={2}
                dot={{ stroke: '#FF8C00', strokeWidth: 2, fill: '#FFF', r: 4 }}
                activeDot={{ r: 6, stroke: '#FF8C00', strokeWidth: 2, fill: '#FFF' }}
              />
              <Line 
                type="monotone" 
                dataKey="min" 
                stroke="#1E90FF" 
                strokeWidth={2} 
                dot={{ stroke: '#1E90FF', strokeWidth: 2, fill: '#FFF', r: 4 }}
                activeDot={{ r: 6, stroke: '#1E90FF', strokeWidth: 2, fill: '#FFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between pt-2 mt-2 border-t border-white/10">
          {chartData.slice(0, 5).map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xs text-white/70">{day.name}</span>
              <div className="my-1">
                <WeatherIcon weatherCondition={day.condition} size="small" />
              </div>
              <div className="flex text-xs space-x-1">
                <span className="text-amber-400">{day.max}°</span>
                <span className="text-blue-400">{day.min}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGraph;
