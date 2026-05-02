import { useEffect, useState } from "react";
import { X, CreditCard, Building2, Landmark, Hash, Smartphone, Zap, CheckCircle2, Loader2 } from "lucide-react";
import crestUrl from "@/assets/cons-tambuwal-logo.png";

type Method = "zap" | "card" | "transfer" | "bank" | "ussd" | "opay";

interface Props {
  open: boolean;
  email: string;
  amountNGN: number; // whole naira
  reference?: string;
  description?: string;
  onClose: () => void;
  onSuccess: (ref: string) => void;
}

const methods: { key: Method; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
  { key: "zap", label: "Zap", icon: Zap, badge: "NEW" },
  { key: "card", label: "Card", icon: CreditCard },
  { key: "transfer", label: "Transfer", icon: Building2 },
  { key: "bank", label: "Bank", icon: Landmark },
  { key: "ussd", label: "USSD", icon: Hash },
  { key: "opay", label: "OPay", icon: Smartphone },
];

export function PaystackCheckoutModal({ open, email, amountNGN, reference, description, onClose, onSuccess }: Props) {
  const [method, setMethod] = useState<Method>("zap");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", pin: "" });

  useEffect(() => {
    if (open) {
      setMethod("zap");
      setProcessing(false);
      setDone(false);
      setCard({ number: "", expiry: "", cvv: "", pin: "" });
    }
  }, [open]);

  if (!open) return null;

  const ref = reference || `cons_${Date.now().toString(36)}`;
  const amountStr = `NGN ${amountNGN.toLocaleString()}`;

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(() => {
        onSuccess(ref);
      }, 900);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full hover:bg-black/5 flex items-center justify-center text-gray-500"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <aside className="bg-gray-50 border-r border-gray-200 p-5 hidden sm:block">
            <p className="text-[11px] font-bold tracking-widest text-gray-500 mb-4">PAY WITH</p>
            <ul className="space-y-1">
              {methods.map((m) => {
                const Icon = m.icon;
                const active = method === m.key;
                return (
                  <li key={m.key}>
                    <button
                      onClick={() => setMethod(m.key)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm font-medium transition ${
                        active ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {m.badge && (
                        <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">
                          {m.badge}
                        </span>
                      )}
                      <Icon className="h-4 w-4" />
                      <span>{m.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Main */}
          <div className="p-6 sm:p-8 min-h-[460px] flex flex-col">
            <header className="flex items-start justify-between mb-6">
              <img src={crestUrl} alt="" className="h-10 w-10 object-contain" />
              <div className="text-right">
                <p className="text-xs text-gray-600 truncate max-w-[220px]">{email}</p>
                <p className="text-sm text-gray-700">
                  Pay <span className="font-bold text-emerald-600">{amountStr}</span>
                </p>
              </div>
            </header>

            {/* Mobile method selector */}
            <div className="sm:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-2 px-2">
              {methods.map((m) => {
                const Icon = m.icon;
                const active = method === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      active ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {m.label}
                  </button>
                );
              })}
            </div>

            {description && <p className="text-xs text-gray-500 mb-4">{description}</p>}

            <div className="flex-1">
              {done ? (
                <SuccessView amount={amountStr} reference={ref} />
              ) : processing ? (
                <ProcessingView method={method} />
              ) : (
                <MethodView method={method} card={card} setCard={setCard} />
              )}
            </div>

            {!done && !processing && (
              <button
                onClick={handleConfirm}
                className="w-full mt-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition"
              >
                {method === "zap" || method === "transfer" ? "I've completed the payment" : `Pay ${amountStr}`}
              </button>
            )}

            <footer className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
              <span>🔒 Secured by</span>
              <span className="font-bold text-gray-700">paystack</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodView({ method, card, setCard }: { method: Method; card: { number: string; expiry: string; cvv: string; pin: string }; setCard: (c: typeof card) => void }) {
  if (method === "zap") {
    return (
      <div className="text-center">
        <div className="mx-auto w-44 h-44 bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-center">
          <FakeQR />
        </div>
        <p className="mt-4 text-sm text-gray-700 max-w-xs mx-auto">
          Scan the QR code to open Zap and complete this payment
        </p>
      </div>
    );
  }
  if (method === "card") {
    return (
      <div className="space-y-3 max-w-md">
        <Field label="Card number" value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="0000 0000 0000 0000" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry" value={card.expiry} onChange={(v) => setCard({ ...card, expiry: v })} placeholder="MM/YY" />
          <Field label="CVV" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v })} placeholder="123" />
        </div>
        <Field label="PIN" value={card.pin} onChange={(v) => setCard({ ...card, pin: v })} placeholder="••••" type="password" />
      </div>
    );
  }
  if (method === "transfer") {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 max-w-md">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Transfer to</p>
        <Row k="Bank" v="Wema Bank" />
        <Row k="Account number" v="7842910356" />
        <Row k="Account name" v="Paystack-CONS Tambuwal" />
        <Row k="Amount" v="(see top right)" />
        <p className="mt-4 text-[11px] text-gray-500">Transfer the exact amount, then click "I've completed the payment".</p>
      </div>
    );
  }
  if (method === "bank") {
    return (
      <div className="space-y-3 max-w-md">
        <Field label="Select your bank" value="" onChange={() => {}} placeholder="Choose bank" />
        <Field label="Account number" value="" onChange={() => {}} placeholder="0000000000" />
      </div>
    );
  }
  if (method === "ussd") {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 max-w-md">
        <p className="text-sm text-gray-700">Dial the USSD code below on your phone:</p>
        <p className="font-mono text-2xl font-bold text-emerald-700 mt-3">*737*000*1234#</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 max-w-md">
      <p className="text-sm text-gray-700">You will be redirected to OPay to complete this payment.</p>
    </div>
  );
}

function ProcessingView({ method }: { method: Method }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
      <p className="mt-4 text-sm text-gray-700">Processing your {method} payment...</p>
      <p className="text-xs text-gray-500">Please don't close this window</p>
    </div>
  );
}

function SuccessView({ amount, reference }: { amount: string; reference: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
      </div>
      <p className="mt-4 font-bold text-gray-800">Payment successful</p>
      <p className="text-sm text-gray-600 mt-1">{amount}</p>
      <p className="text-[11px] text-gray-400 mt-2 font-mono">REF: {reference}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-gray-800"
      />
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-200 last:border-0 text-sm">
      <span className="text-gray-500">{k}</span>
      <span className="font-semibold text-gray-800">{v}</span>
    </div>
  );
}

function FakeQR() {
  // simple decorative QR-like grid
  const cells = Array.from({ length: 21 * 21 });
  return (
    <div className="grid grid-cols-21 gap-px bg-white" style={{ gridTemplateColumns: "repeat(21, minmax(0, 1fr))" }}>
      {cells.map((_, i) => {
        const row = Math.floor(i / 21);
        const col = i % 21;
        const isFinder =
          (row < 7 && col < 7) ||
          (row < 7 && col > 13) ||
          (row > 13 && col < 7);
        const isFinderInner =
          (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
          (row >= 2 && row <= 4 && col >= 16 && col <= 18) ||
          (row >= 16 && row <= 18 && col >= 2 && col <= 4);
        const filled = isFinder ? !((row === 0 || row === 6 || col === 0 || col === 6) === false) : false;
        const finderBorder = isFinder && (row === 0 || row === 6 || col === 0 || col === 6 || (row > 13 ? row === 14 || row === 20 : false) || (col > 13 ? col === 14 || col === 20 : false));
        const random = ((row * 31 + col * 17) % 5) < 2;
        const show = isFinderInner || finderBorder || (!isFinder && random);
        return <div key={i} className={`aspect-square ${show ? "bg-black" : "bg-white"}`} />;
      })}
    </div>
  );
}
