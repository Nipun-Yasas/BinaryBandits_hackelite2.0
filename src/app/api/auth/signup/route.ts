import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connectToDB from "@/app/lib/db";
import User from "@/app/models/User";
import { getSession } from "@/app/lib/auth";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  await connectToDB();
  const json = await req.json().catch(() => ({}));
  const parsed = SignupSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
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
    role: isAdmin ? "admin" : "user",
  });

  const session = await getSession();
  const role = (user.role === "admin" ? "admin" : "user") as "user" | "admin";
  session.user = { id: String(user._id), email: user.email, role };
  await session.save();

  return NextResponse.json({ ok: true });
}
