
import { ForecastData } from '@/features/weather/types/weather';
import { getDailyForecasts } from '@/lib/weather-utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceDot } from 'recharts';
import { useState, useEffect } from 'react';
import { WeatherIcon } from './WeatherIcons';
import { Droplets, Wind, Thermometer } from 'lucide-react';

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
      <Card className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-4 my-6 border border-white/10">
        <CardHeader className="pb-2 pt-4">
          <h3 className="text-black font-medium">Daily Forecast</h3>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-40 flex items-center justify-center">
            <p className="text-black/70">Loading weather data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get daily forecast data
  const dailyForecasts = getDailyForecasts(data);
  
  if (!dailyForecasts || dailyForecasts.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-4 my-6 border border-white/10">
        <CardHeader className="pb-2 pt-4">
          <h3 className="text-black font-medium">Daily Forecast</h3>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-40 flex items-center justify-center">
            <p className="text-black/70">No forecast data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart with temperature conversion
  const chartData = dailyForecasts.map((day, index) => {
    const dayOfWeek = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: index === 0 ? "NOW" : dayOfWeek,
      temp: Math.round(convertTemperature(day.temp_max)),
      min: Math.round(convertTemperature(day.temp_min)),
      icon: day.weather.icon,
      condition: day.weather.main,
      isNow: index === 0
    };
  });

  // Calculate averages for display
  const humidity = data.current?.relative_humidity_2m || 
                  (data.main?.humidity !== undefined ? data.main.humidity : 34);
  const windSpeed = data.current?.wind_speed_10m || 
                   (data.wind?.speed !== undefined ? Math.round(data.wind.speed) : 26);
  const precipProb = data.hourly?.precipitation_probability?.[0] || 20;

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/10">
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-16">
            <div className="flex flex-col items-center">
              <Droplets className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-lg font-medium text-black">{humidity}%</span>
              <span className="text-xs text-black/60">Humidity</span>
            </div>
            <div className="flex flex-col items-center">
              <Wind className="h-5 w-5 text-gray-700 mb-1" />
              <span className="text-lg font-medium text-black">{windSpeed}km/h</span>
              <span className="text-xs text-black/60">Wind</span>
            </div>
            <div className="flex flex-col items-center">
              <Thermometer className="h-5 w-5 text-red-500 mb-1" />
              <span className="text-lg font-medium text-black">{precipProb}%</span>
              <span className="text-xs text-black/60">Rain</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.slice(0, 7)}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#000', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#000" 
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1500}
                />
                {chartData[0] && (
                  <ReferenceDot
                    x={chartData[0].name}
                    y={chartData[0].temp}
                    r={5}
                    fill="#000"
                    stroke="none"
                  />
                )}
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 rounded-lg shadow-md text-center">
                          <div className="font-medium">{payload[0].payload.temp}°</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between mt-4">
            {chartData.slice(0, 3).map((item, index) => (
              <div key={index} className="text-center">
                <div className="font-medium text-black">{item.name}</div>
                <div className="text-lg font-bold text-black">{item.temp}°</div>
                <div className="flex justify-center">
                  <WeatherIcon weatherCondition={item.condition} size="small" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WeeklyGraph;
