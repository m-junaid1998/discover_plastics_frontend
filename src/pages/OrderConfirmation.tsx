import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Truck, User, Phone, MapPin, PackageCheck, Banknote } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.orderDetails;

  if (!order || (!order._id && !order.orderNumber)) {
    return <Navigate to="/" replace />;
  }

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] text-[var(--color-text-dark)] py-8 px-4 max-w-5xl mx-auto space-y-8 font-sans">
      <Breadcrumb
        items={[{ label: "Home", link: "/" }, { label: "Order Confirmation" }]}
      />

      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
          We&apos;ve received your order and will call shortly to confirm. A
          summary is shown below.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-[var(--color-muted)] uppercase">
            ORDER NUMBER
          </span>
          <p className="text-sm sm:text-base font-bold font-serif text-[var(--color-accent-text)]">
            {order.orderNumber || "N/A"}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-[var(--color-muted)] uppercase">
            ORDER DATE
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-dark)]">
            {formattedDate}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-[var(--color-muted)] uppercase">
            PAYMENT METHOD
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-dark)] flex items-center gap-1.5">
            <Banknote size={16} className="text-[var(--color-accent)]" />
            {order.paymentMethod || "Cash on Delivery"}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Delivery Details */}
        <div className="lg:col-span-6 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
              <Truck size={18} className="text-[var(--color-accent)]" />
              <h2 className="text-base sm:text-lg font-bold font-serif">
                Delivery Details
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[var(--color-text-dark)]">
              <div className="flex items-start gap-2.5">
                <User
                  size={15}
                  className="text-[var(--color-muted)] shrink-0 mt-0.5"
                />
                <span className="font-semibold">
                  {order.customerInfo?.fullName || "N/A"}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone
                  size={15}
                  className="text-[var(--color-muted)] shrink-0 mt-0.5"
                />
                <span>{order.customerInfo?.phone || "N/A"}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin
                  size={15}
                  className="text-[var(--color-muted)] shrink-0 mt-0.5"
                />
                <span className="leading-relaxed">
                  {order.customerInfo?.address}
                  {order.customerInfo?.areaTown ? `, ${order.customerInfo.areaTown}` : ""}
                  {order.customerInfo?.city ? `, ${order.customerInfo.city}` : ""}
                  {order.customerInfo?.postalCode ? ` - ${order.customerInfo.postalCode}` : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-dark)]">
              <PackageCheck size={15} className="text-[var(--color-accent)]" />
              <span>Estimated Delivery Timeline</span>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] pl-5">
              3 to 5 business days across Pakistan
            </p>
          </div>
        </div>

        {/* Order Items & Price Summary */}
        <div className="lg:col-span-6 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold font-serif border-b border-[var(--color-border)] pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-56 overflow-y-auto no-scrollbar divide-y divide-[var(--color-border)]">
              {order.orderItems?.map((item: any, idx: number) => (
                <div
                  key={item._id || idx}
                  className="pt-3 first:pt-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white border border-[var(--color-border)]"
                    />
                    <div>
                      <h4 className="text-xs font-bold truncate max-w-[180px] sm:max-w-[220px]">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[var(--color-muted)]">
                        Qty: {item.qty}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-sans">
                    PKR {(item.price * item.qty)?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Subtotal</span>
              <span className="font-semibold text-[var(--color-text-dark)]">
                PKR {order.itemsPrice?.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Delivery Charges</span>
              <span className="font-semibold text-[var(--color-text-dark)]">
                {order.shippingPrice === 0
                  ? "FREE"
                  : `PKR ${order.shippingPrice}`}
              </span>
            </div>

            <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-sm font-bold">
              <span>TOTAL AMOUNT</span>
              <span className="text-[var(--color-accent-text)]">
                PKR {order.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl shadow-md transition-all cursor-pointer"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;