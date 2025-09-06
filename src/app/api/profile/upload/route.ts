import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getSession } from "../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const filename = `profile_${session.user.id}_${timestamp}.${fileExtension}`;

    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), "public", "uploads", "profiles");
    const filepath = join(uploadDir, filename);

    try {
      // Create directory if it doesn't exist
      await mkdir(uploadDir, { recursive: true });
      await writeFile(filepath, buffer);
    } catch (error) {
      console.error("File write error:", error);
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
    }

    const fileUrl = `/uploads/profiles/${filename}`;

    return NextResponse.json({
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
