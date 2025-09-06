import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/app/lib/analytics";
import connectToDB from "@/app/lib/db";
import Analytics from "@/app/models/Analytics";
import User from "@/app/models/User";
import UserActivity from "@/app/models/UserActivity";
import ChatSession from "@/app/models/ChatSession";
import SystemHealth from "@/app/models/SystemHealth";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d";

    // Get analytics summary using the service
    const analyticsSummary = await AnalyticsService.getAnalyticsSummary(period);

    // Get chart data
    const chartData = await AnalyticsService.getChartData(period);

    // Get system metrics
    const systemMetrics = await AnalyticsService.getSystemMetrics();

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    "$lastLogin",
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
          },
          bannedUsers: {
            $sum: { $cond: ["$banned", 1, 0] },
          },
        },
      },
    ]);

    const userData = userStats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      bannedUsers: 0,
    };

    // Get query types distribution
    const queryTypes = await Analytics.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(
              Date.now() - getPeriodDays(period) * 24 * 60 * 60 * 1000
            ),
          },
        },
      },
      {
        $group: {
          _id: "$queryType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get top users
    const topUsers = await Analytics.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(
              Date.now() - getPeriodDays(period) * 24 * 60 * 60 * 1000
            ),
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          queryCount: { $sum: 1 },
          successfulQueries: { $sum: { $cond: ["$success", 1, 0] } },
          averageResponseTime: { $avg: "$responseTime" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          userId: "$_id",
          name: { $ifNull: ["$userInfo.name", "Anonymous"] },
          email: { $ifNull: ["$userInfo.email", "N/A"] },
          role: { $ifNull: ["$userInfo.role", "user"] },
          queryCount: 1,
          successRate: {
            $multiply: [
              { $divide: ["$successfulQueries", "$queryCount"] },
              100,
            ],
          },
          averageResponseTime: 1,
        },
      },
      {
        $sort: { queryCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get system health status
    const systemHealth = await SystemHealth.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
        },
      },
      {
        $group: {
          _id: null,
          healthy: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$cpuUsage", 80] },
                    { $lt: ["$memoryUsage", 85] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          warning: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $gte: ["$cpuUsage", 80] },
                    { $gte: ["$memoryUsage", 85] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          critical: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $gte: ["$cpuUsage", 95] },
                    { $gte: ["$memoryUsage", 95] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const healthData = systemHealth[0] || {
      healthy: 0,
      warning: 0,
      critical: 0,
    };

    const response = {
      period,
      systemStatus:
        healthData.critical > 0
          ? "critical"
          : healthData.warning > 0
            ? "warning"
            : "healthy",
      overview: {
        totalQueries: analyticsSummary.totalQueries,
        successRate: analyticsSummary.successRate,
        averageResponseTime: analyticsSummary.averageResponseTime,
        totalTokens: analyticsSummary.totalTokens,
        totalUsers: userData.totalUsers,
        activeUsers: analyticsSummary.activeUsers,
        adminUsers: userData.adminUsers,
        bannedUsers: userData.bannedUsers,
      },
      trends: {
        dailyActivity: chartData.map((item) => ({
          date: item.date,
          queries: item.queries,
          uniqueUsers: item.users,
          successful: Math.round((item.queries * item.successRate) / 100),
          failed: Math.round((item.queries * (100 - item.successRate)) / 100),
        })),
        queryTypes: queryTypes.map((type) => ({
          _id: type._id || "unknown",
          count: type.count,
        })),
      },
      topUsers,
      systemHealth: healthData,
      systemMetrics,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Admin stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getPeriodDays(period: string): number {
  const periodMap = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  return periodMap[period as keyof typeof periodMap] || 30;
}
