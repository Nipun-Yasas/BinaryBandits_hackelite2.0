import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connectToDB from "@/app/lib/db";
import User from "@/app/models/User";
import { getSession } from "@/app/lib/auth";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  await connectToDB();
  const json = await req.json().catch(() => ({}));
  const parsed = LoginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user || user.banned) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const session = await getSession();
  const role = (user.role === "admin" ? "admin" : "user") as "user" | "admin";
  session.user = { id: String(user._id), email: user.email, role };
  await session.save();
  return NextResponse.json({ ok: true });
}
