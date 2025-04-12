
import React from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { ArrowLeft, ChevronRight, Sun, Moon, Droplets, Wind, Languages, Bell, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const settingsGroups = [
    {
      title: 'Display',
      items: [
        { icon: Sun, label: 'Temperature Unit', value: '°C', hasToggle: false, hasValue: true },
        { icon: Moon, label: 'Dark Mode', value: '', hasToggle: true, toggled: true },
        { icon: Wind, label: 'Wind Speed', value: 'km/h', hasToggle: false, hasValue: true },
      ]
    },
    {
      title: 'Application',
      items: [
        { icon: Languages, label: 'Language', value: 'English', hasToggle: false, hasValue: true },
        { icon: Bell, label: 'Notifications', value: '', hasToggle: true, toggled: false },
        { icon: Droplets, label: 'Precipitation', value: 'mm', hasToggle: false, hasValue: true },
      ]
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'App Version', value: '1.0.0', hasToggle: false, hasValue: true },
      ]
    }
  ];
  
  const handleSettingClick = (setting: any) => {
    // In a real app, this would open a modal or navigate to a detailed settings page
    console.log('Setting clicked:', setting);
  };
  
  return (
    <WeatherLayout bgGradient="from-gray-800 to-gray-900">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-medium text-white">Settings</h1>
          <div className="w-9"></div> {/* Empty div for balanced layout */}
        </div>
        
        <div className="space-y-6">
          {settingsGroups.map((group, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 animate-fade-in">
              <h3 className="text-white/90 font-medium mb-4">{group.title}</h3>
              <div className="space-y-4">
                {group.items.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between"
                    onClick={() => handleSettingClick(item)}
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
                        <Switch checked={item.toggled} />
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
