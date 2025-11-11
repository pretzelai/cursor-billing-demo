import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionStatus } from "@getlumen/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 }
      );
    }

    const result = await getSubscriptionStatus({
      userId: user.id,
      apiKey: process.env.LUMEN_API_KEY,
    });

    if ("error" in result) {
      return NextResponse.json(
        { error: "subscription_error", message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriptionStatus: result,
    });
  } catch (error) {
    console.error("[API] Subscription status error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
