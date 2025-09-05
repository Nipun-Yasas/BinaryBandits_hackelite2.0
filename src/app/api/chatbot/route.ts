import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/app/lib/db";
import Analytics from "@/app/models/Analytics";
import UserActivity from "@/app/models/UserActivity";
import ChatSession from "@/app/models/ChatSession";
import { getSession } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  let message = "unknown"; // Default value
  try {
    await connectToDB();

    const body = await request.json();
    message = body.message || "unknown";
    const fileData = body.fileData;
    const session = await getSession();

    // Track the start time for response time calculation
    const startTime = Date.now();

    // Get or create user session
    const userId = session?.user?.id || "anonymous";
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create or update chat session
    let chatSession = await ChatSession.findOne({ userId, isActive: true });

    if (!chatSession) {
      chatSession = new ChatSession({
        userId,
        sessionId,
        startTime: new Date(),
        messageCount: 0,
        isActive: true,
      });
    }

    // Track user query
    const analyticsEntry = new Analytics({
      userId,
      sessionId: chatSession.sessionId,
      query: message,
      timestamp: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      fileUploaded: !!fileData,
      fileType: fileData ? "document" : null,
      fileSize: fileData ? fileData.length : 0,
    });

    await analyticsEntry.save();

    // Track user activity
    const userActivity = new UserActivity({
      userId,
      sessionId: chatSession.sessionId,
      action: "chat_message",
      details: {
        messageLength: message.length,
        hasFile: !!fileData,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    });

    await userActivity.save();

    // Update chat session
    chatSession.messageCount += 1;
    chatSession.lastActivity = new Date();
    await chatSession.save();

    // Simulate AI response (replace with actual AI integration)
    const responseTime = Date.now() - startTime;
    const aiResponse = generateAIResponse(message, fileData);

    // Track AI response
    const responseEntry = new Analytics({
      userId,
      sessionId: chatSession.sessionId,
      query: message,
      response: aiResponse,
      responseTime,
      success: true,
      timestamp: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      fileUploaded: !!fileData,
      fileType: fileData ? "document" : null,
      fileSize: fileData ? fileData.length : 0,
    });

    await responseEntry.save();

    return NextResponse.json({
      success: true,
      response: aiResponse,
      sessionId: chatSession.sessionId,
      responseTime,
    });
  } catch (error) {
    console.error("Chatbot API error:", error);

    // Track failed request
    try {
      const session = await getSession();
      const userId = session?.user?.id || "anonymous";

      const failedEntry = new Analytics({
        userId,
        query: message || "unknown",
        response: "Error occurred",
        responseTime: 0,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      });

      await failedEntry.save();
    } catch (trackingError) {
      console.error("Error tracking failed request:", trackingError);
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        response:
          "I apologize, but I'm experiencing technical difficulties. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Simple AI response generator (replace with actual AI integration)
function generateAIResponse(message: string, fileData?: string): string {
  const lowerMessage = message.toLowerCase();

  // Basic response patterns
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! I'm here to help you with your insurance claims. How can I assist you today?";
  }

  if (lowerMessage.includes("claim") || lowerMessage.includes("insurance")) {
    return "I'd be happy to help you with your insurance claim. Could you please provide more details about your situation or upload your claim documents?";
  }

  if (lowerMessage.includes("status") || lowerMessage.includes("update")) {
    return "To check the status of your claim, I'll need your claim number or policy details. Could you provide that information?";
  }

  if (fileData) {
    return "Thank you for uploading your document. I've received it and I'm analyzing the information. This may take a moment. In the meantime, is there anything specific you'd like me to focus on?";
  }

  // Default response
  return "Thank you for your message. I'm here to help with your insurance-related questions. Could you please provide more details about what you need assistance with?";
}
