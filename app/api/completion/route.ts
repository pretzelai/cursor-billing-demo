import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/completions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cursorPosition } = body;

    const completion = generateCompletion(code, cursorPosition);

    return NextResponse.json({
      success: true,
      completion,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 }
      );
    }

    console.error("[API] Completion error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
