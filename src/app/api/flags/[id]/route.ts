import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlindSpotFlag } from "@/lib/models";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const flag = await BlindSpotFlag.findByIdAndUpdate(
      id,
      {
        $set: {
          status: body.status,
          dismissReason: body.dismissReason || "",
        },
      },
      { new: true }
    ).lean();

    if (!flag) {
      return NextResponse.json({ error: "Flag not found" }, { status: 404 });
    }

    return NextResponse.json(flag);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update flag" },
      { status: 500 }
    );
  }
}
