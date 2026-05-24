import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const patients = await Patient.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
