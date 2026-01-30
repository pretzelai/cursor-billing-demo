import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/completions";
import { getCurrentUser } from "@/lib/auth";
import { billing } from "@/lib/billing";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 },
      );
    }

    // stripe-no-webhooks credits check
    const hasCredits = await billing.credits.hasCredits({
      userId: user.id,
      key: "tab-completions",
      amount: 1,
    });

    if (!hasCredits) {
      return NextResponse.json(
        {
          error: "feature_limited",
          message:
            "You've reached your tab completions limit. Please upgrade your plan.",
          upgradeUrl: "/pricing",
        },
        { status: 402 },
      );
    }

    const body = await request.json();
    const { code, cursorPosition } = body;

    const completion = generateCompletion(code, cursorPosition);

    // stripe-no-webhooks credits consumption
    await billing.credits.consume({
      userId: user.id,
      key: "tab-completions",
      amount: 1,
    });

    return NextResponse.json({
      success: true,
      completion,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 },
      );
    }

    console.error("[API] Completion error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
