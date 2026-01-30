import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { billing } from "@/lib/billing";
import billingConfig from "@/billing.config";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 }
      );
    }

    // Get current credit balances
    const balances = await billing.credits.getAllBalances({
      userId: user.id,
    });

    // Get subscription to determine plan and allocation
    const subscription = await billing.subscriptions.get({
      userId: user.id,
    });

    // Get the plan's features to find allocation amounts
    const plans = billingConfig.test?.plans || [];
    const currentPlan = plans.find(
      (plan) => plan.name === subscription?.plan?.name
    ) || plans.find((plan) => plan.name === "Free");

    const features = currentPlan?.features || {};

    // Build response with balance and allocation for each feature
    const credits: Record<
      string,
      { balance: number; allocation: number; displayName: string }
    > = {};

    for (const [key, feature] of Object.entries(features)) {
      if (feature.credits?.allocation) {
        credits[key] = {
          balance: balances[key] || 0,
          allocation: feature.credits.allocation,
          displayName: feature.displayName || key,
        };
      }
    }

    return NextResponse.json({
      credits,
      planName: subscription?.plan?.name || "Free",
    });
  } catch (error: unknown) {
    console.error("[API] Credits error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
