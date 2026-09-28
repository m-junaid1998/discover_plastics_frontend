import React from 'react';
import logo from '/logo.png';

export const PageLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 bg-[var(--color-primary)] flex flex-col items-center justify-center select-none overflow-hidden text-white">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[35%] left-[38%] w-3 h-3 rounded-full bg-[var(--color-accent)]/20 animate-ping" />
      <div className="absolute top-[28%] right-[42%] w-5 h-5 rounded-full border border-[var(--color-accent)]/30 animate-pulse" />
      <div className="absolute bottom-[28%] left-[41%] w-4 h-4 rounded-lg border border-[var(--color-accent)]/20 rotate-12" />
    </div>
    <div className="relative z-10 flex flex-col items-center">
      <div className="p-4 rounded-2xl bg-white/5 border border-[var(--color-accent)]/30 backdrop-blur-md shadow-2xl flex items-center justify-center mb-6">
        <img src={logo} alt="Brand Logo" className="h-16 md:h-20 w-auto object-contain"/>
      </div>
      <div className="w-12 h-[1px] bg-[var(--color-accent)]/40 mb-6" />
      <div className="flex items-center space-x-2.5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-pulse [animation-duration:1.2s]"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default PageLoader;