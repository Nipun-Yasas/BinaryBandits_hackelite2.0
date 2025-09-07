"use client";

import React from "react";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import { BarChart, LineChart } from "@mui/x-charts";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
}

export function ChartCard({
  title,
  subtitle,
  children,
  height = 300,
}: ChartCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={subtitle ? 1 : 2}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ width: "100%", height }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

interface DailyActivityChartProps {
  data: Array<{
    date: string;
    queries: number;
    uniqueUsers: number;
    successful: number;
    failed: number;
  }>;
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  const theme = useTheme();

  const chartData = data.map((item) => ({
    date: item.date,
    queries: item.queries,
    users: item.uniqueUsers,
  }));

  return (
    <ChartCard title="Daily Activity" subtitle="Queries and users over time">
      <LineChart
        series={[
          {
            data: chartData.map((item) => item.queries),
            label: "Queries",
            color: theme.palette.primary.main,
          },
          {
            data: chartData.map((item) => item.users),
            label: "Unique Users",
            color: theme.palette.secondary.main,
          },
        ]}
        xAxis={[
          {
            data: chartData.map((item) => item.date),
            scaleType: "band",
          },
        ]}
        height={300}
      />
    </ChartCard>
  );
}

interface QueryTypeChartProps {
  data: Array<{
    _id: string;
    count: number;
  }>;
}

export function QueryTypeChart({ data }: QueryTypeChartProps) {
  return (
    <ChartCard title="Query Types" subtitle="Distribution of query categories">
      <BarChart
        series={[
          {
            data: data.map((item) => item.count),
            label: "Count",
          },
        ]}
        xAxis={[
          {
            data: data.map((item) => item._id),
            scaleType: "band",
          },
        ]}
        height={300}
      />
    </ChartCard>
  );
}

interface ApiUsageChartProps {
  data: Array<{
    _id: string;
    totalRequests: number;
    service: string;
  }>;
}

export function ApiUsageChart({ data }: ApiUsageChartProps) {
  const theme = useTheme();

  return (
    <ChartCard title="API Usage Trend" subtitle="Requests over time">
      <LineChart
        series={[
          {
            data: data.map((item) => item.totalRequests),
            label: "Requests",
            color: theme.palette.primary.main,
          },
        ]}
        xAxis={[
          {
            data: data.map((item) => item._id),
            scaleType: "band",
          },
        ]}
        height={300}
      />
    </ChartCard>
  );
}

interface ErrorRateChartProps {
  data: Array<{
    _id: string;
    totalErrors: number;
  }>;
}

export function ErrorRateChart({ data }: ErrorRateChartProps) {
  const theme = useTheme();

  return (
    <ChartCard title="Error Rate Trend" subtitle="Errors over time">
      <LineChart
        series={[
          {
            data: data.map((item) => item.totalErrors),
            label: "Errors",
            color: theme.palette.error.main,
          },
        ]}
        xAxis={[
          {
            data: data.map((item) => item._id),
            scaleType: "band",
          },
        ]}
        height={300}
      />
    </ChartCard>
  );
}

interface TopUsersChartProps {
  data: Array<{
    userId: string;
    name: string;
    email: string;
    role: string;
    queryCount: number;
    successRate: number;
  }>;
}

export function TopUsersChart({ data }: TopUsersChartProps) {
  const topUsers = data.slice(0, 10);

  return (
    <ChartCard title="Top Users by Activity" subtitle="Most active users">
      <BarChart
        series={[
          {
            data: topUsers.map((item) => item.queryCount),
            label: "Queries",
          },
        ]}
        xAxis={[
          {
            data: topUsers.map((item) => item.name || item.email),
            scaleType: "band",
          },
        ]}
        height={300}
      />
    </ChartCard>
  );
}
