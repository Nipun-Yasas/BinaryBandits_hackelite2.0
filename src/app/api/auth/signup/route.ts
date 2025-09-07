import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connectToDB from "@/app/lib/db";
import User from "@/app/models/User";
import { getSession } from "@/app/lib/auth";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1, "Name is required"),
  // role removed
});

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const json = await req.json().catch(() => ({}));
    const parsed = SignupSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Role intentionally omitted so Mongoose default "user" applies
    const user = await User.create({
      email,
      passwordHash,
      name,
    });

    const session = await getSession();
    session.user = {
      id: String(user._id),
      email: user.email,
      role: user.role as "user" | "admin",
      name: user.name || undefined,
    };
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
