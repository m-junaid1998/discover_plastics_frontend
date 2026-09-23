import React from 'react';
import { ShieldCheck, Lock, Mail, Phone, MapPin, Info, Database } from 'lucide-react';

const PrivacyPolicy: React.FC = () => (
  <div className="bg-[var(--color-bg-light)] text-[var(--color-text-dark)] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center border-b border-[var(--color-border)] pb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-card-bg)] text-[var(--color-accent)] mb-3 shadow-xs">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)]">Privacy Policy</h1>
        <p className="mt-1 text-xs text-[var(--color-muted)] font-medium">Last Updated: August 2026</p>
      </header>

      <main className="space-y-6 text-sm text-[var(--color-text-dark)] leading-relaxed">
        <section className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-xs">
          <h2 className="text-base font-serif font-bold text-[var(--color-primary)] mb-2 flex items-center gap-2"><Info size={16} className="text-[var(--color-accent)]" />Introduction</h2>
          <p className="text-[var(--color-muted)]">Welcome to <b className="text-[var(--color-accent)]">Discover Plastics</b>. We respect your privacy and are committed to protecting your personal data when you visit or purchase from our store.</p>
        </section>

        <section className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-xs">
          <h2 className="text-base font-serif font-bold text-[var(--color-primary)] mb-2 flex items-center gap-2"><Database size={16} className="text-[var(--color-accent)]" />Information We Collect & Use</h2>
          <ul className="list-disc pl-5 space-y-1 text-[var(--color-muted)]">
            <li><strong>Personal & Order Info:</strong> Name, address, phone number, email, and order details for dispatch and support.</li>
            <li><strong>Technical Data:</strong> IP address, device specs, and browser metrics to optimize shopping experience.</li>
          </ul>
        </section>

        <section className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-xs">
          <h2 className="text-base font-serif font-bold text-[var(--color-primary)] mb-2 flex items-center gap-2"><Lock size={16} className="text-[var(--color-accent)]" />Data Protection & Cookies</h2>
          <p className="text-[var(--color-muted)]">We <strong>never sell or rent</strong> your data. Information is shared only with logistics partners. Cookies are used strictly to maintain your cart and preferences.</p>
        </section>

              <div className="space-y-3">
                 <div className="group flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-[var(--color-border)]/60 hover:border-[var(--color-accent)] transition-all duration-300">
                   <div className="p-2 rounded-lg bg-[var(--color-card-bg)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors shrink-0 mt-0.5">
                     <MapPin size={15} />
                   </div>
     
                   <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-dark)] ">
                     Discover Plastics, SHOP NO. G-213, AQ SUPER MARKET,
                     BAHRIA TOWN, KARACHI, 75300
                   </p>
                 </div>
     
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <a
                     href="tel:+923238224745"
                     className="group flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-[var(--color-border)]/60 hover:border-[var(--color-accent)] transition-all duration-300"
                   >
                     <div className="p-2 rounded-lg bg-[var(--color-card-bg)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors shrink-0">
                       <Phone size={15} />
                     </div>
                     <div className="space-y-0.5">
                       <span className="text-xs sm:text-sm font-semibold text-[var(--color-text-dark)]">
                         03238224745
                       </span>
                     </div>
                   </a>
                   <a
                     href="mailto:info@discoverpak.com"
                     className="group flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-[var(--color-border)]/60 hover:border-[var(--color-accent)] transition-all duration-300"
                   >
                     <div className="p-2 rounded-lg bg-[var(--color-card-bg)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors shrink-0">
                       <Mail size={15} />
                     </div>
                     <div className="space-y-0.5 ">
                       <span className="text-xs sm:text-sm font-semibold text-[var(--color-text-dark)] truncate block">
                         info@discoverpak.com
                       </span>
                     </div>
                   </a>
                 </div>
               </div>
      </main>
    </div>
  </div>
);

export default PrivacyPolicy;