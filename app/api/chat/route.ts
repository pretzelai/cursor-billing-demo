import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai-responses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    const aiResponse = generateAIResponse(message, conversationHistory);

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
