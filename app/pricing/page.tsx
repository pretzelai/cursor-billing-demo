import { getCurrentUser } from "@/lib/auth";

export default async function PricingPage() {
  // Get auth details from your auth provider
  const user = await getCurrentUser();

  return (
    <div className="dark min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold">Pricing Table</h1>
    </div>
  );
}
