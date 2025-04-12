
import React from 'react';
import { Home, Search, Map, Settings, RefreshCw } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useWeather } from '@/features/weather/hooks/useWeather';
import { cn } from '@/lib/utils';

const WeatherNavBar: React.FC = () => {
  const location = useLocation();
  const { handleLocationAccess } = useWeather();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: RefreshCw, label: 'Refresh', path: '#', action: handleLocationAccess },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white/15 backdrop-blur-xl rounded-t-3xl p-2 flex justify-around items-center">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavButton
                key={index}
                Icon={item.icon}
                label={item.label}
                isActive={isActive}
                onClick={item.action}
                to={item.path}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface NavButtonProps {
  Icon: React.FC<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  to: string;
}

const NavButton: React.FC<NavButtonProps> = ({ Icon, label, isActive, onClick, to }) => {
  const className = cn(
    "flex flex-col items-center justify-center py-2 px-3 rounded-full transition-colors",
    isActive ? "text-white" : "text-white/60 hover:text-white"
  );
  
  if (onClick) {
    return (
      <button className={className} onClick={onClick}>
        <Icon className={cn("h-5 w-5 mb-1", isActive && "text-blue-200")} />
        <span className="text-xs">{label}</span>
      </button>
    );
  }
  
  return (
    <Link to={to} className={className}>
      <Icon className={cn("h-5 w-5 mb-1", isActive && "text-blue-200")} />
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export default WeatherNavBar;
