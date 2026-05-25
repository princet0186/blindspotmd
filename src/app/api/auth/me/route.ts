import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Doctor } from "@/lib/models";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/doctorId=([^;]+)/);
    if (!match) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await connectDB();
    const doctor = await Doctor.findById(match[1]).lean();
    if (!doctor) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      doctorId: doctor._id,
      name: doctor.name,
      email: doctor.email || doctor.contact,
      region: doctor.region,
      credentials: doctor.credentials,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
