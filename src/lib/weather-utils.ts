// Weather API utilities

// New interfaces for Open-Meteo API
export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    rain: number[];
    showers: number[];
    snowfall: number[];
    relative_humidity_2m: number[];
  };
  name?: string; // We'll add this manually
  sys?: {
    country: string;
  };
  weather?: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

// ForecastData is now the same as WeatherData since Open-Meteo returns everything in one call
export type ForecastData = WeatherData;

// Open-Meteo API URL
const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=52.520001,NaN&longitude=13.410001,NaN&daily=sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration,apparent_temperature_min,apparent_temperature_max,temperature_2m_min,temperature_2m_max,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,apparent_temperature,rain,showers,snowfall,snow_depth&current=temperature_2m,relative_humidity_2m,is_day,apparent_temperature,snowfall,showers,rain,precipitation&timezone=Europe%2FLondon&past_days=7&forecast_days=14";

// Convert from Kelvin to Celsius
export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

// Convert from Kelvin to Fahrenheit
export const kelvinToFahrenheit = (kelvin: number): number => {
  return Math.round((kelvin - 273.15) * 9/5 + 32);
};

// Format date
export const formatDate = (timestamp: string | number): string => {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long',
    month: 'short', 
    day: 'numeric'
  }).format(date);
};

// Get day of week
export const getDayOfWeek = (timestamp: string | number): string => {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

// Get hour from timestamp
export const getHour = (timestamp: string | number): string => {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric' }).format(date);
};

// Map weather code to weather condition
export const getWeatherCondition = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  if (code === 0) return "Clear";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([56, 57].includes(code)) return "Freezing Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if (code === 77) return "Snow Grains";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([85, 86].includes(code)) return "Snow Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
};

// Map weather code to icon
export const getWeatherIcon = (code: number, isDay: boolean = true): string => {
  // Map WMO codes to OpenWeatherMap-like icons for compatibility with existing components
  if (code === 0) return isDay ? "01d" : "01n"; // Clear
  if ([1, 2].includes(code)) return isDay ? "02d" : "02n"; // Partly cloudy
  if (code === 3) return isDay ? "03d" : "03n"; // Cloudy
  if ([45, 48].includes(code)) return isDay ? "50d" : "50n"; // Fog
  if ([51, 53, 55, 56, 57].includes(code)) return isDay ? "09d" : "09n"; // Drizzle
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return isDay ? "10d" : "10n"; // Rain
  if ([71, 73, 75, 77, 85, 86].includes(code)) return isDay ? "13d" : "13n"; // Snow
  if ([95, 96, 99].includes(code)) return isDay ? "11d" : "11n"; // Thunderstorm
  return isDay ? "50d" : "50n"; // Default
};

// Function to save the API key to local storage
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem('weatherApiKey', apiKey);
};

// Function to get the saved API key from local storage
export const getApiKey = (): string | null => {
  return localStorage.getItem('weatherApiKey');
};

// Fetch weather data using Open-Meteo API
export const fetchCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('No API key found');
    }

    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    
    const data = await response.json();
    
    // Add city name manually since Open-Meteo doesn't provide it
    data.name = city;
    
    // Add weather information in a format compatible with existing components
    const todayIndex = 7; // Today's index (since past_days=7)
    const weatherCode = data.daily.weather_code[todayIndex];
    data.weather = [{
      main: getWeatherCondition(weatherCode),
      description: getWeatherCondition(weatherCode).toLowerCase(),
      icon: getWeatherIcon(weatherCode, data.current.is_day === 1)
    }];
    
    data.sys = {
      country: "Earth" // Open-Meteo doesn't provide country info
    };
    
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Since Open-Meteo returns both current and forecast data in one call,
// we can reuse the same data
export const fetchForecast = async (city: string): Promise<ForecastData> => {
  return await fetchCurrentWeather(city);
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Process forecast data to get daily forecasts
export const getDailyForecasts = (forecastData: ForecastData): any[] => {
  const dailyData = [];
  const todayIndex = 7; // Today's index (since past_days=7)
  
  // Process next 5 days (including today)
  for (let i = 0; i < 5; i++) {
    const index = todayIndex + i;
    if (index < forecastData.daily.time.length) {
      dailyData.push({
        dt: new Date(forecastData.daily.time[index]).getTime() / 1000,
        temp_min: forecastData.daily.temperature_2m_min[index],
        temp_max: forecastData.daily.temperature_2m_max[index],
        weather: {
          main: getWeatherCondition(forecastData.daily.weather_code[index]),
          description: getWeatherCondition(forecastData.daily.weather_code[index]).toLowerCase(),
          icon: getWeatherIcon(forecastData.daily.weather_code[index], true)
        },
        date: forecastData.daily.time[index]
      });
    }
  }
  
  return dailyData;
};

// Get hourly forecast for today
export const getHourlyForecast = (forecastData: ForecastData): any[] => {
  const hourlyData = [];
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Find the starting index for current hour
  const currentHourIndex = forecastData.hourly.time.findIndex(time => 
    new Date(time).getTime() >= now.getTime()
  );
  
  // Get next 8 hours
  for (let i = currentHourIndex; i < currentHourIndex + 8 && i < forecastData.hourly.time.length; i++) {
    const time = forecastData.hourly.time[i];
    const hour = forecastData.hourly;
    
    hourlyData.push({
      dt: new Date(time).getTime() / 1000,
      dt_txt: time,
      main: {
        temp: hour.temperature_2m[i],
        temp_min: hour.temperature_2m[i] - 1, // Approximation
        temp_max: hour.temperature_2m[i] + 1, // Approximation
        humidity: hour.relative_humidity_2m[i]
      },
      weather: [{
        main: "Weather", // We don't have hourly weather codes
        description: "weather",
        icon: hour.precipitation_probability[i] > 30 ? "10d" : "01d" // Simple logic for icon
      }],
      wind: {
        speed: 0 // Not available in hourly data
      }
    });
  }
  
  return hourlyData;
};

// Save last city to local storage
export const saveLastCity = (city: string): void => {
  localStorage.setItem("lastCity", city);
};

// Get last city from local storage
export const getLastCity = (): string => {
  return localStorage.getItem("lastCity") || "Berlin";
};

// Get weather background based on weather condition
export const getWeatherBackground = (weatherCondition: string): string => {
  const condition = weatherCondition.toLowerCase();
  
  if (condition.includes("clear")) return "from-blue-500 to-amber-300";
  if (condition.includes("cloud")) return "from-gray-500 to-gray-700";
  if (condition.includes("rain") || condition.includes("drizzle")) return "from-blue-800 to-gray-700";
  if (condition.includes("snow")) return "from-blue-100 to-gray-200";
  if (condition.includes("storm") || condition.includes("thunder")) return "from-gray-900 to-yellow-700";
  if (condition.includes("fog")) return "from-gray-400 to-gray-600";
  
  // Default
  return "from-gray-900 to-gray-800";
};

// Get weather text color based on weather condition
export const getWeatherTextColor = (weatherCondition: string): string => {
  const condition = weatherCondition.toLowerCase();
  
  if (condition.includes("clear")) return "text-amber-300";
  if (condition.includes("cloud")) return "text-gray-300";
  if (condition.includes("rain") || condition.includes("drizzle")) return "text-blue-300";
  if (condition.includes("snow")) return "text-blue-100";
  if (condition.includes("storm") || condition.includes("thunder")) return "text-yellow-300";
  
  // Default
  return "text-white";
};
