import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/app/lib/db";
import Analytics from "@/app/models/Analytics";
import UserActivity from "@/app/models/UserActivity";
import ChatSession from "@/app/models/ChatSession";
import User from "@/app/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    const periodMap = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
    };
    const days = periodMap[period as keyof typeof periodMap] || 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Get user info
    const user = await User.findById(userId).select(
      "name email role createdAt"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Query statistics
    const queryStats = await Analytics.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalQueries: { $sum: 1 },
          successfulQueries: { $sum: { $cond: ["$success", 1, 0] } },
          failedQueries: { $sum: { $cond: ["$success", 0, 1] } },
          averageResponseTime: { $avg: "$responseTime" },
          totalTokens: { $sum: "$tokensUsed" },
          queriesByType: {
            $push: "$queryType",
          },
        },
      },
    ]);

    // Activity statistics
    const activityStats = await UserActivity.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
          lastActivity: { $max: "$createdAt" },
        },
      },
    ]);

    // Session statistics
    const sessionStats = await ChatSession.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          activeSessions: { $sum: { $cond: ["$isActive", 1, 0] } },
          totalMessages: { $sum: "$messageCount" },
          averageSessionLength: { $avg: "$messageCount" },
        },
      },
    ]);

    // Daily activity trend
    const dailyActivity = await Analytics.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          queries: { $sum: 1 },
          successful: { $sum: { $cond: ["$success", 1, 0] } },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const stats = queryStats[0] || {
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      averageResponseTime: 0,
      totalTokens: 0,
      queriesByType: [],
    };

    const sessionData = sessionStats[0] || {
      totalSessions: 0,
      activeSessions: 0,
      totalMessages: 0,
      averageSessionLength: 0,
    };

    // Calculate success rate
    const successRate =
      stats.totalQueries > 0
        ? (stats.successfulQueries / stats.totalQueries) * 100
        : 0;

    // Count queries by type
    const queryTypeCount = stats.queriesByType.reduce(
      (acc: Record<string, number>, type: string) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
      },
      period,
      summary: {
        totalQueries: stats.totalQueries,
        successfulQueries: stats.successfulQueries,
        failedQueries: stats.failedQueries,
        successRate: Math.round(successRate * 100) / 100,
        averageResponseTime: Math.round(stats.averageResponseTime || 0),
        totalTokens: stats.totalTokens || 0,
        totalSessions: sessionData.totalSessions,
        activeSessions: sessionData.activeSessions,
        totalMessages: sessionData.totalMessages,
        averageSessionLength: Math.round(sessionData.averageSessionLength || 0),
      },
      activityBreakdown: activityStats,
      queryTypes: queryTypeCount,
      dailyActivity,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
