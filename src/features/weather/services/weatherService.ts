import { WeatherData, ForecastData, HourlyForecast, DailyForecast } from '../types/weather';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const getUserCoordinates = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000 }
    );
  });
};

export const fetchCurrentWeather = async (city: string, coords?: Coordinates): Promise<WeatherData> => {
  try {
    let url = '';
    
    if (coords) {
      url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&format=json`;
    } else if (city) {
      // Geocoding would go here in a real application
      // For now, default to Berlin if no city is found
      const fallbackCoords = { latitude: 52.52, longitude: 13.41 }; // Berlin
      url = `https://api.open-meteo.com/v1/forecast?latitude=${fallbackCoords.latitude}&longitude=${fallbackCoords.longitude}&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&format=json`;
    } else {
      throw new Error('Either city name or coordinates are required');
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather data fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform Open-Meteo response to match our WeatherData interface
    return {
      coord: {
        lon: coords?.longitude || 13.41,
        lat: coords?.latitude || 52.52,
      },
      weather: [
        {
          id: data.current_weather.weathercode,
          main: mapWeatherCodeToCondition(data.current_weather.weathercode),
          description: mapWeatherCodeToDescription(data.current_weather.weathercode),
          icon: mapWeatherCodeToIcon(data.current_weather.weathercode),
        }
      ],
      base: "stations",
      main: {
        temp: data.current_weather.temperature,
        feels_like: data.current_weather.temperature,
        temp_min: data.daily.temperature_2m_min[0],
        temp_max: data.daily.temperature_2m_max[0],
        pressure: 1015,  // Default values as Open-Meteo doesn't provide these
        humidity: 70,    // Default values as Open-Meteo doesn't provide these
      },
      visibility: 10000,
      wind: {
        speed: data.current_weather.windspeed,
        deg: data.current_weather.winddirection,
      },
      clouds: {
        all: 0,  // Default value
      },
      dt: data.current_weather.time,
      sys: {
        type: 1,
        id: 1,
        country: city ? 'DE' : 'Unknown', // Default to Germany for demo
        sunrise: Math.floor(Date.now() / 1000) - 3600,  // Approximate values
        sunset: Math.floor(Date.now() / 1000) + 3600,   // Approximate values
      },
      timezone: 7200,
      id: 1,
      name: city || "Current Location",
      cod: 200,
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const fetchForecast = async (city: string, coords?: Coordinates): Promise<ForecastData> => {
  try {
    let url = '';
    
    if (coords) {
      url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&hourly=temperature_2m,weathercode,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
    } else if (city) {
      // Geocoding would go here in a real application
      // For now, default to Berlin if no city is found
      const fallbackCoords = { latitude: 52.52, longitude: 13.41 }; // Berlin
      url = `https://api.open-meteo.com/v1/forecast?latitude=${fallbackCoords.latitude}&longitude=${fallbackCoords.longitude}&hourly=temperature_2m,weathercode,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
    } else {
      throw new Error('Either city name or coordinates are required');
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Forecast data fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match our ForecastData interface
    const hourly: HourlyForecast[] = data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
      dt: new Date(time).getTime(),
      temp: data.hourly.temperature_2m[index],
      weather: [
        {
          main: mapWeatherCodeToCondition(data.hourly.weathercode[index]),
          description: mapWeatherCodeToDescription(data.hourly.weathercode[index]),
          icon: mapWeatherCodeToIcon(data.hourly.weathercode[index]),
        }
      ],
      pop: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[index] / 100 : 0,
    }));

    const daily: DailyForecast[] = data.daily.time.map((time: string, index: number) => ({
      dt: new Date(time).getTime(),
      temp: {
        day: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
        min: data.daily.temperature_2m_min[index],
        max: data.daily.temperature_2m_max[index],
      },
      weather: [
        {
          main: mapWeatherCodeToCondition(data.daily.weathercode[index]),
          description: mapWeatherCodeToDescription(data.daily.weathercode[index]),
          icon: mapWeatherCodeToIcon(data.daily.weathercode[index]),
        }
      ],
      pop: 0, // Open-Meteo doesn't provide precipitation probability for daily forecasts in the free tier
    }));

    return {
      hourly,
      daily,
      timezone_offset: data.timezone_offset || 0,
      current: data.current || undefined,
      current_units: data.current_units || undefined,
    };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const getLastCity = (): string => {
  return localStorage.getItem('lastCity') || 'Berlin';
};

export const saveLastCity = (city: string): void => {
  localStorage.setItem('lastCity', city);
};

export const getWeatherBackground = (condition: string): string => {
  switch (condition) {
    case 'Clear':
      return 'from-blue-400 to-blue-600';
    case 'Clouds':
      return 'from-gray-400 to-slate-600';
    case 'Rain':
    case 'Drizzle':
      return 'from-gray-600 to-gray-800';
    case 'Thunderstorm':
      return 'from-gray-800 to-gray-950';
    case 'Snow':
      return 'from-slate-200 to-slate-400';
    case 'Mist':
    case 'Fog':
    case 'Haze':
      return 'from-gray-400 to-gray-600';
    default:
      return 'from-gray-950 to-gray-900';
  }
};

// Helper functions for mapping weather codes to conditions
function mapWeatherCodeToCondition(code: number): string {
  if (code === 0) return 'Clear';
  if (code >= 1 && code <= 3) return 'Clouds';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 66 && code <= 67) return 'Drizzle';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain';
  if (code >= 85 && code <= 86) return 'Snow';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Clouds'; // Default
}

function mapWeatherCodeToDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45) return 'Fog';
  if (code === 48) return 'Depositing rime fog';
  if (code === 51) return 'Light drizzle';
  if (code === 53) return 'Moderate drizzle';
  if (code === 55) return 'Dense drizzle';
  if (code === 56) return 'Light freezing drizzle';
  if (code === 57) return 'Dense freezing drizzle';
  if (code === 61) return 'Slight rain';
  if (code === 63) return 'Moderate rain';
  if (code === 65) return 'Heavy rain';
  if (code === 66) return 'Light freezing rain';
  if (code === 67) return 'Heavy freezing rain';
  if (code === 71) return 'Slight snow fall';
  if (code === 73) return 'Moderate snow fall';
  if (code === 75) return 'Heavy snow fall';
  if (code === 77) return 'Snow grains';
  if (code === 80) return 'Slight rain showers';
  if (code === 81) return 'Moderate rain showers';
  if (code === 82) return 'Violent rain showers';
  if (code === 85) return 'Slight snow showers';
  if (code === 86) return 'Heavy snow showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96) return 'Thunderstorm with slight hail';
  if (code === 99) return 'Thunderstorm with heavy hail';
  return 'Unknown';
}

function mapWeatherCodeToIcon(code: number): string {
  if (code === 0) return '01d';  // Clear sky
  if (code === 1) return '02d';  // Mainly clear
  if (code === 2) return '03d';  // Partly cloudy
  if (code === 3) return '04d';  // Overcast
  if (code >= 45 && code <= 48) return '50d';  // Fog
  if (code >= 51 && code <= 55) return '09d';  // Drizzle
  if (code >= 56 && code <= 57) return '09d';  // Freezing drizzle
  if (code >= 61 && code <= 65) return '10d';  // Rain
  if (code >= 66 && code <= 67) return '13d';  // Freezing rain
  if (code >= 71 && code <= 77) return '13d';  // Snow
  if (code >= 80 && code <= 82) return '09d';  // Rain showers
  if (code >= 85 && code <= 86) return '13d';  // Snow showers
  if (code >= 95 && code <= 99) return '11d';  // Thunderstorm
  return '03d';  // Default
}
