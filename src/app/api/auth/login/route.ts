import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connectToDB from "@/app/lib/db";
import User from "@/app/models/User";
import { getSession } from "@/app/lib/auth";
import { debugLog, debugError } from "@/app/lib/debug";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    debugLog("Login attempt started");
    
    await connectToDB();
    const json = await req.json().catch(() => ({}));
    const parsed = LoginSchema.safeParse(json);
    
    if (!parsed.success) {
      debugError("Login validation failed", parsed.error.format());
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }
    
    const { email, password } = parsed.data;
    debugLog("Looking up user", { email });

    const user = await User.findOne({ email });
    if (!user || user.banned) {
      debugError("User not found or banned", { email, found: !!user, banned: user?.banned });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      debugError("Password mismatch", { email });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const session = await getSession();
    session.user = { 
      id: String(user._id), 
      email: user.email, 
      role: user.role as "user" | "admin", 
      name: user.name || undefined 
    };
    await session.save();
    
    debugLog("Login successful", { email, role: user.role });
    return NextResponse.json({ ok: true });
  } catch (error) {
    debugError("Login error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
