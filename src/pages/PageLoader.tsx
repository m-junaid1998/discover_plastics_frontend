import React from 'react';

export const PageLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 bg-[var(--color-primary)] flex flex-col items-center justify-center select-none overflow-hidden text-white">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[35%] left-[38%] w-3 h-3 rounded-full bg-[var(--color-accent)]/20 animate-ping" />
      <div className="absolute top-[28%] right-[42%] w-5 h-5 rounded-full border border-[var(--color-accent)]/30 animate-pulse" />
      <div className="absolute bottom-[28%] left-[41%] w-4 h-4 rounded-lg border border-[var(--color-accent)]/20 rotate-12" />
    </div>

    <div className="relative z-10 flex flex-col items-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-[var(--color-accent)]/30 backdrop-blur-md shadow-2xl flex items-center justify-center mb-6">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3h8c1 0 2 1 2 2v2c0 2-2 3.5-3 5 1.5 2 3 4 3 7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2c0-3 1.5-5 3-7-1-1.5-3-3-3-5V5a2 2 0 0 1 2-2Z" />
          <path d="M12 12c-1.5 2-2 4-2 6M12 12c1.5 2 2 4 2 6" />
        </svg>
      </div>

      <h1 className="font-serif text-2xl md:text-4xl font-bold tracking-[0.2em] text-[var(--color-accent)] uppercase mb-4 pl-[0.2em]">
        Home N More
      </h1>
      
      <div className="w-12 h-[1px] bg-[var(--color-accent)]/40 mb-6" />

      <div className="flex items-center space-x-2.5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-pulse [animation-duration:1.2s]"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);