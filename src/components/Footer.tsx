import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { z } from "zod";
import { FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon } from "../utils/socialicons";
import { useCategory } from "../hooks/useCategory";
import { useNewsletter } from "../hooks/useNewsletter";
import type { CategoryItem } from "../utils/types";
import { FormInput } from "./FormInput";

const emailSchema = z.string().trim().min(1, "Email is required").email("Invalid email address");
const ADDRESS = "HOME N’ MORE STUDIO TOWN, SHOP NO G - 213 AQ SUPER MARKET BAHRIA TOWN KARACHI BAHRIA, KARACHI, Karachi, 75300, Pakistan";

const LINKS = [
  { name: "About Us", path: "/aboutus" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Shipping Information", path: "/shipping-policy" },
];

const SOCIALS = [
  { icon: <InstagramIcon />, href: "https://instagram.com/home_n_more_studio/", label: "Instagram" },
  { icon: <FacebookIcon />, href: "https://facebook.com/homenmorestudio", label: "Facebook" },
  { icon: <PhoneIcon />, href: "tel:+923238224745", label: "Phone" },
  { icon: <MapPinIcon />, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`, label: "Location" },
];

export const Footer: React.FC = () => {
  const { categories = [], isLoadingCategories } = useCategory({ isAllRecord: true });
  const { subscribeNewsletter, isNewsletterLoading } = useNewsletter();
  const [{ email, error }, setForm] = useState({ email: "", error: "" });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = emailSchema.safeParse(email);
    if (!res.success) return setForm((p) => ({ ...p, error: res.error.issues[0].message }));
    if ((await subscribeNewsletter(res.data))?.success) setForm({ email: "", error: "" });
  };

  return (
    <footer className="bg-[var(--color-bg-light)] text-[var(--color-text-dark)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
          <div className="lg:col-span-4 pr-0 lg:pr-6">
            <h2 className="text-2xl font-bold mb-2">Discover Plastics</h2>
            <p className="text-[var(--color-muted)] text-sm mb-5">Brings gorgeous luxury products to your home!</p>
            <div className="flex items-center space-x-2">
              {SOCIALS.map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-white transition-all shadow-xs">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-serif text-base font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {LINKS.map((l, i) => <li key={i}><Link to={l.path} className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">{l.name}</Link></li>)}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-serif text-base font-bold mb-4">Categories</h3>
            {isLoadingCategories ? (
              <div className="space-y-2 animate-pulse">{[1, 2, 3, 4].map((n) => <div key={n} className="h-3.5 w-24 bg-gray-200 rounded" />)}</div>
            ) : (
              <ul className="space-y-2 text-sm">
                {categories.map((c: CategoryItem) => (
                  <li key={c._id}><Link to={`/shop?category=${encodeURIComponent(c.categoryname)}`} className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">{c.categoryname}</Link></li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-serif text-base font-bold mb-2">Newsletter</h3>
            <p className="text-xs text-[var(--color-muted)] mb-4">Subscribe for new arrivals & exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <FormInput type="text" placeholder="Enter your email" value={email} onChange={(e) => setForm({ email: e.target.value, error: "" })} leftIcon={<Mail size={16} />} error={error} disabled={isNewsletterLoading} />
              <button type="submit" disabled={isNewsletterLoading} className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50">
                {isNewsletterLoading ? "Submitting..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} Discover Plastics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};