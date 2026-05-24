import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export async function POST() {
  try {
    await connectDB();
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
