import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { lumenNextHandler } from "@getlumen/server";

const handler = async (request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    await lumenNextHandler({
      request,
      userId: user.id,
    })
  );
};

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as OPTIONS,
  handler as HEAD,
};

