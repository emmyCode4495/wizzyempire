import { Truck, RotateCcw, Leaf, ShieldCheck } from "lucide-react";

const features = [
  { icon: Truck, title: "Free shipping", detail: "On orders over ₦150,000" },
  { icon: RotateCcw, title: "30-day returns", detail: "No questions asked" },
  { icon: Leaf, title: "Responsible materials", detail: "Traceable fibers" },
  { icon: ShieldCheck, title: "Secure checkout", detail: "Encrypted payments" },
];

export function FeatureStrip() {
  return (
    <section className="border-y border-ink/10 bg-paper-100">
      <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <f.icon className="h-6 w-6 shrink-0 text-ink-600" strokeWidth={1.25} />
            <div>
              <p className="text-sm font-medium">{f.title}</p>
              <p className="text-xs text-ink-400">{f.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}