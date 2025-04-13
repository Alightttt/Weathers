
import React from 'react';
import { Twitter, MailIcon, MessageCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import WeatherLayout from '@/components/layout/WeatherLayout';

const HelpPage: React.FC = () => {
  return (
    <WeatherLayout>
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Help & Support</h1>
        
        <div className="space-y-6">
          <div className="bg-white/50 rounded-lg p-4 text-black">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  How accurate is the weather data?
                </AccordionTrigger>
                <AccordionContent>
                  Our weather data comes from trusted meteorological sources. The accuracy depends on your location, but we strive to provide the most reliable forecasts available.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  Why does the app need my location?
                </AccordionTrigger>
                <AccordionContent>
                  We use your location to provide you with the most accurate and relevant weather information for your area. You can always search for other locations manually.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  How do I change temperature units?
                </AccordionTrigger>
                <AccordionContent>
                  Go to Settings and select your preferred temperature unit (Celsius or Fahrenheit).
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  How often is the weather data updated?
                </AccordionTrigger>
                <AccordionContent>
                  Current conditions are updated frequently throughout the day. Forecasts are typically updated every few hours.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="bg-white/50 rounded-lg p-4 text-black">
            <h2 className="text-xl font-semibold mb-3">Contact Support</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5 text-gray-600" />
                <span>support@weatherapp.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <span>Live chat available 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <Twitter className="h-5 w-5 text-blue-400" />
                <a 
                  href="https://twitter.com/weatherapp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  @weatherapp
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-white/50 rounded-lg p-4 text-black">
            <h2 className="text-xl font-semibold mb-3">Tutorials</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  How to read weather forecasts
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Understanding weather symbols
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Setting up weather alerts
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </WeatherLayout>
  );
};

export default HelpPage;
