import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Package,
  Truck,
  RefreshCw,
  CreditCard,
} from "lucide-react";

const DATA = [
  ["Orders", "How do I place an order?", "Browse products, select your options, add to cart, and checkout."],
  ["Orders", "Can I cancel my order?", "Orders can be canceled within 2 hours. Contact support with your Order ID."],
  ["Shipping", "What are the shipping charges?", "Standard shipping takes 3-5 business days. Orders above PKR 5,000 get free shipping."],
  ["Shipping", "How can I track my shipment?", "You will receive a WhatsApp notification with your tracking link after dispatch."],
  ["Returns", "What is your return policy?", "We offer a 7-day return and exchange policy for unused items with tags intact."],
  ["Returns", "How long does a refund take?", "Refunds are processed within 5-7 business days."],
  ["Payments", "What payment methods do you accept?", "We accept COD, bank transfer, and EasyPaisa."],
];

const CATEGORIES = [
  ["All", HelpCircle], ["Orders", Package], ["Shipping", Truck],
  ["Returns", RefreshCw], ["Payments", CreditCard],
];

const FAQ = () => {
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(0);

  const faqs = DATA.filter(([cat]) => category === "All" || cat === category);

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent bg-primary/10 px-3 py-1.5 rounded-full">
          <HelpCircle size={14} /> Help Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-muted mt-2">Find answers to common questions.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {CATEGORIES.map(([name, Icon]: any) => (
          <button
            key={name}
            onClick={() => setCategory(name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${
              category === name
                ? "bg-primary text-white border-primary"
                : "bg-card-bg text-text-dark border-border"
            }`}
          >
            <Icon size={16} /> {name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {faqs.map(([_, question, answer], i) => (
          <div key={question} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <span className="font-semibold">{question}</span>
              <ChevronDown size={18} className={open === i ? "rotate-180" : ""} />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm text-muted">{answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
