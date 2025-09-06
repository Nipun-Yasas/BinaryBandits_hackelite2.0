"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Token as TokenIcon,
} from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "primary",
}: StatCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                backgroundColor: `${color}.light`,
                borderRadius: 2,
                p: 1,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: `${color}.main`,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="h6" color={`${color}.main`}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
            </Box>
          </Box>
          {trend && (
            <Box display="flex" alignItems="center">
              {trend.isPositive ? (
                <TrendingUpIcon sx={{ color: "success.main", mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ color: "error.main", mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                color={trend.isPositive ? "success.main" : "error.main"}
              >
                {Math.abs(trend.value)}%
              </Typography>
            </Box>
          )}
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    totalQueries: number;
    successRate: number;
    averageResponseTime: number;
    totalTokens: number;
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    bannedUsers: number;
  };
  trends?: {
    queries: number;
    users: number;
    responseTime: number;
  };
}

export function DashboardStats({ stats, trends }: DashboardStatsProps) {
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={3}>
      <Box flex="1 1 250px">
        <StatCard
          title="Total Queries"
          value={stats.totalQueries.toLocaleString()}
          subtitle="All time queries"
          icon={<AnalyticsIcon />}
          trend={
            trends?.queries
              ? calculateTrend(stats.totalQueries, trends.queries)
              : undefined
          }
          color="primary"
        />
      </Box>

      <Box flex="1 1 250px">
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          subtitle="Query success rate"
          icon={<CheckCircleIcon />}
          color="success"
        />
      </Box>

      <Box flex="1 1 250px">
        <StatCard
          title="Avg Response Time"
          value={`${stats.averageResponseTime}ms`}
          subtitle="Average response time"
          icon={<TimerIcon />}
          trend={
            trends?.responseTime
              ? calculateTrend(stats.averageResponseTime, trends.responseTime)
              : undefined
          }
          color="warning"
        />
      </Box>

      <Box flex="1 1 250px">
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          subtitle={`${stats.totalUsers} total users`}
          icon={<PeopleIcon />}
          trend={
            trends?.users
              ? calculateTrend(stats.activeUsers, trends.users)
              : undefined
          }
          color="info"
        />
      </Box>

      <Box flex="1 1 250px">
        <StatCard
          title="Total Tokens"
          value={stats.totalTokens.toLocaleString()}
          subtitle="AI tokens used"
          icon={<TokenIcon />}
          color="secondary"
        />
      </Box>

      <Box flex="1 1 250px">
        <StatCard
          title="Admin Users"
          value={stats.adminUsers}
          subtitle="System administrators"
          icon={<PeopleIcon />}
          color="primary"
        />
      </Box>

      <Box flex="1 1 250px">
        <StatCard
          title="Banned Users"
          value={stats.bannedUsers}
          subtitle="Currently banned"
          icon={<ErrorIcon />}
          color="error"
        />
      </Box>

      <Box flex="1 1 250px">
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              User Activity
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h6">
                {stats.totalUsers > 0
                  ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
                  : 0}
                %
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Active
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={
                stats.totalUsers > 0
                  ? (stats.activeUsers / stats.totalUsers) * 100
                  : 0
              }
              sx={{ height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
