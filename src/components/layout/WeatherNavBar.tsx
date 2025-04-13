
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Map,
  Settings,
  HelpCircle,
  Info
} from 'lucide-react';

const WeatherNavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
    { path: '/about', icon: Info, label: 'About' }
  ];
  
  return (
    <nav className="bg-[#FFDE5F] py-3 px-4 rounded-t-3xl border-t border-black/10 shadow-lg">
      <div className="max-w-md mx-auto">
        <ul className="flex justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex flex-col items-center p-2 rounded-xl ${
                    active ? 'bg-black/10' : 'hover:bg-black/5'
                  }`}
                >
                  <Icon
                    size={20}
                    className={active ? 'text-black' : 'text-black/60'}
                  />
                  <span className={`text-xs mt-1 ${active ? 'text-black' : 'text-black/60'}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default WeatherNavBar;
