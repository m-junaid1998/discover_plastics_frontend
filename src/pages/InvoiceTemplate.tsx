import React from "react";
import { type OrderItem } from "../pages/admin/AdminOrders";

interface InvoiceProps {
  order: OrderItem;
}

export const InvoiceTemplate: React.FC<InvoiceProps> = ({ order }) => {
  const shippingPrice = order.shippingPrice || 0;
  const grandTotal = order.totalPrice || 0;
  const subtotal = order.itemsPrice || (grandTotal - shippingPrice);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fullAddress = [
    order.customerInfo?.address,
    order.customerInfo?.areaTown,
    order.customerInfo?.city,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      id={`invoice-${order._id}`}
      className="max-w-[800px] mx-auto bg-white p-10 font-sans text-gray-800 border border-gray-100 shadow-sm"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="flex justify-between items-start pb-6 border-b-2 border-black">
        <div>
          <h1 className="text-3xl font-black tracking-wider uppercase text-black font-serif">
            HOME N' MORE STUDIO
          </h1>
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-0.5">
            E-COMMERCE & HOME DECOR STUDIO
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            INVOICE
          </p>
          <h2 className="text-2xl font-black text-black tracking-tight">
            #{order.orderNumber}
          </h2>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 my-8 text-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-3.5 bg-black inline-block"></span>
            <h3 className="font-extrabold uppercase text-black tracking-wider">
              CUSTOMER DETAILS
            </h3>
          </div>
          <p className="text-gray-700">
            <strong className="text-black font-bold">Name:</strong>{" "}
            {order.customerInfo?.fullName || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong className="text-black font-bold">Phone:</strong>{" "}
            {order.customerInfo?.phone || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong className="text-black font-bold">Country:</strong>{" "}
            {order.customerInfo?.country || "N/A"}
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-black font-bold">Address:</strong>{" "}
            {fullAddress || "N/A"}
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-3.5 bg-black inline-block"></span>
            <h3 className="font-extrabold uppercase text-black tracking-wider">
              ORDER DETAILS
            </h3>
          </div>
          <p className="text-gray-700">
            <strong className="text-black font-bold">Payment:</strong> Cash on
            Delivery
          </p>
          <p className="text-gray-700 uppercase">
            <strong className="text-black font-bold">Status:</strong>{" "}
            <span className="font-extrabold text-black">{order.status}</span>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-600 border-t border-b border-black">
              <th className="py-2.5 px-3 font-extrabold">P:ID</th>
              <th className="py-2.5 px-3 font-extrabold">IMAGE</th>
              <th className="py-2.5 px-3 font-extrabold">PRODUCT NAME</th>
              <th className="py-2.5 px-3 font-extrabold text-center">QTY</th>
              <th className="py-2.5 px-3 font-extrabold text-right">PRICE</th>
              <th className="py-2.5 px-3 font-extrabold text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-b-2 border-black">
            {order.orderItems?.map((item, index) => {
              const itemTotal = item.qty * item.price;
              const pId = item.product
                ? `#${item.product.slice(-6).toUpperCase()}`
                : `#ITEM-${index + 1}`;

              return (
                <tr key={index} className="align-middle">
                  <td className="py-3 px-3 text-[11px] font-semibold text-gray-400 uppercase">
                    {pId}
                  </td>
                  <td className="py-3 px-3">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md border border-gray-100"
                    />
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-900 max-w-[220px]">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-gray-800">
                    {item.qty}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gray-800">
                    Rs {item.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-black">
                    Rs {itemTotal.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-8">
        <div className="w-72 border-2 border-black p-4 space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>SUBTOTAL</span>
            <span className="text-gray-900">
              Rs {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>SHIPPING</span>
            <span className="text-emerald-600 font-extrabold">
              {shippingPrice === 0
                ? "FREE"
                : `Rs ${shippingPrice.toLocaleString()}`}
            </span>
          </div>
          <div className="border-t border-dashed border-gray-300 pt-2 my-1"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-black uppercase text-black">
              GRAND TOTAL
            </span>
            <span className="text-lg font-black text-black">
              Rs {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-16 pt-6 border-t border-gray-100 text-center space-y-1">
        <p className="text-xs font-black tracking-widest text-black uppercase">
          THANK YOU FOR SHOPPING WITH HOME N' MORE STUDIO
        </p>
        <p className="text-[9px] text-gray-400 uppercase tracking-tight">
          This is a computer-generated official document and does not require a
          physical signature or stamp.
        </p>
      </div>
    </div>
  );
};