import { PricingTable } from "@/components/ui/pricing-table";
import { getCurrentUser } from "@/lib/auth";

export default async function PricingPage() {
  // Get auth details from your auth provider
  const user = await getCurrentUser();

  return (
    <div className="dark min-h-screen bg-background">
      <PricingTable
        lumenPublishableKey={process.env.NEXT_PUBLIC_LUMEN_PUBLISHABLE_KEY || ""}
        userId={user?.id} // Pass userId if user is logged in, undefined otherwise
        loginRedirectUrl="/login"
      />
    </div>
  );
}

