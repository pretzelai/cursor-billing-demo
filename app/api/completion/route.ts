import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/completions";
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

    // Check if user has access to tab-completions feature
    const hasAccess = await isFeatureEntitled({
      feature: "tab-completions",
      userId: user.id,
    });

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: "feature_limited",
          message:
            "You've reached your tab completions limit. Please upgrade your plan.",
          upgradeUrl: "/pricing",
        },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { code, cursorPosition } = body;

    const completion = generateCompletion(code, cursorPosition);

    // Record usage after successful completion
    await sendEvent({
      name: "tab-completions",
      userId: user.id,
      value: 500,
    });

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
