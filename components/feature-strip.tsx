import { Sparkles, Shirt, HeartHandshake, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: Shirt,
    title: "Quality materials",
    detail: "Premium fabrics chosen to last season after season",
  },
  {
    icon: Sparkles,
    title: "Curated styles",
    detail: "Every piece selected for fit, finish, and everyday wear",
  },
  {
    icon: HeartHandshake,
    title: "Personal service",
    detail: "Order via WhatsApp — we guide you through every step",
  },
  {
    icon: BadgeCheck,
    title: "Excellent experience",
    detail: "Smooth shopping from browse to delivery, every time",
  },
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