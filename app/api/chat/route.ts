import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai-responses";
// import { isFeatureEntitled, sendEvent } from "@/lib/lumen";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    // const hasAccess = await isFeatureEntitled(user.id, "ai-messages");
    // if (!hasAccess) {
    //   return NextResponse.json(
    //     {
    //       error: "feature_not_available",
    //       message: "Upgrade to access AI chat or you have reached your usage limit",
    //       upgradeUrl: "http://localhost:3000/pricing",
    //     },
    //     { status: 402 }
    //   );
    // }

    const body = await request.json();
    const { message, conversationHistory } = body;

    const aiResponse = generateAIResponse(message, conversationHistory);

    // await sendEvent(user.id, "ai-messages");

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
