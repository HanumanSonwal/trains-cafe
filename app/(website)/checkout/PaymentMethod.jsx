"use client";

import { CheckCircleFilled, CreditCardOutlined, LockOutlined, WalletOutlined } from "@ant-design/icons";

// "RAZORPAY" / "COD" are the values place-order already understands.
const OPTIONS = [
  {
    value: "RAZORPAY",
    title: "Pay Online",
    note: "UPI, Cards, Net Banking & Wallets",
    badge: "Instant confirmation",
    icon: CreditCardOutlined,
  },
  {
    value: "COD",
    title: "Cash on Delivery",
    note: "Pay when your food arrives at your seat",
    icon: WalletOutlined,
  },
];

/** Two big tappable cards instead of a dropdown: the chosen one is clearly highlighted. */
export default function PaymentMethod({ value, onChange, onlineAvailable }) {
  const options = onlineAvailable ? OPTIONS : OPTIONS.filter((o) => o.value === "COD");

  return (
    <section className="mt-4 rounded-lg bg-white p-4 shadow" aria-labelledby="pay-h">
      {/* the site forces h1-h4 sizes with !important, so a heading role keeps this size */}
      <p id="pay-h" role="heading" aria-level={2} className="mb-3 text-xl font-bold">
        Payment Method
      </p>

      <div role="radiogroup" aria-labelledby="pay-h" className="grid gap-3">
        {options.map((o) => {
          const on = value === o.value;
          const Icon = o.icon;
          return (
            <label
              key={o.value}
              className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition active:scale-[0.99] ${
                on ? "border-[#D6872A] bg-[#faf3ea] shadow-sm" : "border-gray-200 bg-white hover:border-[#D6872A]/50"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={o.value}
                checked={on}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl ${
                  on ? "bg-[#D6872A] text-white" : "bg-gray-100 text-[#704D25]"
                }`}
              >
                <Icon />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-[15px] font-semibold text-gray-900">{o.title}</span>
                  {o.badge && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                      {o.badge}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs text-gray-500">{o.note}</span>
              </span>

              <span aria-hidden="true" className="shrink-0 text-xl">
                {on ? (
                  <CheckCircleFilled className="text-[#D6872A]" />
                ) : (
                  <span className="block h-5 w-5 rounded-full border-2 border-gray-300" />
                )}
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-[#D6872A] peer-focus-visible:ring-2" />
            </label>
          );
        })}
      </div>

      {value === "RAZORPAY" && onlineAvailable && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <LockOutlined /> Payments are secured by Razorpay. We never see your card or UPI details.
        </p>
      )}
    </section>
  );
}
