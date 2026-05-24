import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Referral } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const referrals = await Referral.find()
      .populate("patientId", "name mrn")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(referrals);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const referral = await Referral.create(body);
    return NextResponse.json(referral, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create referral" },
      { status: 500 }
    );
  }
}
