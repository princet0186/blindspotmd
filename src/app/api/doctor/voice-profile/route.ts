import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Doctor } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const doctor = await Doctor.findOne().lean();
    if (!doctor) {
      return NextResponse.json({ error: "No doctor found" }, { status: 404 });
    }
    return NextResponse.json({
      voiceProfile: doctor.voiceProfile || null,
      doctorId: doctor._id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch voice profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { avgPitch, avgEnergy, spectralCentroid } = body;

    const doctor = await Doctor.findOneAndUpdate(
      {},
      {
        $set: {
          voiceProfile: {
            avgPitch,
            avgEnergy,
            spectralCentroid,
            enrolledAt: new Date(),
          },
        },
      },
      { new: true }
    ).lean();

    if (!doctor) {
      return NextResponse.json({ error: "No doctor found. Seed the database first." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Voice profile saved",
      voiceProfile: doctor.voiceProfile,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save voice profile" },
      { status: 500 }
    );
  }
}
