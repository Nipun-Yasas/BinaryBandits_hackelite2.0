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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@mui/material";
import {
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    requestsPerSecond: number;
    errorRate: number;
  };
  services: Array<{
    name: string;
    status: "healthy" | "warning" | "critical";
    uptime: string;
    responseTime: number;
  }>;
  alerts: Array<{
    id: string;
    type: "error" | "warning" | "info";
    message: string;
    timestamp: string;
  }>;
}

export default function SystemPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemMetrics();
    // Set up periodic refresh
    const interval = setInterval(fetchSystemMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch("/api/analytics/system-health");
      if (!response.ok) {
        throw new Error("Failed to fetch system metrics");
      }
      const data = await response.json();

      // Transform the data to match our interface
      const transformedMetrics: SystemMetrics = {
        memory: {
          used: 512, // Mock data - replace with actual metrics
          total: 1024,
          percentage: 50,
        },
        cpu: {
          usage: 35,
          cores: 4,
        },
        disk: {
          used: 256,
          total: 512,
          percentage: 50,
        },
        network: {
          requestsPerSecond: data.summary.totalQueries / 3600, // Approximate RPS
          errorRate: 100 - data.summary.successRate,
        },
        services: [
          {
            name: "Gemini API",
            status: data.overallStatus as "healthy" | "warning" | "critical",
            uptime: "99.9%",
            responseTime: data.performance.averageResponseTime,
          },
          {
            name: "Database",
            status: "healthy",
            uptime: "100%",
            responseTime: 5,
          },
          {
            name: "Authentication",
            status: "healthy",
            uptime: "100%",
            responseTime: 2,
          },
        ],
        alerts: [
          {
            id: "1",
            type:
              data.overallStatus === "critical"
                ? "error"
                : data.overallStatus === "warning"
                  ? "warning"
                  : "info",
            message: `System status: ${data.overallStatus}`,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setMetrics(transformedMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircleIcon color="success" />;
      case "warning":
        return <WarningIcon color="warning" />;
      case "critical":
        return <ErrorIcon color="error" />;
      default:
        return <CheckCircleIcon color="success" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "critical":
        return "error";
      default:
        return "success";
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

  if (!metrics) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No system data available
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
          System Monitoring
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSystemMetrics}
        >
          Refresh
        </Button>
      </Box>

      {/* System Metrics */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        {/* Memory Usage */}
        <Box
          flex={{
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 12px)",
            md: "1 1 calc(25% - 18px)",
          }}
        >
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MemoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Memory</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {metrics.memory.used}MB / {metrics.memory.total}MB
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metrics.memory.percentage}
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {metrics.memory.percentage}% used
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* CPU Usage */}
        <Box
          flex={{
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 12px)",
            md: "1 1 calc(25% - 18px)",
          }}
        >
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SpeedIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">CPU</Typography>
              </Box>
              <Typography variant="h4" color="secondary">
                {metrics.cpu.usage}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metrics.cpu.usage}
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {metrics.cpu.cores} cores
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Disk Usage */}
        <Box
          flex={{
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 12px)",
            md: "1 1 calc(25% - 18px)",
          }}
        >
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StorageIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Disk</Typography>
              </Box>
              <Typography variant="h4" color="info">
                {metrics.disk.used}GB / {metrics.disk.total}GB
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metrics.disk.percentage}
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {metrics.disk.percentage}% used
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Network */}
        <Box
          flex={{
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 12px)",
            md: "1 1 calc(25% - 18px)",
          }}
        >
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NetworkIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Network</Typography>
              </Box>
              <Typography variant="h4" color="success">
                {metrics.network.requestsPerSecond.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                req/sec
              </Typography>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Error Rate: {metrics.network.errorRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Services Status */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box flex={{ xs: "1 1 100%", md: "1 1 calc(50% - 12px)" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Service Status
              </Typography>
              <List>
                {metrics.services.map((service) => (
                  <ListItem key={service.name}>
                    <ListItemIcon>{getStatusIcon(service.status)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography>{service.name}</Typography>
                          <Chip
                            label={service.status}
                            color={getStatusColor(service.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Uptime: {service.uptime} | Response:{" "}
                          {service.responseTime}ms
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Alerts */}
        <Box flex={{ xs: "1 1 100%", md: "1 1 calc(50% - 12px)" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Recent Alerts
              </Typography>
              {metrics.alerts.length > 0 ? (
                <List>
                  {metrics.alerts.map((alert) => (
                    <ListItem key={alert.id}>
                      <ListItemIcon>
                        {alert.type === "error" && <ErrorIcon color="error" />}
                        {alert.type === "warning" && (
                          <WarningIcon color="warning" />
                        )}
                        {alert.type === "info" && (
                          <CheckCircleIcon color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={alert.message}
                        secondary={new Date(alert.timestamp).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent alerts
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
