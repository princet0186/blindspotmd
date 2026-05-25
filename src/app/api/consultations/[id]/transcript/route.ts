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

    const updateOps: Record<string, unknown> = {};

    if (body.newLines && body.newLines.length > 0) {
      updateOps.$push = {
        transcript: { $each: body.newLines },
      };
    }

    if (body.soapNotes !== undefined) {
      updateOps.$set = { soapNotes: body.soapNotes };
    }

    if (Object.keys(updateOps).length === 0) {
      return NextResponse.json({ message: "No updates provided" }, { status: 400 });
    }

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      updateOps,
      { new: true }
    ).lean();

    if (!consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Transcript saved",
      transcriptCount: consultation.transcript?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save transcript" },
      { status: 500 }
    );
  }
}
