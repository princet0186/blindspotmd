import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/lib/models";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).lean();

    if (!consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }

    return NextResponse.json(consultation);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update consultation" },
      { status: 500 }
    );
  }
}
