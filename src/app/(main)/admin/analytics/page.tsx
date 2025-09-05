"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { LineChart, BarChart } from "@mui/x-charts";

interface SystemHealth {
  period: string;
  overallStatus: string;
  summary: {
    totalQueries: number;
    successRate: number;
    averageResponseTime: number;
    totalTokens: number;
  };
  performance: {
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    p95ResponseTime: number;
  };
  trends: {
    apiUsage: Array<{
      _id: string;
      totalRequests: number;
      service: string;
    }>;
    errorRate: Array<{
      _id: string;
      totalErrors: number;
    }>;
  };
  status: {
    healthy: number;
    warning: number;
    critical: number;
  };
}

export default function AnalyticsPage() {
  const [healthData, setHealthData] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    fetchSystemHealth();
  }, [period]);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch(
        `/api/analytics/system-health?period=${period}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch system health data");
      }
      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!healthData) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No data available
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Analytics Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={handlePeriodChange}>
            <MenuItem value="1h">Last Hour</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Performance Metrics */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <Box
          flex={{
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 12px)",
            md: "1 1 calc(25% - 18px)",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {healthData.summary.totalQueries}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Queries
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box
          flex={{
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 12px)",
            md: "1 1 calc(25% - 18px)",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {healthData.summary.successRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Success Rate
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box
          flex={{
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 12px)",
            md: "1 1 calc(25% - 18px)",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                {healthData.performance.averageResponseTime}ms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Response Time
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box
          flex={{
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 12px)",
            md: "1 1 calc(25% - 18px)",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {healthData.summary.totalTokens}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tokens Used
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Charts */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* API Usage Trend */}
        <Box flex={{ xs: "1 1 100%", md: "1 1 calc(50% - 12px)" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                API Usage Trend
              </Typography>
              <Box height={300}>
                <LineChart
                  series={[
                    {
                      data: healthData.trends.apiUsage.map(
                        (item) => item.totalRequests
                      ),
                      label: "API Calls",
                    },
                  ]}
                  xAxis={[
                    {
                      data: healthData.trends.apiUsage.map((item) => item._id),
                      scaleType: "band",
                    },
                  ]}
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Error Rate Trend */}
        <Box flex={{ xs: "1 1 100%", md: "1 1 calc(50% - 12px)" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Error Rate Trend
              </Typography>
              <Box height={300}>
                <LineChart
                  series={[
                    {
                      data: healthData.trends.errorRate.map(
                        (item) => item.totalErrors
                      ),
                      label: "Errors",
                    },
                  ]}
                  xAxis={[
                    {
                      data: healthData.trends.errorRate.map((item) => item._id),
                      scaleType: "band",
                    },
                  ]}
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Response Time Distribution */}
        <Box flex="1 1 100%">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Response Time Performance
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box
                  flex={{
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 8px)",
                    md: "1 1 calc(25% - 12px)",
                  }}
                  textAlign="center"
                >
                  <Typography variant="h4" color="primary">
                    {healthData.performance.averageResponseTime}ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average
                  </Typography>
                </Box>
                <Box
                  flex={{
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 8px)",
                    md: "1 1 calc(25% - 12px)",
                  }}
                  textAlign="center"
                >
                  <Typography variant="h4" color="success.main">
                    {healthData.performance.minResponseTime}ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Minimum
                  </Typography>
                </Box>
                <Box
                  flex={{
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 8px)",
                    md: "1 1 calc(25% - 12px)",
                  }}
                  textAlign="center"
                >
                  <Typography variant="h4" color="warning.main">
                    {healthData.performance.maxResponseTime}ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maximum
                  </Typography>
                </Box>
                <Box
                  flex={{
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 8px)",
                    md: "1 1 calc(25% - 12px)",
                  }}
                  textAlign="center"
                >
                  <Typography variant="h4" color="error.main">
                    {healthData.performance.p95ResponseTime}ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    95th Percentile
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* System Health Status */}
        <Box flex="1 1 100%">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                System Health Overview
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex={{ xs: "1 1 100%", sm: "1 1 calc(33.333% - 11px)" }}>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="success.light"
                    borderRadius={1}
                  >
                    <Typography variant="h4" color="success.contrastText">
                      {healthData.status.healthy}
                    </Typography>
                    <Typography variant="body1" color="success.contrastText">
                      Healthy
                    </Typography>
                  </Box>
                </Box>
                <Box flex={{ xs: "1 1 100%", sm: "1 1 calc(33.333% - 11px)" }}>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="warning.light"
                    borderRadius={1}
                  >
                    <Typography variant="h4" color="warning.contrastText">
                      {healthData.status.warning}
                    </Typography>
                    <Typography variant="body1" color="warning.contrastText">
                      Warning
                    </Typography>
                  </Box>
                </Box>
                <Box flex={{ xs: "1 1 100%", sm: "1 1 calc(33.333% - 11px)" }}>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="error.light"
                    borderRadius={1}
                  >
                    <Typography variant="h4" color="error.contrastText">
                      {healthData.status.critical}
                    </Typography>
                    <Typography variant="body1" color="error.contrastText">
                      Critical
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
