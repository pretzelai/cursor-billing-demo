import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai-responses";
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
      key: "ai-chat",
      amount: 1,
    });

    if (!hasCredits) {
      return NextResponse.json(
        {
          error: "feature_limited",
          message:
            "You've reached your AI chat limit. Please upgrade your plan.",
          upgradeUrl: "/pricing",
        },
        { status: 402 },
      );
    }

    const body = await request.json();
    const { message, conversationHistory } = body;

    const aiResponse = generateAIResponse(message, conversationHistory);

    // stripe-no-webhooks credits consumption
    await billing.credits.consume({
      userId: user.id,
      key: "ai-chat",
      amount: 1,
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 },
      );
    }

    console.error("[API] Chat error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
