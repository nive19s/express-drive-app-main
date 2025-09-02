import React from 'react';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  address: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ address }) => {
  // This is a placeholder map component
  // In a real app, you would integrate with Google Maps, Apple Maps, or another mapping service
  
  return (
    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden">
      {/* Placeholder map background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        {/* Mock street lines */}
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-primary/30 rotate-12" />
        <div className="absolute top-2/4 left-0 w-full h-0.5 bg-primary/30 -rotate-6" />
        <div className="absolute top-3/4 left-0 w-full h-0.5 bg-primary/30 rotate-3" />
        <div className="absolute left-1/4 top-0 h-full w-0.5 bg-primary/30 rotate-12" />
        <div className="absolute left-2/4 top-0 h-full w-0.5 bg-primary/30 -rotate-6" />
        <div className="absolute left-3/4 top-0 h-full w-0.5 bg-primary/30 rotate-3" />
      </div>
      
      {/* Center pin */}
      <div className="relative z-10 flex flex-col items-center space-y-2">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <p className="text-xs font-medium text-center max-w-48 truncate">
            {address}
          </p>
        </div>
      </div>
      
      {/* Open in Maps button */}
      <div className="absolute bottom-3 right-3">
        <button 
          onClick={() => {
            // Open in device's default maps app
            const encodedAddress = encodeURIComponent(address);
            window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
          }}
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg hover:bg-primary/90 transition-colors"
        >
          Open in Maps
        </button>
      </div>
    </div>
  );
};