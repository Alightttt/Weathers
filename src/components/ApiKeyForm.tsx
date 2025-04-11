
import { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";
import { saveApiKey } from '@/lib/weather-utils';
import { toast } from "sonner";

interface ApiKeyFormProps {
  onApiKeySet: () => void;
}

const ApiKeyForm = ({ onApiKeySet }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      toast.success("API key has been saved!");
      onApiKeySet();
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  return (
    <div className="glass-card p-8 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-center">OpenWeatherMap API Key Required</h2>
      <p className="mb-6 text-gray-300 text-center">
        To use this weather app, you need to provide an API key from Open-Meteo.
        <a href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-1">open-meteo.com/docs</a>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter your Open-Meteo API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pl-10 bg-black/20 border-white/10 focus:border-white/20"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save API Key
        </Button>
      </form>
      
      <div className="mt-6 text-xs text-gray-400">
        <p>Your API key will be stored in your browser's local storage.</p>
        <p>It won't be sent anywhere except to the Open-Meteo API.</p>
      </div>
    </div>
  );
};

export default ApiKeyForm;
