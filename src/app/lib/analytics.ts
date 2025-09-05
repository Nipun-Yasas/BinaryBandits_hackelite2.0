import connectToDB from "@/app/lib/db";
import Analytics from "@/app/models/Analytics";
import UserActivity from "@/app/models/UserActivity";
import SystemHealth from "@/app/models/SystemHealth";
import ChatSession from "@/app/models/ChatSession";

export interface AnalyticsSummary {
  totalQueries: number;
  successRate: number;
  averageResponseTime: number;
  totalTokens: number;
  activeUsers: number;
  totalUsers: number;
  adminUsers: number;
  bannedUsers: number;
}

export interface ChartData {
  date: string;
  queries: number;
  users: number;
  responseTime: number;
  successRate: number;
}

export interface SystemMetrics {
  memoryUsage: number;
  cpuUsage: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
  networkRequests: number;
  activeConnections: number;
}

export class AnalyticsService {
  static async getAnalyticsSummary(
    period: string = "30d"
  ): Promise<AnalyticsSummary> {
    await connectToDB();

    const startDate = this.getStartDate(period);
    const endDate = new Date();

    // Get total queries and success rate
    const totalQueries = await Analytics.countDocuments({
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const successfulQueries = await Analytics.countDocuments({
      timestamp: { $gte: startDate, $lte: endDate },
      success: true,
    });

    const successRate =
      totalQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0;

    // Get average response time
    const responseTimeData = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate },
          success: true,
          responseTime: { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          averageResponseTime: { $avg: "$responseTime" },
        },
      },
    ]);

    const averageResponseTime = responseTimeData[0]?.averageResponseTime || 0;

    // Get total tokens (simulated - would need actual token counting)
    const totalTokens =
      (await Analytics.countDocuments({
        timestamp: { $gte: startDate, $lte: endDate },
      })) * 100; // Rough estimate

    // Get user statistics
    const uniqueUsers = await Analytics.distinct("userId", {
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const activeUsers = uniqueUsers.length;

    // Get total users from User model (would need to import User model)
    const totalUsers = activeUsers; // Placeholder
    const adminUsers = 0; // Placeholder
    const bannedUsers = 0; // Placeholder

    return {
      totalQueries,
      successRate,
      averageResponseTime,
      totalTokens,
      activeUsers,
      totalUsers,
      adminUsers,
      bannedUsers,
    };
  }

  static async getChartData(period: string = "30d"): Promise<ChartData[]> {
    await connectToDB();

    const startDate = this.getStartDate(period);
    const endDate = new Date();

    const dailyStats = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          queries: { $sum: 1 },
          successfulQueries: {
            $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] },
          },
          totalResponseTime: {
            $sum: { $ifNull: ["$responseTime", 0] },
          },
          responseCount: {
            $sum: {
              $cond: [
                { $and: ["$responseTime", { $ne: ["$responseTime", null] }] },
                1,
                0,
              ],
            },
          },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          date: "$_id",
          queries: 1,
          successRate: {
            $cond: [
              { $eq: ["$queries", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$successfulQueries", "$queries"] },
                  100,
                ],
              },
            ],
          },
          responseTime: {
            $cond: [
              { $eq: ["$responseCount", 0] },
              0,
              { $divide: ["$totalResponseTime", "$responseCount"] },
            ],
          },
          users: { $size: "$uniqueUsers" },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return dailyStats.map((stat) => ({
      date: stat.date,
      queries: stat.queries,
      users: stat.users,
      responseTime: Math.round(stat.responseTime),
      successRate: Math.round(stat.successRate * 100) / 100,
    }));
  }

  static async getSystemMetrics(): Promise<SystemMetrics> {
    await connectToDB();

    // Get latest system health data for each metric type
    const metrics = await SystemHealth.aggregate([
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: "$metricType",
          latest: { $first: "$$ROOT" },
        },
      },
    ]);

    // Extract values from the aggregated results
    const metricMap = metrics.reduce(
      (acc, metric) => {
        acc[metric._id] = metric.latest.value;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      memoryUsage: metricMap.memory_usage || 0,
      cpuUsage: metricMap.cpu_usage || 0,
      responseTime: metricMap.response_time || 0,
      errorRate: metricMap.error_rate || 0,
      uptime: 99.9, // Default uptime
      networkRequests: metricMap.api_usage || 0,
      activeConnections: 0, // Not tracked in current model
    };
  }

  static async trackUserActivity(
    userId: string,
    action: string,
    details?: any,
    sessionId?: string
  ): Promise<void> {
    await connectToDB();

    const userActivity = new UserActivity({
      userId,
      sessionId,
      action,
      details,
      timestamp: new Date(),
    });

    await userActivity.save();
  }

  static async getUserActivity(
    userId: string,
    limit: number = 50
  ): Promise<any[]> {
    await connectToDB();

    return UserActivity.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
  }

  private static getStartDate(period: string): Date {
    const now = new Date();
    const periods = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };

    const days = periods[period as keyof typeof periods] || 30;
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);
    return startDate;
  }
}
