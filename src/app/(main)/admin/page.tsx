"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from "@mui/material";
import {
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Error as ErrorIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface AdminStats {
  period: string;
  systemStatus: string;
  overview: {
    totalQueries: number;
    successRate: number;
    averageResponseTime: number;
    totalTokens: number;
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    bannedUsers: number;
  };
  trends: {
    dailyActivity: Array<{
      date: string;
      queries: number;
      uniqueUsers: number;
      successful: number;
      failed: number;
    }>;
    queryTypes: Array<{
      _id: string;
      count: number;
    }>;
  };
  topUsers: Array<{
    userId: string;
    name: string;
    email: string;
    role: string;
    queryCount: number;
    successRate: number;
  }>;
  systemHealth: {
    healthy: number;
    warning: number;
    critical: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/analytics/admin-stats");
      if (!response.ok) {
        throw new Error("Failed to fetch admin stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
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

  if (!stats) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No data available
      </Alert>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "critical":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={`System: ${stats.systemStatus}`}
            color={getStatusColor(stats.systemStatus)}
            variant="outlined"
          />
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            size="small"
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <Box flex="1 1 250px">
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">
                    {stats.overview.totalQueries}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Queries
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 250px">
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">
                    {stats.overview.successRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 250px">
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">
                    {stats.overview.activeUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 250px">
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ErrorIcon color="error" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">
                    {stats.overview.averageResponseTime}ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Response Time
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Charts */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* Daily Activity Chart */}
        <Box flex="1 1 500px">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Daily Activity ({stats.period})
              </Typography>
              <Box
                height={300}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="body1" color="text.secondary">
                  Chart data: {stats.trends.dailyActivity.length} days
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Query Types Pie Chart */}
        <Box flex="1 1 300px">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Query Types
              </Typography>
              <Box height={300} display="flex" flexDirection="column" gap={1}>
                {stats.trends.queryTypes.slice(0, 5).map((type, index) => (
                  <Box
                    key={type._id}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">
                      {type._id || "Unknown"}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {type.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Top Users */}
        <Box flex="1 1 100%">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Top Users by Activity
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Role
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Queries
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Success Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topUsers.map((user) => (
                      <tr key={user.userId}>
                        <td
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {user.name || "N/A"}
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {user.email}
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <Chip
                            label={user.role}
                            size="small"
                            color={
                              user.role === "admin" ? "primary" : "default"
                            }
                          />
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                            textAlign: "right",
                          }}
                        >
                          {user.queryCount}
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                            textAlign: "right",
                          }}
                        >
                          {user.successRate.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
