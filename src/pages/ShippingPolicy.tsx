import { Truck, Clock, Calendar, CheckCircle2, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="bg-[var(--color-bg-light)] min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <header className="text-center space-y-4 pb-10 border-b border-[var(--color-border)]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent-text)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
              Client Care & Logistics
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[var(--color-primary)] font-serif tracking-tight">
            Shipping & Delivery Policy
          </h1>
        </header>

        <div
          className="grid grid-cols-2 gap-3 sm:gap-6"
          aria-label="Shipping Rates"
        >
          {/* Karachi Card */}
          <div className="group relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl p-3 sm:p-5 transition duration-300 hover:border-[var(--color-accent)] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[var(--color-primary)] text-white shadow-md">
                  <MapPin className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[var(--color-bg-light)] text-[var(--color-badge)] border border-[var(--color-border)]">
                  Local
                </span>
              </div>

              <h3 className="text-xs sm:text-base font-bold text-[var(--color-text-dark)] uppercase tracking-wide">
                Karachi Express
              </h3>
              <p className="text-[10px] sm:text-xs text-[var(--color-muted)] mt-0.5 mb-2 line-clamp-1">
                Within City Limits
              </p>
            </div>

            <div className="flex items-baseline gap-0.5 sm:gap-1 pt-2 border-t border-[var(--color-border)]/60">
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-muted)]">
                PKR
              </span>
              <span className="text-2xl sm:text-4xl font-black text-[var(--color-primary)] font-serif">
                300
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[var(--color-muted)]">
                /=
              </span>
            </div>
          </div>

          <div className="group relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl sm:rounded-3xl p-3 sm:p-5 transition duration-300 hover:border-[var(--color-accent)] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[var(--color-accent-text)] text-white shadow-md">
                  <Truck className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[var(--color-bg-light)] text-[var(--color-accent-text)] border border-[var(--color-border)]">
                  Nationwide
                </span>
              </div>

              <h3 className="text-xs sm:text-base font-bold text-[var(--color-text-dark)] uppercase tracking-wide">
                Nationwide Express
              </h3>
              <p className="text-[10px] sm:text-xs text-[var(--color-muted)] mt-0.5 mb-2 ">
                All Other Cities Across Pakistan
              </p>
            </div>

            <div className="flex items-baseline gap-0.5 sm:gap-1 pt-2 border-t border-[var(--color-border)]/60">
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-muted)]">
                PKR
              </span>
              <span className="text-2xl sm:text-4xl font-black text-[var(--color-primary)] font-serif">
                600
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[var(--color-muted)]">
                /=
              </span>
            </div>
          </div>
        </div>
        <section className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4  space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
            <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
            <h2 className="text-base font-bold text-[var(--color-primary)] uppercase">
              Delivery Terms & Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-5">
            <div className="group flex items-start gap-4 p-3 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-sm">
              <div className="p-3 rounded-xl bg-[var(--color-primary)] text-white shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1 pt-0.5">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-accent-text)] font-sans">
                  Estimated Delivery Timeline
                </h3>
                <p className="text-xs sm:text-xs text-[var(--color-text-dark)] leading-relaxed font-normal">
                  Standard delivery completes within{" "}
                  <strong className="font-semibold">2 to 5 working days</strong>
                  . However, delivery can extend up to{" "}
                  <strong className="font-semibold">7 working days</strong>{" "}
                  during peak sales seasons or high order demand.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-3 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-sm">
              <div className="p-3 rounded-xl bg-[var(--color-primary)] text-white shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1 pt-0.5">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-accent-text)] font-sans">
                  Sundays & National Holidays
                </h3>
                <p className="text-xs sm:text-xs text-[var(--color-text-dark)] leading-relaxed font-normal">
                  Orders placed on Sundays or official Pakistan National
                  Holidays will be processed and dispatched on the{" "}
                  <strong className="font-semibold">
                    very next working day
                  </strong>
                  .
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-3 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-sm">
              <div className="p-3 rounded-xl bg-[var(--color-primary)] text-white shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 pt-0.5">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-accent-text)] font-sans">
                  First-Time Order Verification
                </h3>
                <p className="text-xs sm:text-xs text-[var(--color-text-dark)] leading-relaxed font-normal">
                  To prevent unauthorized orders, first-time customers will
                  receive a quick verification via{" "}
                  <strong className="font-semibold">
                    Call, SMS, or WhatsApp
                  </strong>{" "}
                  from our Client Relations team prior to dispatch.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
