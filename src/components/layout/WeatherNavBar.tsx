
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Home, HelpCircle, Twitter, Github } from 'lucide-react';
import { Button } from '../ui/button';

const WeatherNavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { 
      path: '/', 
      icon: <Home className="w-5 h-5" />, 
      label: 'Home', 
      isActive: isActive('/') 
    },
    { 
      path: '/settings', 
      icon: <Settings className="w-5 h-5" />, 
      label: 'Settings', 
      isActive: isActive('/settings') 
    },
    { 
      path: '/about', 
      icon: <Github className="w-5 h-5" />, 
      label: 'About', 
      isActive: isActive('/about'),
      href: 'https://github.com/Alightttt'
    },
    { 
      path: '/help', 
      icon: <Twitter className="w-5 h-5" />, 
      label: 'Help',
      isActive: isActive('/help')
    }
  ];
  
  return (
    <div className="bg-white/80 backdrop-blur-md py-4 px-6 border-t border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <React.Fragment key={item.path}>
              {item.href ? (
                <a 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-sm font-medium text-gray-500 hover:text-black"
                >
                  {React.cloneElement(item.icon, { 
                    className: `w-5 h-5 ${item.isActive ? 'text-blue-500' : 'text-gray-500'}`
                  })}
                  <span className="mt-1 text-xs">{item.label}</span>
                </a>
              ) : (
                <Link 
                  to={item.path} 
                  className="flex flex-col items-center text-sm font-medium text-gray-500 hover:text-black"
                >
                  {React.cloneElement(item.icon, { 
                    className: `w-5 h-5 ${item.isActive ? 'text-blue-500' : 'text-gray-500'}`
                  })}
                  <span className="mt-1 text-xs">{item.label}</span>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherNavBar;
