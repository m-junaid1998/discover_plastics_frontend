import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, User, CheckCircle2, Store, Send, Loader2 } from 'lucide-react';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { WhatsAppIcon } from '../utils/socialicons';
import { useContact } from '../hooks/useContact';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  message: z.string().trim().min(1, 'Message cannot be empty'),
});

type ContactFormData = z.infer<typeof schema>;

const INFO = [
  { icon: <Mail size={22} />, title: 'Email', content: <a href="mailto:homenmorestudio26@gmail.com" className="text-[var(--color-text-dark)] font-medium text-sm hover:text-[var(--color-accent)]">homenmorestudio26@gmail.com</a> },
  { icon: <Phone size={22} />, title: 'Phone / WhatsApp', content: <><a href="tel:+923238224745" className="text-[var(--color-text-dark)] font-semibold text-sm mb-2">03238224745</a><a href="https://wa.me/923238224745" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1.5 text-xs text-[var(--color-primary)] font-medium hover:underline"><WhatsAppIcon size={16} /><span>Chat on WhatsApp</span></a></> },
  { icon: <MapPin size={22} />, title: 'Location', content: <p className="text-[var(--color-muted)] text-sm max-w-[220px] leading-relaxed"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("HOME N’ MORE STUDIO TOWN, SHOP NO G - 213 AQ SUPER MARKET BAHRIA TOWN KARACHI BAHRIA, KARACHI, Karachi, 75300, Pakistan")}`}target="_blank" rel="noopener noreferrer">
    HOME N’ MORE STUDIO TOWN, SHOP NO G - 213 AQ SUPER MARKET BAHRIA TOWN KARACHI BAHRIA, KARACHI, Karachi, 75300, Pakistan</a></p> }];

const FEATS = [
  { title: 'Luxury Aesthetics', desc: 'Curated home decor & signature fragrances' },
  { title: 'Nationwide Delivery', desc: 'Reaching all major cities across Pakistan' },
  { title: 'Cash on Delivery', desc: 'Pay safely when your parcel arrives' },
  { title: 'Fragrance Care', desc: 'Secure & shatter-proof glass packaging' }
];

const Contact = () => {
  const { submitContactQuery, isContactMutationLoading: loading } = useContact();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (data: ContactFormData) => {
    const res = await submitContactQuery(data);
    if (res?.success) reset();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] pb-20 font-sans text-[var(--color-text-dark)]">
      <section className="bg-[var(--color-primary)] text-white text-center pt-16 pb-28 px-4">
        <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3 tracking-wide">Get in Touch</h1>
        <p className="text-gray-300 max-w-xl mx-auto text-xs md:text-sm font-light leading-relaxed">We'd love to hear from you. Reach out with questions, custom orders, or fragrance inquiries.</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {INFO.map(({ icon, title, content }, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-sm border border-[var(--color-border)] flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-card-bg)] text-[var(--color-primary)] flex items-center justify-center mb-4">{icon}</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2">{title}</h3>
              {content}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text-dark)] mb-1">Send Us a Message</h2>
              <p className="text-xs text-[var(--color-muted)] mb-6">Fill out the form below and we'll respond within 24 hours.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <FormInput label="Name" placeholder="Your name" leftIcon={<User size={16} />} {...register('name')} />
                  {errors.name && <p className="text-[11px] text-[var(--color-danger)] mt-1 font-medium">{errors.name.message}</p>}
                </div>

                <div>
                  <FormInput label="Email" type="email" placeholder="you@gmail.com" leftIcon={<Mail size={16} />} {...register('email')} />
                  {errors.email && <p className="text-[11px] text-[var(--color-danger)] mt-1 font-medium">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs required font-semibold text-[var(--color-text-dark)] mb-1.5 select-none">
                    Message 
                  </label>
                  <textarea rows={4} placeholder="Tell us more about your inquiry..."
                    {...register('message')}
                    className="w-full bg-white text-xs sm:text-sm rounded-xl p-3.5 border border-[var(--color-border)] outline-none focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-gray-400 resize-none"
                  />
                  {errors.message && <p className="text-[11px] text-[var(--color-danger)] mt-1 font-medium">{errors.message.message}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={loading}
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl"
                  rightIcon={loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6"><Store size={32} /></div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-dark)] mb-8">Why Shop with Home N More Studio?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-left w-full max-w-lg">
              {FEATS.map((f, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle2 size={18} className="text-[var(--color-accent)] shrink-0 mt-0.5 fill-[var(--color-accent)]/20" />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-text-dark)] uppercase tracking-wide">{f.title}</h4>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;