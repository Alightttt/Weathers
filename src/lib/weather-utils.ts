
// Weather API utilities

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
  dt: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}

// Get API key from env or local storage
const getApiKey = () => {
  return localStorage.getItem("openWeatherApiKey") || "";
};

// Convert from Kelvin to Celsius
export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

// Convert from Kelvin to Fahrenheit
export const kelvinToFahrenheit = (kelvin: number): number => {
  return Math.round((kelvin - 273.15) * 9/5 + 32);
};

// Format date
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long',
    month: 'short', 
    day: 'numeric'
  }).format(date);
};

// Get day of week
export const getDayOfWeek = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

// Get hour from timestamp
export const getHour = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric' }).format(date);
};

// Fetch current weather data
export const fetchCurrentWeather = async (city: string): Promise<WeatherData> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return await response.json();
};

// Fetch forecast data
export const fetchForecast = async (city: string): Promise<ForecastData> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch forecast data");
  }

  return await response.json();
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Process forecast data to get daily forecasts
export const getDailyForecasts = (forecastData: ForecastData): any[] => {
  const dailyData: Record<string, any> = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    
    if (!dailyData[date]) {
      dailyData[date] = {
        dt: item.dt,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: item.weather[0],
        date
      };
    } else {
      if (item.main.temp_max > dailyData[date].temp_max) {
        dailyData[date].temp_max = item.main.temp_max;
      }
      if (item.main.temp_min < dailyData[date].temp_min) {
        dailyData[date].temp_min = item.main.temp_min;
      }
    }
  });

  return Object.values(dailyData).slice(0, 5);
};

// Get hourly forecast for today
export const getHourlyForecast = (forecastData: ForecastData): any[] => {
  const today = new Date().toLocaleDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString();

  return forecastData.list
    .filter(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      return date === today || date === tomorrowStr;
    })
    .slice(0, 8);
};

// Save last city to local storage
export const saveLastCity = (city: string): void => {
  localStorage.setItem("lastCity", city);
};

// Get last city from local storage
export const getLastCity = (): string => {
  return localStorage.getItem("lastCity") || "New York";
};

// Save API key to local storage
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem("openWeatherApiKey", apiKey);
};

// Get weather background based on weather condition
export const getWeatherBackground = (weatherCondition: string): string => {
  const condition = weatherCondition.toLowerCase();
  
  if (condition.includes("clear")) return "from-blue-500 to-amber-300";
  if (condition.includes("cloud")) return "from-gray-500 to-gray-700";
  if (condition.includes("rain") || condition.includes("drizzle")) return "from-blue-800 to-gray-700";
  if (condition.includes("snow")) return "from-blue-100 to-gray-200";
  if (condition.includes("storm") || condition.includes("thunder")) return "from-gray-900 to-yellow-700";
  
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
