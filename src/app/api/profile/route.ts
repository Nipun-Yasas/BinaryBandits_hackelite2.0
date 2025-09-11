import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../models/User";

type UpdatePayload = {
  name?: string;
  fullName?: string;
  bio?: string;
  school?: string;
  grade?: string;
};

export const runtime = "nodejs";

let isConnected = false;
async function connectToDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  await mongoose.connect(uri);
  isConnected = true;
}

function getUserId(req: NextRequest) {
  const raw = req.headers.get("x-user-id")?.trim();
  if (!raw || raw === "undefined" || raw === "null") return null;
  return raw;
}

function ensureValidObjectId(id: string | null) {
  if (!id) return { ok: false, status: 401 as const, message: "Unauthorized" };
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, status: 400 as const, message: "Invalid user id" };
  }
  return { ok: true as const };
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const valid = ensureValidObjectId(userId);
    if (!valid.ok) {
      return NextResponse.json({ error: valid.message }, { status: valid.status });
    }

    await connectToDB();

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const valid = ensureValidObjectId(userId);
    if (!valid.ok) {
      return NextResponse.json({ error: valid.message }, { status: valid.status });
    }

    const body = await req.json();

    // Allow only model fields
    const allowed = ["name", "fullName", "bio", "school", "grade"] as const;
    const update: UpdatePayload = {};
    for (const key of allowed) {
      const val = body[key];
      if (typeof val === "string") {
        update[key] = val;
      }
    }

    await connectToDB();

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}