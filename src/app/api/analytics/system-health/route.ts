import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/app/lib/db";
import SystemHealth from "@/app/models/SystemHealth";
import Analytics from "@/app/models/Analytics";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "24h"; // 1h, 24h, 7d, 30d

    // Calculate date range
    const now = new Date();
    const periodMap = {
      "1h": 1 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    const timeRange =
      periodMap[period as keyof typeof periodMap] || 24 * 60 * 60 * 1000;
    const startDate = new Date(now.getTime() - timeRange);

    // Get API usage metrics
    const apiUsage = await SystemHealth.aggregate([
      {
        $match: {
          metricType: "api_usage",
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period.includes("h") ? "%Y-%m-%d %H:00" : "%Y-%m-%d",
              date: "$timestamp",
            },
          },
          totalRequests: { $sum: "$value" },
          service: { $first: "$service" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get error rate metrics
    const errorRate = await SystemHealth.aggregate([
      {
        $match: {
          metricType: "error_rate",
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period.includes("h") ? "%Y-%m-%d %H:00" : "%Y-%m-%d",
              date: "$timestamp",
            },
          },
          totalErrors: { $sum: "$value" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get response time metrics
    const responseTimeMetrics = await SystemHealth.aggregate([
      {
        $match: {
          metricType: "response_time",
          timestamp: { $gte: startDate },
        },
      },
      {
        $sort: { value: 1 },
      },
      {
        $group: {
          _id: null,
          values: { $push: "$value" },
          averageResponseTime: { $avg: "$value" },
          minResponseTime: { $min: "$value" },
          maxResponseTime: { $max: "$value" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get overall system status
    const systemStatus = await SystemHealth.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent analytics summary
    const analyticsSummary = await Analytics.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalQueries: { $sum: 1 },
          successfulQueries: { $sum: { $cond: ["$success", 1, 0] } },
          averageResponseTime: { $avg: "$responseTime" },
          totalTokens: { $sum: "$tokensUsed" },
        },
      },
    ]);

    const responseTimeData = responseTimeMetrics[0] || {
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      values: [],
      count: 0,
    };

    // Calculate 95th percentile manually
    let p95ResponseTime = 0;
    if (responseTimeData.values && responseTimeData.values.length > 0) {
      const sortedValues = responseTimeData.values.sort(
        (a: number, b: number) => a - b
      );
      const p95Index = Math.floor(sortedValues.length * 0.95);
      p95ResponseTime = sortedValues[p95Index] || 0;
    }

    const analyticsData = analyticsSummary[0] || {
      totalQueries: 0,
      successfulQueries: 0,
      averageResponseTime: 0,
      totalTokens: 0,
    };

    // Calculate success rate
    const successRate =
      analyticsData.totalQueries > 0
        ? (analyticsData.successfulQueries / analyticsData.totalQueries) * 100
        : 0;

    // Determine overall system health
    const statusCounts = systemStatus.reduce(
      (acc: Record<string, number>, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {}
    );

    const totalStatusChecks = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    const criticalCount = statusCounts.critical || 0;
    const warningCount = statusCounts.warning || 0;

    let overallStatus = "healthy";
    if (criticalCount > totalStatusChecks * 0.1) {
      overallStatus = "critical";
    } else if (warningCount > totalStatusChecks * 0.2) {
      overallStatus = "warning";
    }

    return NextResponse.json({
      period,
      overallStatus,
      summary: {
        totalQueries: analyticsData.totalQueries,
        successRate: Math.round(successRate * 100) / 100,
        averageResponseTime: Math.round(analyticsData.averageResponseTime || 0),
        totalTokens: analyticsData.totalTokens || 0,
      },
      performance: {
        averageResponseTime: Math.round(responseTimeData.averageResponseTime),
        minResponseTime: responseTimeData.minResponseTime,
        maxResponseTime: responseTimeData.maxResponseTime,
        p95ResponseTime: Math.round(p95ResponseTime),
      },
      trends: {
        apiUsage,
        errorRate,
      },
      status: {
        healthy: statusCounts.healthy || 0,
        warning: statusCounts.warning || 0,
        critical: statusCounts.critical || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching system health:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
