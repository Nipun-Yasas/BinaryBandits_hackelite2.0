import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectToDB from "@/app/lib/db";
import Analytics from "@/app/models/Analytics";
import UserActivity from "@/app/models/UserActivity";
import ChatSession from "@/app/models/ChatSession";

const TrackQuerySchema = z.object({
  userId: z.string(),
  query: z.string().min(1),
  sessionId: z.string(),
  queryType: z.enum(["chat", "search", "resource"]).default("chat"),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      ipAddress: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const json = await req.json().catch(() => ({}));
    const parsed = TrackQuerySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { userId, query, sessionId, queryType, metadata } = parsed.data;

    // Create analytics entry
    const analyticsEntry = new Analytics({
      userId,
      query,
      sessionId,
      queryType,
      metadata: metadata || {},
    });

    await analyticsEntry.save();

    // Update or create chat session
    let chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      chatSession = new ChatSession({
        userId,
        sessionId,
        title: query.length > 50 ? query.substring(0, 50) + "..." : query,
        metadata: metadata || {},
      });
    }

    chatSession.messageCount += 1;
    chatSession.lastActivity = new Date();
    await chatSession.save();

    // Log user activity
    const activityEntry = new UserActivity({
      userId,
      action: "query",
      details: { query, sessionId, queryType },
      sessionId,
      success: true,
      ...(metadata && {
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      }),
    });

    await activityEntry.save();

    return NextResponse.json({
      success: true,
      analyticsId: analyticsEntry._id,
      sessionId: chatSession.sessionId,
    });
  } catch (error) {
    console.error("Error tracking query:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
