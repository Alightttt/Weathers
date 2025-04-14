
import React, { useState, useEffect } from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { ArrowLeft, ChevronRight, Sun, Moon, Droplets, Wind, Languages, Bell, Info, Link as LinkIcon, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches || 
    localStorage.getItem('theme') === 'dark'
  );
  const [units, setUnits] = useState({
    temperature: localStorage.getItem('temperatureUnit') || '°C',
    windSpeed: localStorage.getItem('windSpeedUnit') || 'km/h',
    precipitation: localStorage.getItem('precipitationUnit') || 'mm'
  });
  const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'English');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    localStorage.getItem('notifications') === 'true'
  );
  
  useEffect(() => {
    // Apply theme on component mount and when isDarkMode changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(`${newMode ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleUnitChange = (type: string) => {
    let newValue;
    
    if (type === 'temperature') {
      newValue = units.temperature === '°C' ? '°F' : '°C';
      setUnits(prev => ({ ...prev, temperature: newValue }));
      localStorage.setItem('temperatureUnit', newValue);
    } else if (type === 'windSpeed') {
      newValue = units.windSpeed === 'km/h' ? 'mph' : 'km/h';
      setUnits(prev => ({ ...prev, windSpeed: newValue }));
      localStorage.setItem('windSpeedUnit', newValue);
    } else if (type === 'precipitation') {
      newValue = units.precipitation === 'mm' ? 'in' : 'mm';
      setUnits(prev => ({ ...prev, precipitation: newValue }));
      localStorage.setItem('precipitationUnit', newValue);
    }
    
    toast.success(`Unit changed to ${newValue}`);
  };

  const handleLanguageChange = () => {
    const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLanguage = languages[nextIndex];
    
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    toast.success(`Language changed to ${newLanguage}`);
  };

  const handleNotificationToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notifications', String(newValue));
    toast.success(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  const settingsGroups = [
    {
      title: 'Display',
      items: [
        { 
          icon: Sun, 
          label: 'Temperature Unit', 
          value: units.temperature, 
          hasToggle: false, 
          hasValue: true,
          onClick: () => handleUnitChange('temperature')
        },
        { 
          icon: Moon, 
          label: 'Dark Mode', 
          value: '', 
          hasToggle: true, 
          toggled: isDarkMode,
          onToggle: handleDarkModeToggle
        },
        { 
          icon: Wind, 
          label: 'Wind Speed', 
          value: units.windSpeed, 
          hasToggle: false, 
          hasValue: true,
          onClick: () => handleUnitChange('windSpeed')
        },
      ]
    },
    {
      title: 'Application',
      items: [
        { 
          icon: Languages, 
          label: 'Language', 
          value: language, 
          hasToggle: false, 
          hasValue: true,
          onClick: handleLanguageChange
        },
        { 
          icon: Bell, 
          label: 'Notifications', 
          value: '', 
          hasToggle: true, 
          toggled: notificationsEnabled,
          onToggle: handleNotificationToggle
        },
        { 
          icon: Droplets, 
          label: 'Precipitation', 
          value: units.precipitation, 
          hasToggle: false, 
          hasValue: true,
          onClick: () => handleUnitChange('precipitation')
        },
      ]
    },
    {
      title: 'Connect',
      items: [
        { 
          icon: Twitter, 
          label: 'Twitter (X)', 
          value: '@alightcodess', 
          hasToggle: false, 
          hasValue: true,
          isLink: true,
          linkUrl: 'https://x.com/alightcodess'
        },
      ]
    },
    {
      title: 'About',
      items: [
        { 
          icon: Info, 
          label: 'About Weather App', 
          value: '', 
          hasToggle: false, 
          hasValue: false,
          onClick: () => navigate('/about')
        },
        { 
          icon: LinkIcon, 
          label: 'GitHub', 
          value: 'alightcodes', 
          hasToggle: false, 
          hasValue: true,
          isLink: true,
          linkUrl: 'https://github.com/alightcodes/weather-app'
        },
        { 
          icon: Info, 
          label: 'App Version', 
          value: '2.0.0', 
          hasToggle: false, 
          hasValue: true,
        },
      ]
    }
  ];
  
  return (
    <WeatherLayout bgGradient="from-gray-800 to-gray-900">
      <div className="relative z-10 pb-20">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-medium text-white">Settings</h1>
          <div className="w-9"></div>
        </div>
        
        <div className="space-y-6">
          {settingsGroups.map((group, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 animate-fade-in">
              <h3 className="text-white/90 font-medium mb-4">{group.title}</h3>
              <div className="space-y-4">
                {group.items.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between ${item.onClick || item.isLink ? 'cursor-pointer active:opacity-70' : ''}`}
                    onClick={item.onClick}
                  >
                    <div className="flex items-center">
                      <div className="bg-white/10 rounded-full p-2 mr-3">
                        <item.icon className="h-4 w-4 text-white/70" />
                      </div>
                      <span className="text-white">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {item.hasValue && <span className="text-white/70 mr-2">{item.value}</span>}
                      
                      {item.hasToggle ? (
                        <Switch 
                          checked={item.toggled} 
                          onCheckedChange={item.onToggle} 
                          className="data-[state=checked]:bg-blue-500"
                        />
                      ) : item.isLink ? (
                        <a 
                          href={item.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-500/80 text-white p-1.5 rounded-lg flex items-center justify-center"
                        >
                          <LinkIcon className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <ChevronRight className="h-5 w-5 text-white/50" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WeatherLayout>
  );
};

export default SettingsPage;
