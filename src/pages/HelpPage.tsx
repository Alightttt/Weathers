
import React from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Twitter, 
  HelpCircle, 
  Search, 
  MapPin, 
  Settings 
} from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <WeatherLayout bgGradient="bg-[#FFDE5F]">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-6 text-black">Help</h1>
        
        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-black" />
                <h2 className="text-lg font-semibold text-black">Location Access</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-black/80">
                Our app works best when you allow location access. This ensures you get weather data for your precise location. You can change this setting in your device settings at any time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-black" />
                <h2 className="text-lg font-semibold text-black">Searching Locations</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-black/80">
                Use the search feature to find weather data for any city around the world. Simply type the city name and select from the results.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-black" />
                <h2 className="text-lg font-semibold text-black">App Settings</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-black/80">
                You can customize the app by changing temperature units (°C or °F), updating display preferences, or clearing saved locations in the Settings page.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-black" />
                <h2 className="text-lg font-semibold text-black">Contact Support</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-black/80 mb-4">
                Having trouble with the app? Feel free to reach out to us on Twitter for quick assistance.
              </p>
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
                onClick={() => window.open('https://twitter.com/lovableio', '_blank')}
              >
                <Twitter className="h-5 w-5" />
                Contact on Twitter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </WeatherLayout>
  );
};

export default HelpPage;
