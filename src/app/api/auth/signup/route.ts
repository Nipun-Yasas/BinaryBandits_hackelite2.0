import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connectToDB from "@/app/lib/db";
import User from "@/app/models/User";
import { getSession } from "@/app/lib/auth";
import { debugLog, debugError } from "@/app/lib/debug";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["user", "admin"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    debugLog("Signup attempt started");
    
    await connectToDB();
    const json = await req.json().catch(() => ({}));
    const parsed = SignupSchema.safeParse(json);
    
    if (!parsed.success) {
      debugError("Signup validation failed", parsed.error.format());
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const { email, password, name, role: userRole } = parsed.data;
    debugLog("Creating user", { email, name, role: userRole });

    const exists = await User.findOne({ email });
    if (exists) {
      debugError("Email already exists", { email });
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Check if email domain indicates admin user
    const adminDomains = process.env.ADMIN_EMAIL_DOMAINS?.split(",") || [
      "@admin.com",
      "@hackelite.com",
    ];
    const isAdmin = adminDomains.some((domain) =>
      email.toLowerCase().endsWith(domain.trim().toLowerCase())
    );

    const user = await User.create({
      email,
      passwordHash,
      name,
      role: isAdmin ? "admin" : (userRole || "user"),
    });

    const session = await getSession();
    session.user = { 
      id: String(user._id), 
      email: user.email, 
      role: user.role as "user" | "admin", 
      name: user.name || undefined 
    };
    await session.save();

    debugLog("Signup successful", { email, role: user.role });
    return NextResponse.json({ ok: true });
  } catch (error) {
    debugError("Signup error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
