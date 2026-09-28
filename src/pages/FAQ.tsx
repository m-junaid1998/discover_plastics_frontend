import React, { useState, useMemo } from "react";
import { Search, ChevronDown, HelpCircle, Package, Truck, RefreshCw, CreditCard } from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "1",
    category: "Orders",
    question: "How do I place an order on the platform?",
    answer: "Simply browse our product catalog, select your desired color or size, click 'Add to Cart', and proceed to checkout. Follow the step-by-step shipping and payment process to confirm your order.",
  },
  {
    id: "2",
    category: "Orders",
    question: "Can I cancel or modify my order after placing it?",
    answer: "Orders can be modified or canceled within 2 hours of placement. Please contact our support team immediately with your Order ID for assistance.",
  },
  {
    id: "3",
    category: "Shipping",
    question: "What are the shipping charges and delivery timelines?",
    answer: "Standard shipping takes 3-5 business days. Delivery fees are calculated at checkout based on location. Orders above PKR 5,000 qualify for free standard shipping.",
  },
  {
    id: "4",
    category: "Shipping",
    question: "How can I track my shipment?",
    answer: "Once your order is dispatched, you will receive whatsapp notification containing your unique tracking link and courier details.",
  },
  {
    id: "5",
    category: "Returns",
    question: "What is your return and exchange policy?",
    answer: "We offer a hassle-free 7-day return and exchange policy for unused items in their original packaging with tags intact. Defective items are eligible for immediate replacement.",
  },
  {
    id: "6",
    category: "Returns",
    question: "How long does it take to process a refund?",
    answer: "After receiving and inspecting your returned package, refunds are processed within 5-7 business days back to your original payment method or store credit.",
  },
  {
    id: "7",
    category: "Payments",
    question: "What payment methods do you accept?",
    answer: "We accept Cash on Delivery (COD), and direct bank transfers/ Easy Paisa. All digital transactions are secured.",
  },
 
];

const CATEGORIES = [
  { name: "All", icon: HelpCircle },
  { name: "Orders", icon: Package },
  { name: "Shipping", icon: Truck },
  { name: "Returns", icon: RefreshCw },
  { name: "Payments", icon: CreditCard },
];

export const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>("1");

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans">

      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-accent bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Help Center
        </span>
        <h1 className="font-serif text-xl sm:text-4xl font-extrabold text-primary tracking-wide">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
          Have questions? We're here to help. Find answers to common queries about orders, shipping, returns, and payments.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for answers (e.g. shipping, returns, payment)..."
          className="w-full bg-card-bg border border-border focus:border-accent text-sm text-text-dark rounded-2xl pl-12 pr-4 py-3.5 outline-none font-semibold shadow-sm transition-all placeholder:text-muted/70"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-text-dark font-bold cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                isActive
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-card-bg text-text-dark border-border hover:border-accent"
              }`}
            >
              <Icon size={16} className={isActive ? "text-accent" : "text-muted"} />
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-card-bg border border-border rounded-2xl overflow-hidden transition-all shadow-xs hover:border-accent/50"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex justify-between items-center p-4 sm:p-5 text-left cursor-pointer gap-4"
                >
                  <span className="font-[Georgia] font-bold text-base sm:text-lg text-text-dark leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-full bg-bg-light border border-border text-primary shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-primary text-white border-primary" : ""
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-card-bg border border-border rounded-2xl space-y-3">
            <HelpCircle className="w-10 h-10 text-muted mx-auto" />
            <h3 className="font-bold text-text-dark text-base">No results found</h3>
            <p className="text-xs text-muted">Try searching with different keywords or switch category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;