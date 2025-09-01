import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session.user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user: session.user });
}
