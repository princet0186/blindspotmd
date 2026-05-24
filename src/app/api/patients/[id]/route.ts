import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient, Consultation, BlindSpotFlag, LabResult } from "@/lib/models";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const patient = await Patient.findById(id).lean();
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const consultations = await Consultation.find({ patientId: id })
      .sort({ startedAt: -1 })
      .lean();

    const flags = await BlindSpotFlag.find({ patientId: id })
      .sort({ createdAt: -1 })
      .lean();

    const labResults = await LabResult.findOne({ patientId: id }).lean();

    return NextResponse.json({
      patient,
      consultations,
      flags,
      diagnostics: labResults?.diagnostics || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch patient" },
      { status: 500 }
    );
  }
}
