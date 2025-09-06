import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectToDB from "@/app/lib/db";
import Analytics from "@/app/models/Analytics";
import ChatSession from "@/app/models/ChatSession";
import SystemHealth from "@/app/models/SystemHealth";

const TrackResponseSchema = z.object({
  analyticsId: z.string(),
  response: z.string(),
  responseTime: z.number().min(0),
  success: z.boolean().default(true),
  errorMessage: z.string().optional(),
  tokensUsed: z.number().optional(),
  aiModel: z.string().default("gemini"),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const json = await req.json().catch(() => ({}));
    const parsed = TrackResponseSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      analyticsId,
      response,
      responseTime,
      success,
      errorMessage,
      tokensUsed,
      aiModel,
    } = parsed.data;

    // Update analytics entry
    const analyticsEntry = await Analytics.findById(analyticsId);
    if (!analyticsEntry) {
      return NextResponse.json(
        { error: "Analytics entry not found" },
        { status: 404 }
      );
    }

    analyticsEntry.response = response;
    analyticsEntry.responseTime = responseTime;
    analyticsEntry.success = success;
    analyticsEntry.errorMessage = errorMessage;
    analyticsEntry.tokensUsed = tokensUsed;
    analyticsEntry.aiModel = aiModel;

    await analyticsEntry.save();

    // Update chat session metrics
    const chatSession = await ChatSession.findOne({
      sessionId: analyticsEntry.sessionId,
    });
    if (chatSession) {
      chatSession.totalTokens += tokensUsed || 0;
      chatSession.totalResponseTime += responseTime;
      chatSession.averageResponseTime =
        chatSession.totalResponseTime / chatSession.messageCount;
      chatSession.lastActivity = new Date();
      await chatSession.save();
    }

    // Log system health metrics
    const systemHealthEntry = new SystemHealth({
      metricType: success ? "api_usage" : "error_rate",
      value: success ? 1 : 0,
      unit: "count",
      service: aiModel,
      status: success ? "healthy" : "critical",
      metadata: {
        responseTime,
        tokensUsed: tokensUsed || 0,
        success,
      },
    });

    await systemHealthEntry.save();

    // Log response time as separate metric
    if (responseTime > 0) {
      const responseTimeEntry = new SystemHealth({
        metricType: "response_time",
        value: responseTime,
        unit: "ms",
        service: aiModel,
        status: responseTime > 10000 ? "warning" : "healthy",
        metadata: {
          averageResponseTime: responseTime,
        },
      });

      await responseTimeEntry.save();
    }

    return NextResponse.json({
      success: true,
      analyticsId: analyticsEntry._id,
      metrics: {
        responseTime,
        tokensUsed,
        success,
      },
    });
  } catch (error) {
    console.error("Error tracking response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
