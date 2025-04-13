
import { ForecastData } from '@/features/weather/types/weather';
import { getDailyForecasts } from '@/lib/weather-utils';
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

  if (!data || isLoading) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-white/10 rounded-3xl shadow-xl">
        <CardHeader className="pb-2 pt-4">
          <h3 className="text-white/90 font-medium">Weekly Forecast</h3>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-40 flex items-center justify-center">
            <p className="text-white/70">Loading weather data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get daily forecast data
  const dailyForecasts = getDailyForecasts(data);
  
  if (!dailyForecasts || dailyForecasts.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-white/10 rounded-3xl shadow-xl">
        <CardHeader className="pb-2 pt-4">
          <h3 className="text-white/90 font-medium">Weekly Forecast</h3>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-40 flex items-center justify-center">
            <p className="text-white/70">No forecast data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart with temperature conversion
  const chartData = dailyForecasts.map(day => ({
    name: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    temp: Math.round(convertTemperature(day.temp_max)),
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
        <div className="h-44 w-full mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent rounded-xl"></div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 15, left: 15, bottom: 5 }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#fff', opacity: 0.7, fontSize: 12 }}
                axisLine={{ stroke: '#ffffff30' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#fff', opacity: 0.7, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#FFD700" 
                strokeWidth={3}
                dot={{ stroke: '#FFD700', strokeWidth: 2, r: 4, fill: '#FFD700' }}
                activeDot={{ stroke: '#FFD700', strokeWidth: 2, r: 6, fill: '#FFD700' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {chartData.slice(0, 7).map((day, i) => (
            <div key={i} className="flex flex-col items-center bg-black/40 rounded-xl p-3">
              <span className="text-xs text-white/70">{day.name}</span>
              <div className="my-2">
                <WeatherIcon weatherCondition={day.condition} size="medium" />
              </div>
              <div className="text-center">
                <div className="text-amber-400 font-bold">{day.temp}°</div>
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
