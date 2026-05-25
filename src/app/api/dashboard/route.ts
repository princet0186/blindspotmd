import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient, Consultation, BlindSpotFlag, Referral } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();

    const [patients, consultations, flags, referrals, recentPatients] = await Promise.all([
      Patient.countDocuments(),
      Consultation.countDocuments(),
      BlindSpotFlag.countDocuments(),
      Referral.countDocuments(),
      Patient.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      patients,
      consultations,
      flags,
      referrals,
      recentPatients: recentPatients.map((p) => ({
        _id: p._id,
        name: p.name,
        status: p.status,
        mrn: p.mrn,
      })),
    });
  } catch {
    return NextResponse.json({ patients: 0, consultations: 0, flags: 0, referrals: 0, recentPatients: [] });
  }
}
