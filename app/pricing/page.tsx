import { getCurrentUser } from "@/lib/auth";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our service",
    features: [
      "Up to 3 projects",
      "Basic support",
      "1 GB storage",
      "Community access",
      "Basic analytics",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals and growing teams",
    features: [
      "Unlimited projects",
      "Priority support",
      "50 GB storage",
      "Advanced analytics",
      "Custom integrations",
      "API access",
      "Collaboration tools",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large organizations with specific needs",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Unlimited storage",
      "Custom contracts",
      "SLA guarantee",
      "Advanced security",
      "On-premise option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default async function PricingPage() {
  // Get auth details from your auth provider
  const user = await getCurrentUser();

  return (
    <div className="dark min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Always know what you&apos;ll
            pay.
          </p>
          {user && (
            <div className="mt-4 text-sm text-muted-foreground">
              Logged in as: {user.email}
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border ${
                plan.highlighted
                  ? "border-primary bg-card shadow-2xl scale-105"
                  : "border-border bg-card"
              } p-8 flex flex-col`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Can I change plans later?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we&apos;ll prorate any differences.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and wire transfers for
                Enterprise plans.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Is there a free trial?
              </h3>
              <p className="text-muted-foreground">
                Yes! The Pro plan comes with a 14-day free trial. No credit card
                required to start.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Have questions?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
