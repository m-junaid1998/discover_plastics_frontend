import React, { useState } from 'react';
import { CloseIcon, SparklesIcon, TruckIcon } from '../utils/socialicons';

interface AnnouncementBarProps { offers?: { text: string; icon: React.ReactNode }[]}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
offers = [
    { text: "YOUR FAVORITE PRODUCTS, JUST A CLICK AWAY! 🛒", icon: <SparklesIcon />},
    {text: "DELIVERY ALL OVER PAKISTAN 🇵🇰", icon: <TruckIcon />},
    { text: "Flat Delivery Charges: Rs. 300 across all  cities in Pakistan!", icon: <TruckIcon /> },
  ],
}) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;

  const renderLoop = (prefix = '') => (
    <div className="flex items-center shrink-0 gap-8 pr-16" aria-hidden={prefix !== ''}>
      {offers.map((item, index) => (
        <div key={`${prefix}${index}`} className="flex items-center gap-2 font-medium tracking-wide shrink-0">
          {item.icon} <span>{item.text}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-primary text-bg-light text-xs md:text-sm py-2.5 overflow-hidden relative z-40 border-b border-primary-hover select-none flex items-center">
      <div className="flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {renderLoop('first-')}{renderLoop('second-')}{renderLoop('third-')}
        </div>
      </div>
      <button onClick={() => setIsVisible(false)} aria-label="Close announcement"
      className="px-3 py-1 bg-primary text-accent hover:text-white transition-colors z-10 shrink-0 cursor-pointer" >
      <CloseIcon />
      </button>
    </div>
  );
};
