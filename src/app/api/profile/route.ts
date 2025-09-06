import { NextRequest, NextResponse } from "next/server";
import User from "../../models/User";
import { connectToDB } from "../../lib/db";
import { getSession } from "../../lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDB();

    const user = await User.findById(session.user.id).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      fullName: user.fullName || user.name,
      profilePicture: user.profilePicture || user.avatarUrl,
      school: user.school || "",
      grade: user.grade || "Grade 10",
      bio: user.bio || "",
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, school, grade, bio, profilePicture } = body;

    // Validation
    const errors: Record<string, string> = {};
    
    if (!fullName?.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (!school?.trim()) {
      errors.school = "School/Institution is required";
    }
    
    if (!grade) {
      errors.grade = "Grade/Year is required";
    }

    if (bio && bio.length > 500) {
      errors.bio = "Bio must be less than 500 characters";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    await connectToDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        fullName: fullName.trim(),
        name: fullName.trim(), // Update both fullName and name for compatibility
        school: school.trim(),
        grade,
        bio: bio?.trim() || "",
        ...(profilePicture && { profilePicture }),
      },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        fullName: updatedUser.fullName,
        profilePicture: updatedUser.profilePicture || updatedUser.avatarUrl,
        school: updatedUser.school,
        grade: updatedUser.grade,
        bio: updatedUser.bio,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
