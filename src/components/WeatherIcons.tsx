
import { CloudRain, Cloud, Sun, CloudLightning, CloudSnow, CloudSun, CloudFog, Snowflake } from 'lucide-react';

interface WeatherIconProps {
  weatherCondition: string;
  size?: 'small' | 'medium' | 'large';
}

export const WeatherIcon = ({ weatherCondition, size = 'medium' }: WeatherIconProps) => {
  const condition = weatherCondition.toLowerCase();
  const sizeClass = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  if (condition.includes('rain') || condition.includes('drizzle')) {
    return <CloudRain className={`${sizeClass[size]} text-blue-400`} />;
  }

  if (condition.includes('cloud')) {
    return <Cloud className={`${sizeClass[size]} text-gray-300`} />;
  }

  if (condition.includes('sun') || condition.includes('clear')) {
    return <Sun className={`${sizeClass[size]} text-amber-300`} />;
  }

  if (condition.includes('lightning') || condition.includes('thunder')) {
    return <CloudLightning className={`${sizeClass[size]} text-yellow-300`} />;
  }

  if (condition.includes('snow')) {
    return <Snowflake className={`${sizeClass[size]} text-blue-100`} />;
  }
  
  if (condition.includes('fog') || condition.includes('mist')) {
    return <CloudFog className={`${sizeClass[size]} text-gray-400`} />;
  }

  return <CloudSun className={`${sizeClass[size]} text-gray-300`} />;
};

export const AnimatedWeatherIcon = ({ weatherCondition, size = 'medium' }: WeatherIconProps) => {
  const condition = weatherCondition.toLowerCase();
  
  // Size classes with extra styling
  const sizeClass = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-40 h-40' // Made the large size bigger
  };

  // Create dot pattern for sun
  const renderSunDots = () => {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full bg-[#FFDE5F] grid grid-cols-6 gap-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="bg-black rounded-full w-1 h-1"></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Create dot pattern for clouds
  const renderCloudDots = () => {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-1/2 bg-transparent grid grid-cols-8 gap-1">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="bg-black rounded-full w-1 h-1"></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Sunny weather
  if (condition.includes('sun') || condition.includes('clear')) {
    return renderSunDots();
  }
  
  // Cloudy weather
  if (condition.includes('cloud')) {
    return renderCloudDots();
  }

  // Rainy weather
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return (
      <div className={`weather-icon ${sizeClass[size]} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-1/2 rounded-full grid grid-cols-6 gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-black rounded-full w-1 h-1"></div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-1 h-4 bg-blue-400 rounded-full animate-bounce"></div>
          ))}
        </div>
      </div>
    );
  }

  // Default to sun dots (like in the image)
  return renderSunDots();
};
