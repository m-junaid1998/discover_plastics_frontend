import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Sparkles, AlertCircle, Building2, Copy, Check, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { Breadcrumb } from "../components/Breadcrumb";
import { toast } from "../utils/toast";
import { WhatsAppIcon } from "../utils/socialicons";
import { useOrder } from "../hooks/useOrder";
import { useCart } from "../hooks/useCart";
import { createSlug, validateEmptyObject } from "../utils/helper";

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full Name required"),
  phone: z
    .string()
    .regex(/^((\+92)|(0092)|(0))?3[0-9]{9}$/, "Valid PK number required"),
  country: z.string().trim().min(2, "Country is required").max(30),
  city: z.string().min(1, "City required"),
  area: z.string().min(1, "Area required"),
  address: z.string().min(5, "Address required"),
  postalCode: z.string().optional(),
  orderNotes: z.string().optional(),
  paymentMethod: z.enum(["Cash on Delivery", "Online Payment"], {
    message: "Payment method is required",
  }),
});
type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { createOrder, isOrderMutationLoading } = useOrder();
  const {
    cartItems: liveCartItems,
    isLoadingCart,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCart();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      country: "Pakistan",
      city: "",
      postalCode: "",
      area: "",
      address: "",
      orderNotes: "",
      paymentMethod: "Cash on Delivery", 
    },
  });

  const paymentMethod = watch("paymentMethod");

  interface CheckoutItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    img: string;
    stock: number;
  }

  const checkoutItems: CheckoutItem[] = liveCartItems.map((item: any) => {
    const p = item.product || {};
    return {
      id: String(p._id ?? ""),
      name: p.name || "Product",
      price: p.salePrice || p.regularPrice || 0,
      qty: item.qty || 1,
      img: p.images?.[0] || "",
      stock: p.stock ?? Infinity,
    };
  });

  const updateQty = (id: string, delta: number) => {
    const target = checkoutItems.find((i) => i.id === id);
    if (!target) return;
    const newQty = target.qty + delta;
    if (delta > 0 && newQty > target.stock) {
      toast.error(
        "Stock Limit Reached",
        `Only ${target.stock} units available in stock.`
      );
      return;
    }
    if (newQty < 1) {
      removeFromCart(id, target.name);
      return;
    }
    addToCart(id, newQty, true);
  };

  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const deliveryCharge = subtotal >= 5000 ? 0 : 300;

  const onlineDiscount = paymentMethod === "Online Payment" ? Math.round(subtotal * 0.05) : 0;
  const totalAmount = subtotal + deliveryCharge - onlineDiscount;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success("Copied to clipboard", text);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendPaymentProof = () => {
    const msg = `Hi, I want to send payment proof for my order.\nAmount: PKR ${totalAmount.toLocaleString()}\nPayment Method: Online Payment (Bank / Easypaisa)`;
    window.open(`https://wa.me/923138257220?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (checkoutItems.length === 0) {
      return toast.error("Cart is empty", "Please add items first.");
    }
    try {
      const customerInfoPayload = validateEmptyObject({
        fullName: data.fullName,
        phone: data.phone,
        country: data.country,
        city: data.city,
        areaTown: data.area,
        address: data.address,
      });
      const payload = {
        customerInfo: {
          ...customerInfoPayload,
          postalCode: data.postalCode || "",
          orderNotes: data.orderNotes?.trim() || "",
        },
        orderItems: checkoutItems.map((item) => ({
          product: item.id,
          name: item.name,
          qty: item.qty,
          image: item.img,
          price: item.price,
        })),
        itemsPrice: subtotal,
        shippingPrice: deliveryCharge,
        discountPrice: onlineDiscount,
        totalPrice: totalAmount,
        paymentMethod: data.paymentMethod,
      };

      const res = await createOrder(payload);

      if (res?.success) {
        await clearCart();
        navigate("/order-confirmation", {
          state: { orderDetails: res?.data?.data },
          replace: true,
        });
      }
    } catch (error: any) {
      if (!error?.message?.startsWith("Please enter")) {
        toast.error(
          "Order Failed",
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!"
        );
      }
    }
  };

  const handleWhatsApp = () => {
    if (checkoutItems.length === 0)
      return toast.error(
        "Cart is empty",
        "Please add items before sending inquiry."
      );
    const totalUnits = checkoutItems.reduce((acc, item) => acc + item.qty, 0);
    const itemWord =
      checkoutItems.length > 1 || totalUnits > 1 ? "items" : "item";
    const itemsFormatted = checkoutItems
      .map((item, idx) => {
        const itemLink = `${window.location.origin}/product/${createSlug(item.name)}`;
        const qtyWord = item.qty > 1 ? "items" : "item";
        return [
          `*${idx + 1}. ${item.name.toUpperCase()}*`,
          `Quantity: ${item.qty} ${qtyWord}`,
          `Price: Rs. ${item.price.toLocaleString()} x ${item.qty} = *Rs. ${(item.price * item.qty).toLocaleString()}*`,
          `Link: ${itemLink}`,
        ].join("\n");
      })
      .join("\n\n");

    const msg = [
      "*INQUIRY / ORDER DETAILS*",
      "-------------------------------",
      `*ITEMS ORDERED (${checkoutItems.length}):*`,
      itemsFormatted,
      "",
      `*Subtotal:* Rs. ${subtotal.toLocaleString()}`,
      `*Shipping:* ${deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`}`,
      ...(onlineDiscount > 0 ? [`*Online Discount (5%):* -Rs. ${onlineDiscount.toLocaleString()}`] : []),
      `*Grand Total:* *Rs. ${totalAmount.toLocaleString()}*`,
      "-------------------------------",
      `Hi, I want to place an order for the ${itemWord} listed above. Please share further details.`,
    ].join("\n");

    window.open(
      `https://wa.me/923238224745?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const ReqLabel = ({ text }: { text: string }) => (
    <span>
      {text} <span className="text-red-500 font-bold ml-0.5">*</span>
    </span>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] text-[var(--color-text-dark)] py-8 px-4 max-w-7xl mx-auto space-y-6 font-sans">
      <Breadcrumb
        items={[{ label: "Home", link: "/" }, { label: "Checkout" }]}
      />
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold tracking-widest text-[var(--color-accent)] uppercase">
          SECURE CHECKOUT
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif">
          Complete Your Order
        </h1>
        <p className="text-xs text-[var(--color-muted)] flex items-center justify-center gap-1">
          <Lock size={12} /> Your information is safe and used only for delivery
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4"
      >
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold font-serif">
                Customer Information
              </h2>
              <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">
                STEP 1
              </span>
            </div>
            <FormInput
              label={<ReqLabel text="Full Name" />}
              {...register("fullName")}
              error={errors.fullName?.message}
              placeholder="Enter Full Name"
              className="!bg-[var(--color-card-bg)] !border-[var(--color-border)]"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormInput
                label={<ReqLabel text="Phone Number" />}
                {...register("phone")}
                error={errors.phone?.message}
                placeholder="Enter Your Phone Number"
                className="!bg-[var(--color-card-bg)] !border-[var(--color-border)]"
              />
              <FormInput
                label="Country"
                {...register("country")}
                error={errors.country?.message}
                placeholder="Country Name"
                className="!bg-[var(--color-card-bg)] !border-[var(--color-border)]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormInput
                label={<ReqLabel text="City" />}
                {...register("city")}
                error={errors.city?.message}
                placeholder="Enter City"
                className="!bg-[var(--color-card-bg)] !border-[var(--color-border)]"
              />
              <FormInput
                label="Postal Code"
                {...register("postalCode")}
                error={errors.postalCode?.message}
                placeholder="Postal Code (Optional)"
                className="!bg-[var(--color-card-bg)] !border-[var(--color-border)]"
              />
            </div>
            <FormInput
              label={<ReqLabel text="Area / Town" />}
              {...register("area")}
              error={errors.area?.message}
              placeholder="Enter Your Area/Town"
              className="!bg-[var(--color-card-bg)] !border-[var(--color-border)]"
            />
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                <ReqLabel text="Complete Delivery Address" />
              </label>
              <textarea
                {...register("address")}
                rows={3}
                placeholder="House #, Street, Landmark..."
                className="w-full rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-none"
              />
              {errors.address && (
                <p className="flex items-center space-x-1 text-xs text-red-500 font-medium mt-1">
                  <AlertCircle size={13} />
                  <span>{errors.address.message}</span>
                </p>
              )}
            </div>
            <textarea
              {...register("orderNotes")}
              rows={2}
              placeholder="Order Notes (optional)"
              className="w-full rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-none"
            />
          </div>

          {/* STEP 2: Payment Method */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold font-serif">Payment Method</h2>
              <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">
                STEP 2
              </span>
            </div>

            <div className="space-y-3">
              {/* Cash On Delivery Option */}
              <label
                onClick={() => setValue("paymentMethod", "Cash on Delivery")}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === "Cash on Delivery"
                    ? "border-[var(--color-accent)] bg-emerald-50/20 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value="Cash on Delivery"
                  {...register("paymentMethod")}
                  className="mt-1 accent-[var(--color-primary)] cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold">Cash on Delivery (COD)</h4>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    Pay in cash when your order arrives at your doorstep.
                  </p>
                  <p className="text-[10px] text-[var(--color-text-dark)] font-medium flex items-center gap-1 pt-0.5">
                    <ShieldCheck size={12} className="text-[var(--color-success)]" />
                    100% secure — Inspect before payment
                  </p>
                </div>
              </label>

              <label
                onClick={() => setValue("paymentMethod", "Online Payment")}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === "Online Payment"
                    ? "border-[var(--color-accent)] bg-emerald-50/20 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value="Online Payment"
                  {...register("paymentMethod")}
                  className="mt-1 accent-[var(--color-primary)] cursor-pointer"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold">Online Payment (Bank Transfer / Easypaisa)</h4>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      5% OFF
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    Get instant 5% discount on paying via Bank Transfer or Easypaisa.
                  </p>
                </div>
              </label>

              {paymentMethod === "Online Payment" && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-4 animate-fadeIn">
                  {/* Bank Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-amber-200/60 pb-1.5">
                      <Building2 size={15} className="text-amber-800" />
                      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                        1. Bank Transfer (Habib Metro Bank)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Bank Name</p>
                        <p className="font-bold text-gray-900">Habib Metro Bank</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Account Title</p>
                        <p className="font-bold text-gray-900">ABDUL REHMAN MIRZA</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Account No.</p>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 font-mono">6016 3203 1171 4167 932</p>
                          <button
                            type="button"
                            onClick={() => handleCopy("6016320311714167932", "acc")}
                            className="text-gray-500 hover:text-black cursor-pointer"
                          >
                            {copiedField === "acc" ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">IBAN</p>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 font-mono text-[11px]">PK84 MPBL 0163 0271 4016 7932</p>
                          <button
                            type="button"
                            onClick={() => handleCopy("PK84MPBL0163027140167932", "iban")}
                            className="text-gray-500 hover:text-black cursor-pointer"
                          >
                            {copiedField === "iban" ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Easypaisa / Mobile Wallet Details */}
                  <div className="space-y-2 pt-2 border-t border-amber-200/60">
                    <div className="flex items-center gap-2 border-b border-amber-200/60 pb-1.5">
                      <Smartphone size={15} className="text-emerald-700" />
                      <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                        2. Easypaisa Account
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Account Title</p>
                        <p className="font-bold text-gray-900">ABDUL REHMAN MIRZA</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Easypaisa Mobile No.</p>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 font-mono">0331 38257220</p>
                          <button
                            type="button"
                            onClick={() => handleCopy("03238224745", "easy")}
                            className="text-gray-500 hover:text-black cursor-pointer"
                          >
                            {copiedField === "easy" ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Payment Proof Button */}
                  <div className="pt-2 border-t border-amber-200/60">
                    <p className="text-[10px] text-gray-600 mb-2">
                      Transfer karne ke baad transaction screenshot WhatsApp par send kar dein:
                    </p>
                    <button
                      type="button"
                      onClick={handleSendPaymentProof}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <WhatsAppIcon size={14} /> Send Payment Proof
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 3: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs sticky top-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold font-serif">Order Summary</h2>
              <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">
                STEP 3
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600 shrink-0" />
              <span>Free delivery on orders over PKR 5,000</span>
            </div>

            <div className="space-y-3 overflow-y-auto no-scrollbar pr-1 max-h-[300px]">
              {isLoadingCart ? (
                <p className="text-xs text-[var(--color-muted)] text-center py-4">
                  Loading items...
                </p>
              ) : checkoutItems.length === 0 ? (
                <p className="text-xs text-[var(--color-muted)] text-center py-4">
                  No items in checkout.
                </p>
              ) : (
                checkoutItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`pb-3.5 flex items-center justify-between gap-3 ${
                      index !== checkoutItems.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[var(--color-text-dark)]">
                          {item.name}
                        </h4>
                        <p className="text-xs font-extrabold text-[var(--color-accent)] mt-0.5">
                          PKR {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-[var(--color-card-bg)] shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="px-2.5 py-1 text-xs font-bold hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-[var(--color-primary)]">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="px-2.5 py-1 text-xs font-bold hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Subtotal</span>
                <span className="font-semibold text-[var(--color-text-dark)]">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Delivery</span>
                <span className="font-semibold text-[var(--color-text-dark)]">
                  {checkoutItems.length === 0
                    ? "PKR 0"
                    : deliveryCharge === 0
                      ? "FREE"
                      : `PKR ${deliveryCharge}`}
                </span>
              </div>

              {onlineDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Online Payment Discount (5%)</span>
                  <span>- PKR {onlineDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-bold">
                <span>TOTAL</span>
                <span className="text-[var(--color-accent)]">
                  PKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isOrderMutationLoading || checkoutItems.length === 0}
              className="w-full !py-3.5 text-xs font-bold rounded-xl bg-[var(--color-accent)] text-white shadow-md cursor-pointer"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Lock size={14} />
                {isOrderMutationLoading
                  ? "PROCESSING..."
                  : `PLACE ORDER • PKR ${totalAmount.toLocaleString()}`}
              </span>
            </Button>

            <button
              type="button"
              onClick={handleWhatsApp}
              disabled={checkoutItems.length === 0}
              className="w-full py-3 text-xs font-bold rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-colors"
            >
              <WhatsAppIcon size={16} /> ORDER VIA WHATSAPP
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}