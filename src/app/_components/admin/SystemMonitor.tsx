"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Memory as MemoryIcon,
  Storage as CpuIcon,
  NetworkCheck as NetworkIcon,
  CheckCircleOutline as SuccessIcon,
} from "@mui/icons-material";

interface SystemMetrics {
  memoryUsage: number;
  cpuUsage: number;
  networkRequests: number;
  errorRate: number;
  responseTime: number;
  uptime: number;
  activeConnections: number;
}

interface SystemHealthProps {
  metrics?: SystemMetrics;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export function SystemMonitor({
  metrics,
  loading = false,
  error = null,
  onRefresh,
}: SystemHealthProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (metrics) {
      setLastUpdated(new Date());
    }
  }, [metrics]);

  // Mock data for demonstration
  const mockMetrics: SystemMetrics = {
    memoryUsage: 65,
    cpuUsage: 45,
    networkRequests: 1250,
    errorRate: 2.3,
    responseTime: 245,
    uptime: 99.8,
    activeConnections: 89,
  };

  const currentMetrics = metrics || mockMetrics;

  const getHealthColor = (
    value: number,
    thresholds: { warning: number; critical: number }
  ) => {
    if (value >= thresholds.critical) return "error";
    if (value >= thresholds.warning) return "warning";
    return "success";
  };

  const getHealthIcon = (
    value: number,
    thresholds: { warning: number; critical: number }
  ) => {
    if (value >= thresholds.critical) return <ErrorIcon />;
    if (value >= thresholds.warning) return <WarningIcon />;
    return <SuccessIcon />;
  };

  const MetricCard = ({
    title,
    value,
    unit,
    icon,
    thresholds,
    color,
    subtitle,
  }: {
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    thresholds?: { warning: number; critical: number };
    color?: string;
    subtitle?: string;
  }) => {
    const healthColor = thresholds
      ? getHealthColor(value, thresholds)
      : color || "primary";
    const healthIcon = thresholds ? getHealthIcon(value, thresholds) : icon;

    return (
      <Card>
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
                  backgroundColor: `${healthColor}.light`,
                  borderRadius: 2,
                  p: 1,
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: `${healthColor}.main`,
                }}
              >
                {healthIcon}
              </Box>
              <Box>
                <Typography variant="h6" color={`${healthColor}.main`}>
                  {typeof value === "number" ? value.toFixed(1) : value}
                  {unit}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {title}
                </Typography>
              </Box>
            </Box>
          </Box>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" component="h2">
          System Monitor
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          {onRefresh && (
            <Chip
              label="Refresh"
              onClick={onRefresh}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* System Health Overview */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <Box flex="1 1 250px">
          <MetricCard
            title="Memory Usage"
            value={currentMetrics.memoryUsage}
            unit="%"
            icon={<MemoryIcon />}
            thresholds={{ warning: 70, critical: 90 }}
            subtitle={`${(currentMetrics.memoryUsage * 0.1).toFixed(1)} GB used`}
          />
        </Box>

        <Box flex="1 1 250px">
          <MetricCard
            title="CPU Usage"
            value={currentMetrics.cpuUsage}
            unit="%"
            icon={<CpuIcon />}
            thresholds={{ warning: 60, critical: 85 }}
            subtitle="System load"
          />
        </Box>

        <Box flex="1 1 250px">
          <MetricCard
            title="Response Time"
            value={currentMetrics.responseTime}
            unit="ms"
            icon={<NetworkIcon />}
            thresholds={{ warning: 500, critical: 1000 }}
            subtitle="Average response"
          />
        </Box>

        <Box flex="1 1 250px">
          <MetricCard
            title="Error Rate"
            value={currentMetrics.errorRate}
            unit="%"
            icon={<ErrorIcon />}
            thresholds={{ warning: 5, critical: 10 }}
            subtitle="Request failures"
          />
        </Box>
      </Box>

      {/* Detailed Metrics */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box flex="1 1 400px">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Resource Usage
              </Typography>

              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Memory</Typography>
                  <Typography variant="body2">
                    {currentMetrics.memoryUsage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={currentMetrics.memoryUsage}
                  color={
                    currentMetrics.memoryUsage > 90
                      ? "error"
                      : currentMetrics.memoryUsage > 70
                        ? "warning"
                        : "success"
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">CPU</Typography>
                  <Typography variant="body2">
                    {currentMetrics.cpuUsage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={currentMetrics.cpuUsage}
                  color={
                    currentMetrics.cpuUsage > 85
                      ? "error"
                      : currentMetrics.cpuUsage > 60
                        ? "warning"
                        : "success"
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">System Uptime</Typography>
                  <Typography variant="body2">
                    {currentMetrics.uptime}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={currentMetrics.uptime}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 400px">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Network & Performance
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex="1 1 200px">
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentMetrics.networkRequests}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Requests/min
                    </Typography>
                  </Box>
                </Box>

                <Box flex="1 1 200px">
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {currentMetrics.activeConnections}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                  </Box>
                </Box>

                <Box flex="1 1 200px">
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {currentMetrics.uptime}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Uptime
                    </Typography>
                  </Box>
                </Box>

                <Box flex="1 1 200px">
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {currentMetrics.responseTime}ms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Response
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* System Status */}
        <Box flex="1 1 100%">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                System Status
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex="1 1 300px">
                  <Box
                    display="flex"
                    alignItems="center"
                    p={2}
                    bgcolor="success.light"
                    borderRadius={1}
                  >
                    <CheckCircleIcon sx={{ mr: 1, color: "success.main" }} />
                    <Box>
                      <Typography variant="body1" color="success.contrastText">
                        Database
                      </Typography>
                      <Typography variant="body2" color="success.contrastText">
                        Operational
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box flex="1 1 300px">
                  <Box
                    display="flex"
                    alignItems="center"
                    p={2}
                    bgcolor="success.light"
                    borderRadius={1}
                  >
                    <CheckCircleIcon sx={{ mr: 1, color: "success.main" }} />
                    <Box>
                      <Typography variant="body1" color="success.contrastText">
                        API Services
                      </Typography>
                      <Typography variant="body2" color="success.contrastText">
                        Running
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box flex="1 1 300px">
                  <Box
                    display="flex"
                    alignItems="center"
                    p={2}
                    bgcolor="warning.light"
                    borderRadius={1}
                  >
                    <WarningIcon sx={{ mr: 1, color: "warning.main" }} />
                    <Box>
                      <Typography variant="body1" color="warning.contrastText">
                        Cache
                      </Typography>
                      <Typography variant="body2" color="warning.contrastText">
                        High Usage
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box flex="1 1 300px">
                  <Box
                    display="flex"
                    alignItems="center"
                    p={2}
                    bgcolor="info.light"
                    borderRadius={1}
                  >
                    <InfoIcon sx={{ mr: 1, color: "info.main" }} />
                    <Box>
                      <Typography variant="body1" color="info.contrastText">
                        Backups
                      </Typography>
                      <Typography variant="body2" color="info.contrastText">
                        Last: 2h ago
                      </Typography>
                    </Box>
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
