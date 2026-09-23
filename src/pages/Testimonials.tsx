import { Star } from "lucide-react";

const reviews = [
  { name: "Ayesha Khan", text: "The quality is even better than expected! The finish is so clean and looks really classy." },
  { name: "Bilal Ahmed", text: "Super fast delivery to Lahore. Received everything safely packed without a single scratch." },
  { name: "Sera Sheikh", text: "Love the minimalist design. Totally transformed my room layout. Will definitely order again!" },
  { name: "Hamza Malik", text: "Very sturdy build and solid quality. Value for money item for sure." },
  { name: "Zainab Raza", text: "Exceeded my expectations! Color and material are exactly as shown on the website." },
  { name: "Omer Farooq", text: "Customer support was very helpful in tracking my parcel. Very happy with the overall service." },
  { name: "Mahnoor Tariq", text: "Beautiful craftsmanship. Got so many compliments from guests over the weekend!" },
  { name: "Daniyal Siddiqui", text: "Clean design and premium feel. Worth every rupee spent." },
  { name: "Fatima Noor", text: "Simple, practical, and elegant. Safe delivery and great packaging." },
];

export const Testimonials = () => (
  <section className="py-8 bg-bg-light text-text-dark font-sans">
    <div className="max-w-8xl mx-auto px-3 sm:px-8">
      <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
        <span className="text-xs sm:text-base font-bold uppercase tracking-[0.25em] sm:tracking-[0.30em] text-[#8C3B43]">
          Client Reviews
        </span>
        <h2 className="font-['Georgia, serif'] text-xl sm:text-4xl font-extrabold uppercase tracking-wide">
          What Our Customers Say
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
        {reviews.map(({ name, text }, i) => (
          <div
            key={i}
            className="bg-card-bg border border-border p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:border-[#8C3B43] transition-all space-y-2 sm:space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3 border-b border-border/80 pb-2 sm:pb-3.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-white font-serif font-bold text-[10px] sm:text-xs flex items-center justify-center border border-accent/40 shrink-0">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <h3 className="font-['Georgia, serif'] text-xs sm:text-base font-bold text-text-dark uppercase tracking-normal sm:tracking-wider truncate flex-1">
                  {name}
                </h3>
              </div>
              <div className="flex gap-0.5 sm:gap-1">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#8C3B43] text-[#8C3B43] shrink-0" />
                ))}
              </div>
              <p className="text-[11px] sm:text-sm text-text-dark leading-snug sm:leading-relaxed font-normal">
                "{text}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;