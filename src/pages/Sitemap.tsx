import React from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag, Info, Phone, Truck, ShieldCheck, Search, Heart, User, CreditCard, CheckCircle2, LogIn, UserPlus, Network } from "lucide-react";

interface Node { title: string; path: string; icon: React.ReactNode; children?: Node[] }

const TREE: Node = {
  title: "Home Root", path: "/", icon: <Home size={18} />,
  children: [
    {
      title: "Shop", path: "/shop", icon: <ShoppingBag size={18} />,
      children: [
        { title: "Track Order", path: "/track-order", icon: <Search size={14} /> },
        { title: "Wishlist", path: "/wishlist", icon: <Heart size={14} /> },
        { title: "Checkout", path: "/checkout", icon: <CreditCard size={14} /> },
        { title: "Order Confirm", path: "/order-confirmation", icon: <CheckCircle2 size={14} /> },
      ],
    },
    {
      title: "Company", path: "/aboutus", icon: <Info size={18} />,
      children: [
        { title: "Contact Us", path: "/contact", icon: <Phone size={14} /> },
        { title: "Shipping Policy", path: "/shipping-policy", icon: <Truck size={14} /> },
        { title: "Privacy Policy", path: "/privacy", icon: <ShieldCheck size={14} /> },
      ],
    },
    {
      title: "Account", path: "/myprofile", icon: <User size={18} />,
      children: [
        { title: "Login", path: "/login", icon: <LogIn size={14} /> },
        { title: "Sign Up", path: "/signup", icon: <UserPlus size={14} /> },
      ],
    },
  ],
};

const Card = ({ item, isRoot }: { item: Node; isRoot?: boolean }) => (
  <Link
    to={item.path}
    className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all shadow-xs hover:shadow-md z-10 w-full max-w-[170px] ${
      isRoot ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-900 border-[var(--color-border)] hover:border-[var(--color-primary)]"
    }`}
  >
    <div className={`p-1.5 rounded-lg shrink-0 ${isRoot ? "bg-white/20 text-white" : "bg-[var(--color-card-bg)] text-[var(--color-primary)]"}`}>{item.icon}</div>
    <div className="min-w-0">
      <p className="font-semibold text-xs truncate">{item.title}</p>
      <p className={`text-[10px] font-mono truncate ${isRoot ? "text-white/80" : "text-[var(--color-muted)]"}`}>{item.path}</p>
    </div>
  </Link>
);

const Sitemap = () => (
  <div className="min-h-screen bg-[var(--color-bg-light)] py-12 px-4">
       <header className="text-center space-y-4 pb-5">
       <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-xs max-w-full">
       <Network className="w-3.5 h-3.5 text-[var(--color-accent-text)] shrink-0" />
       <span className="text-xs sm:text-base font-bold uppercase tracking-[0.10em] sm:tracking-[0.2em] text-[var(--color-accent-text)] ">
         Website Architecture & Navigation
       </span>
     </div>
      <h1 className="text-4xl sm:text-5xl font-black text-[var(--color-primary)] font-serif tracking-tight">
       Visual Sitemap
     </h1>
   </header>
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <Card item={TREE} isRoot />
      <div className="w-0.5 h-9  bg-[var(--color-primary)]" />
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative pt-6 border-t-2 border-[var(--color-primary)] ">
        {TREE.children?.map((group) => (
          <div key={group.path} className="flex flex-col items-center relative">
            <div className="absolute -top-6 w-0.5 h-6 bg-[var(--color-primary)]" />
            <Card item={group} />
            {group.children && (
              <div className="w-full relative mt-2 flex flex-col items-end">
                <div className="absolute -top-10 left-3 w-12 h-12 border-l-3 border-t-3 border-dashed border-[var(--color-primary)] rounded-tl-xl pointer-events-none" />
                <div className="w-[calc(100%-12px)] flex flex-col items-end gap-3 pl-5 border-l-3 border-dashed border-[var(--color-primary)] ml-8 pb-1">
                  {group.children.map((child) => (
                    <div key={child.path} className="w-full  relative">
                      <div className="absolute -left-5 top-5 w-5 h-0.5 bg-[var(--color-primary)]" />
                      <Card item={child} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Sitemap;