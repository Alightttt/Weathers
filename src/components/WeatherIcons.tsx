
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
    large: 'w-40 h-40'
  };

  // Sunny weather - bright sun with dots animation
  if (condition.includes('sun') || condition.includes('clear')) {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full bg-amber-300 animate-pulse flex items-center justify-center">
            <div className="w-5/6 h-5/6 rounded-full bg-[#FFDE5F] grid grid-cols-6 gap-1">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="bg-amber-500 rounded-full w-1 h-1"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-50 animate-spin-slow">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-8 bg-amber-400" 
              style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: 'bottom center', left: 'calc(50% - 2px)' }} 
            />
          ))}
        </div>
      </div>
    );
  }
  
  // Cloudy weather
  if (condition.includes('cloud')) {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-200 w-16 h-16 rounded-full animate-clouds"></div>
          <div className="bg-gray-300 w-20 h-20 rounded-full -ml-8 -mt-6 animate-clouds" style={{animationDelay: '0.3s'}}></div>
          <div className="bg-gray-100 w-14 h-14 rounded-full -ml-12 mt-4 animate-clouds" style={{animationDelay: '0.6s'}}></div>
        </div>
        <div className="absolute top-4 left-4 w-full h-full flex items-center justify-center">
          <div className="w-3/4 h-1/2 rounded-xl grid grid-cols-8 gap-1">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="bg-gray-400 rounded-full w-1 h-1"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Rainy weather
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-300 w-20 h-12 rounded-t-full rounded-b-lg -mt-6"></div>
        </div>
        <div className="absolute top-12 left-0 right-0 flex justify-center space-x-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="w-1 h-5 bg-blue-400 rounded-full animate-rain" 
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
        <div className="absolute top-4 left-4 w-full h-full flex items-center justify-center">
          <div className="w-3/4 h-1/2 rounded-full grid grid-cols-6 gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-gray-400 rounded-full w-1 h-1"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Snow weather
  if (condition.includes('snow')) {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-300 w-20 h-12 rounded-t-full rounded-b-lg -mt-6"></div>
        </div>
        <div className="absolute top-12 left-0 right-0 flex justify-center space-x-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-3 bg-blue-100 rounded-full animate-bounce" 
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
        <div className="absolute top-4 left-4 w-full h-full flex items-center justify-center">
          <div className="w-3/4 h-1/2 rounded-full grid grid-cols-6 gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-gray-400 rounded-full w-1 h-1"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Thunder weather
  if (condition.includes('thunder') || condition.includes('lightning')) {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-700 w-20 h-12 rounded-t-full rounded-b-lg -mt-4"></div>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-lightning">
          <div className="w-2 h-8 bg-yellow-300 clip-lightning"></div>
        </div>
        <div className="absolute top-4 left-4 w-full h-full flex items-center justify-center">
          <div className="w-3/4 h-1/2 rounded-full grid grid-cols-6 gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-gray-500 rounded-full w-1 h-1"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fog weather
  if (condition.includes('fog') || condition.includes('mist')) {
    return (
      <div className={`relative ${sizeClass[size]}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-gray-300 h-2 rounded-full animate-clouds" 
            style={{ 
              width: `${20 + i * 5}px`,
              top: `${8 + i * 8}px`, 
              left: `${i * 4}px`, 
              animationDelay: `${i * 0.2}s`
            }}
          ></div>
        ))}
        <div className="absolute top-4 left-4 w-full h-full flex items-center justify-center">
          <div className="w-3/4 h-1/2 rounded-full grid grid-cols-6 gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-gray-400 rounded-full w-1 h-1"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default to sun dots
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
