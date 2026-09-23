import React from 'react';
import { Link } from 'react-router-dom';
import { Award , ShieldCheck, Heart, Sparkles, MapPin,ArrowRight, Globe, CheckCircle2 } from 'lucide-react';

const values = [ 
  { icon: Award,  title: "Uncompromised Quality",  desc: "We provide high quality products." },
  { icon: ShieldCheck, title: "PRODUCTS", desc: "Wide Range Home décor, fragrances, jewellery, cosmetics aur lifestyle products under one roof."},
  { icon: Heart, title: "Customer First", desc: "Dedicated to offering a seamless shopping experience and dedicated support."},
  { icon: Sparkles, title: "TRUSTED SINCE 2015", desc: "Trusted Since 2015 – Online business mein years of experience aur customer trust."},
];

const highlights = ["Directly Sourced from UAE & Saudi Arabia", "Handpicked Home, Fragrance & Décor", "Trusted Online Brand Since 2015"];

export const AboutUs: React.FC = () => (
  <div className="min-h-screen bg-[var(--color-bg-light)] text-[var(--color-text-dark)] font-sans pb-12">
    <section className="relative py-10 sm:py-20 px-4 sm:px-8 border-b border-[var(--color-border)] bg-[var(--color-card-bg)]/60">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-accent-text)] bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40">
          <Globe className="w-3 h-3" /> Our Story • Est. 2015
        </span>
        <div className="bg-white/80 backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-[var(--color-border)] text-left shadow-xs space-y-3.5 mt-4">
          <p className="text-[13px] sm:text-sm text-[var(--color-muted)] leading-relaxed font-medium">
            Discover Plastics began its journey in 2015 as an online business,
            with a simple vision to bring unique, quality, and stylish products
            to customers in Pakistan. Over the years, we have built our experience
            and customer trust by carefully selecting and sourcing imported
            products from the UAE and Saudi Arabia.
          </p>
          <p className="text-[13px] sm:text-sm text-[var(--color-muted)] leading-relaxed font-medium">
            Our collection includes thoughtfully chosen home, lifestyle, décor, fragrance, and everyday
            products that add comfort, elegance, and style to your life. We
            believe that every product should offer quality, authenticity, and
            value. That is why we continuously explore international markets to
            bring our customers products that are unique, reliable, and difficult
            to find locally.
          </p>
          <div className="pt-2 border-t border-[var(--color-border)]/60">
            <p className="text-[12px] sm:text-xs text-[var(--color-primary)] font-bold italic">
              "Our Promise: Bringing you quality imported products with a shopping experience that is convenient, reliable, and enjoyable."
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-10 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-[var(--color-border)] shadow-sm">
            <img
              src="https://res.cloudinary.com/dzplgzbz/image/upload/v1787487415/about_us_s01msl.webp"
              alt="Interior Decor"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
            <div className="absolute top-3 left-3 sm:hidden text-white">
              <p className="text-[11px] font-semibold leading-tight"> Home N' More Studio</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
          <span className="inline-flex items-center px-3 py-1 gap-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-accent-text)] bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40">
          <Award  className="w-3 h-3" />Passion & Perfection
        </span>
        </div>

          <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed font-medium">
            At Discover Plastics, we believe that beauty is found in the details. Our passion is to bring you carefully selected products that add elegance, style, and charm to everyday life. From home décor and fragrances to jewellery and cosmetics, every product is chosen with a commitment to quality, beauty, and perfection.
          </p>

          <div className="space-y-2 pt-1">
            {highlights.map((text, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                <span className="text-xs font-semibold text-[var(--color-text-dark)]">{text}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] flex items-start gap-3 shadow-xs mt-2">
            <div className="p-2 rounded-lg bg-[var(--color-primary)] text-white shrink-0">
              <MapPin size={16} />
            </div>
              <p className="text-[11px] font-medium text-[var(--color-text-dark)] leading-snug">
               Discover Plastics, SHOP NO G - 213 AQ SUPER MARKET BAHRIA TOWN KARACHI, 75300
              </p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-10 sm:py-16 px-4 sm:px-8 bg-[var(--color-card-bg)]/80 border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-accent-text)]">
            Our Standards
          </span>
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-[var(--color-text-dark)]">
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--color-border)] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[var(--color-card-bg)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[var(--color-text-dark)] mb-1">
                  {title}
                </h3>
                <p className="text-[var(--color-muted)] text-[10px] sm:text-xs leading-relaxed font-medium">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="pt-10 px-4 sm:px-8 text-center">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-5 sm:p-10 border border-[var(--color-border)] shadow-xs space-y-4">
        <h2 className="font-serif text-base sm:text-3xl font-bold text-[var(--color-text-dark)]">
          Shop Now  Discover Something Beautiful
        </h2>
        <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
          <Link to="/shop"
            className="bg-[var(--color-primary)] active:scale-95 hover:bg-[var(--color-primary-hover)] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Shop Now</span>
            <ArrowRight size={13} />
          </Link>
          <Link to="/contact"
            className="border border-[var(--color-border)] active:scale-95 bg-[var(--color-card-bg)] text-[var(--color-primary)] text-[11px] sm:text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;