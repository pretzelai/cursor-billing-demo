import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai-responses";
import { getCurrentUser } from "@/lib/auth";
import { isFeatureEntitled, sendEvent } from "@getlumen/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 }
      );
    }

    // Check if user has access to ai-chat feature
    const hasAccess = await isFeatureEntitled({
      feature: "ai-chat",
      userId: user.id,
    });

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: "feature_limited",
          message:
            "You've reached your AI chat limit. Please upgrade your plan.",
          upgradeUrl: "/pricing",
        },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory } = body;

    const aiResponse = generateAIResponse(message, conversationHistory);

    // Record usage after successful completion
    await sendEvent({
      name: "ai-chat",
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 }
      );
    }

    console.error("[API] Chat error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
