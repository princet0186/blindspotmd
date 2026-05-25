import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Doctor } from "@/lib/models";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password, action } = body;

    if (action === "signup") {
      const existing = await Doctor.findOne({ email }).lean();
      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }

      const doctor = await Doctor.create({
        name: body.name || "Dr. New User",
        email,
        credentials: body.credentials || "MD",
        clinicId: body.clinicId || "CL-0000",
        region: body.region || "General",
        pin: password,
        contact: email,
      });

      const response = NextResponse.json({
        doctorId: doctor._id,
        name: doctor.name,
        email: doctor.email,
        region: doctor.region,
      });

      response.cookies.set("doctorId", doctor._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    const doctor = await Doctor.findOne({ email }).lean();
    if (!doctor) {
      return NextResponse.json({ error: "No account found with this email." }, { status: 401 });
    }

    if (doctor.pin !== password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({
      doctorId: doctor._id,
      name: doctor.name,
      email: doctor.email,
      region: doctor.region,
    });

    response.cookies.set("doctorId", doctor._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 500 }
    );
  }
}
