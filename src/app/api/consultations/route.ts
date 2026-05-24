import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/lib/models";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const consultation = await Consultation.create({
      patientId: body.patientId,
      doctorId: body.doctorId,
      vitals: body.vitals || { bp: "", hr: "", spo2: "", temp: "" },
      soapNotes: body.soapNotes || "",
      transcript: body.transcript || "",
      visitType: body.visitType || "CONSULTATION",
    });
    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create consultation" },
      { status: 500 }
    );
  }
}
