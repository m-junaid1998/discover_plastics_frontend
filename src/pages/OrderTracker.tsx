import { useState } from "react";
import { useOrder } from "../hooks/useOrder";
import { Search, PackageCheck, CheckCircle2, Clock, XCircle, Loader2, MapPin, CreditCard, FileText } from "lucide-react";

const STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

const OrderTracker = () => {
  const [input, setInput] = useState("");
  const [{ order, searched }, setState] = useState<{ order: any; searched: boolean }>({ order: null, searched: false });
  const { getOrderById, isSingleOrderLoading } = useOrder();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const res = await getOrderById(input.trim());
    const data = res?.data?.data

    setState({
      order: data?.orderNumber || data?._id ? data : null,
      searched: true,
    });
    setInput("");
  };

  const step = order ? STEPS.findIndex((s) => s.toLowerCase() === order.status?.toLowerCase()) : -1;
  const isCancelled = order?.status?.toLowerCase() === "cancelled";
  const customer = order?.customerInfo;

  return (
    <div className="max-w-3xl mx-auto p-3 space-y-5">
      <div className=" p-4 text-center space-y-3 ">
        <div className="inline-flex text-[var(--color-accent)]">
          <PackageCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[var(--color-text-dark)] uppercase tracking-wide">Track Your Order</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Enter your Order Reference Number or ID.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="e.g. HMN-23852151"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
          <button type="submit" disabled={isSingleOrderLoading || !input.trim()} className="px-6 py-2.5 bg-[var(--color-accent)] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer">
            {isSingleOrderLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
          </button>
        </form>
      </div>
      {searched && !isSingleOrderLoading && (
        order ? (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-3 space-y-4 shadow-sm">
            <div className="grid grid-cols-3 gap-1 pb-4 border-b border-[var(--color-border)] text-center items-center">
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[var(--color-muted)] block tracking-wider">Reference</span>
                <h3 className="font-black text-[var(--color-text-dark)] text-xs sm:text-sm truncate">#{order.orderNumber || order._id}</h3>
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[var(--color-muted)] block tracking-wider">Placed On</span>
                <p className="font-semibold text-[var(--color-text-dark)] text-[11px] sm:text-xs flex items-center justify-center gap-1 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[var(--color-muted)] block tracking-wider">Status</span>
                <span className={`inline-block mt-0.5 px-2 sm:px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wide ${isCancelled ? "bg-red-100 text-red-600" : order.status?.toLowerCase() === "delivered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {order.status || "Pending"}
                </span>
              </div>
            </div>

            {!isCancelled ? (
              <div className="relative flex items-center justify-between max-w-xl mx-auto py-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-[var(--color-border)]" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-accent)] transition-all duration-300" style={{ width: `${step >= 0 ? (step / (STEPS.length - 1)) * 100 : 0}%` }} />
                {STEPS.map((s, idx) => (
                  <div key={s} className="relative z-10 flex flex-col items-center gap-1 bg-[var(--color-card-bg)] px-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= idx ? "bg-[var(--color-accent)] text-white" : "border-2 border-[var(--color-border)] text-[var(--color-muted)] bg-white"}`}>
                      {step >= idx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[var(--color-text-dark)]">{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Order was cancelled.
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              {customer && (
                <div className="p-4 bg-gray-50/70 border border-[var(--color-border)] rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-[var(--color-text-dark)] pb-1 border-b border-[var(--color-border)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" /> SHIPPING ADDRESS
                  </div>
                  <div className="space-y-1 pt-1 text-[var(--color-text-dark)]">
                    <div className="flex gap-2"><span className="text-[var(--color-muted)] font-medium w-16 shrink-0">Name:</span><span className="font-semibold">{customer.fullName}</span></div>
                    <div className="flex gap-2"><span className="text-[var(--color-muted)] font-medium w-16 shrink-0">Address:</span><span className="font-semibold capitalize">{customer.address}, {customer.city}</span></div>
                    <div className="flex gap-2"><span className="text-[var(--color-muted)] font-medium w-16 shrink-0">Phone:</span><span className="font-semibold">{customer.phone}</span></div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50/70 border border-[var(--color-border)] rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-[var(--color-text-dark)] pb-1 border-b border-[var(--color-border)]">
                    <CreditCard className="w-3.5 h-3.5 text-[var(--color-accent)]" /> PAYMENT INFORMATION
                  </div>
                  <div className="space-y-1 pt-2 text-[var(--color-text-dark)]">
                    <div className="flex justify-between"><span className="text-[var(--color-muted)] font-medium">Method:</span><span className="font-semibold">{order.paymentMethod}</span></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-dashed border-[var(--color-border)] flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span className="text-sm text-[var(--color-accent)]">Rs. {order.totalPrice}</span>
                </div>
              </div>
            </div>
            {order.orderItems?.length > 0 && (
              <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
                <div className="flex items-center gap-1 font-black uppercase text-xs text-[var(--color-text-dark)]">
                  <FileText className="w-3.5 h-3.5 text-[var(--color-accent)]" /> Items ({order.orderItems.length})
                </div>
                <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
                  {order.orderItems.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between p-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-[var(--color-text-dark)]">{item.name}</p>
                          <p className="text-[11px] text-[var(--color-muted)]">Rs. {item.price} × {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[var(--color-text-dark)]">Rs. {item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[var(--color-card-bg)] border border-dashed border-[var(--color-border)] rounded-2xl p-8 text-center space-y-2">
            <Clock className="w-8 h-8 mx-auto text-[var(--color-muted)]" />
            <h3 className="text-xs font-black uppercase text-[var(--color-text-dark)]">No Order Found</h3>
            <p className="text-xs text-[var(--color-muted)]">No record exists for the provided Order Reference ID.</p>
          </div>
        )
      )}
    </div>
  );
};

export default OrderTracker;