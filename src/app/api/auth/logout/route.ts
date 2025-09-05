import { NextResponse } from "next/server";
import { destroySession } from "@/app/lib/auth";

export async function POST() {
  await destroySession();
  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
