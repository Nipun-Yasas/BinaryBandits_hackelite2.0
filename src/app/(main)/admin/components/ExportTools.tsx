"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";
import {
  FileDownload as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Assessment as ReportIcon,
  Description as CsvIcon,
} from "@mui/icons-material";

interface ExportOptions {
  format: "pdf" | "excel" | "csv";
  period: string;
  includeCharts: boolean;
  includeUserData: boolean;
  includeSystemMetrics: boolean;
}

interface ExportToolsProps {
  onExport: (options: ExportOptions) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function ExportTools({
  onExport,
  loading = false,
  error = null,
}: ExportToolsProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "pdf",
    period: "30d",
    includeCharts: true,
    includeUserData: true,
    includeSystemMetrics: true,
  });

  const handleFormatChange = (event: SelectChangeEvent) => {
    setExportOptions((prev) => ({
      ...prev,
      format: event.target.value as "pdf" | "excel" | "csv",
    }));
  };

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setExportOptions((prev) => ({
      ...prev,
      period: event.target.value,
    }));
  };

  const handleExport = async () => {
    try {
      await onExport(exportOptions);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <PdfIcon />;
      case "excel":
        return <ExcelIcon />;
      default:
        return <DownloadIcon />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case "pdf":
        return "Professional PDF report with charts and tables";
      case "excel":
        return "Spreadsheet with raw data and calculations";
      case "csv":
        return "Simple CSV file for data analysis";
      default:
        return "";
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" mb={3}>
        Export Reports
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* Export Configuration */}
        <Box flex="1 1 500px">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={3}>
                Report Configuration
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                <Box flex="1 1 250px">
                  <FormControl fullWidth>
                    <InputLabel>Format</InputLabel>
                    <Select
                      value={exportOptions.format}
                      label="Format"
                      onChange={handleFormatChange}
                    >
                      <MenuItem value="pdf">
                        <Box display="flex" alignItems="center">
                          <PdfIcon sx={{ mr: 1 }} />
                          PDF Report
                        </Box>
                      </MenuItem>
                      <MenuItem value="excel">
                        <Box display="flex" alignItems="center">
                          <ExcelIcon sx={{ mr: 1 }} />
                          Excel Spreadsheet
                        </Box>
                      </MenuItem>
                      <MenuItem value="csv">
                        <Box display="flex" alignItems="center">
                          <CsvIcon sx={{ mr: 1 }} />
                          CSV Data
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box flex="1 1 250px">
                  <FormControl fullWidth>
                    <InputLabel>Time Period</InputLabel>
                    <Select
                      value={exportOptions.period}
                      label="Time Period"
                      onChange={handlePeriodChange}
                    >
                      <MenuItem value="7d">Last 7 Days</MenuItem>
                      <MenuItem value="30d">Last 30 Days</MenuItem>
                      <MenuItem value="90d">Last 90 Days</MenuItem>
                      <MenuItem value="1y">Last Year</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Typography variant="h6" mt={3} mb={2}>
                Include in Report
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label="Charts & Visualizations"
                  color={exportOptions.includeCharts ? "primary" : "default"}
                  variant={exportOptions.includeCharts ? "filled" : "outlined"}
                  onClick={() =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeCharts: !prev.includeCharts,
                    }))
                  }
                />
                <Chip
                  label="User Data"
                  color={exportOptions.includeUserData ? "primary" : "default"}
                  variant={
                    exportOptions.includeUserData ? "filled" : "outlined"
                  }
                  onClick={() =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeUserData: !prev.includeUserData,
                    }))
                  }
                />
                <Chip
                  label="System Metrics"
                  color={
                    exportOptions.includeSystemMetrics ? "primary" : "default"
                  }
                  variant={
                    exportOptions.includeSystemMetrics ? "filled" : "outlined"
                  }
                  onClick={() =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeSystemMetrics: !prev.includeSystemMetrics,
                    }))
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Export Preview */}
        <Box flex="1 1 300px">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Export Preview
              </Typography>

              <Box display="flex" alignItems="center" mb={2}>
                {getFormatIcon(exportOptions.format)}
                <Box ml={2}>
                  <Typography variant="subtitle1">
                    {exportOptions.format.toUpperCase()} Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getFormatDescription(exportOptions.format)}
                  </Typography>
                </Box>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Period: {exportOptions.period}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sections:{" "}
                  {[
                    exportOptions.includeCharts && "Charts",
                    exportOptions.includeUserData && "Users",
                    exportOptions.includeSystemMetrics && "Metrics",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  loading ? <CircularProgress size={20} /> : <DownloadIcon />
                }
                onClick={handleExport}
                disabled={loading}
                size="large"
              >
                {loading ? "Generating..." : "Generate Report"}
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Export Options */}
        <Box flex="1 1 100%">
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Quick Exports
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex="1 1 200px">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PdfIcon />}
                    onClick={() =>
                      onExport({
                        format: "pdf",
                        period: "30d",
                        includeCharts: true,
                        includeUserData: true,
                        includeSystemMetrics: true,
                      })
                    }
                    disabled={loading}
                  >
                    Full PDF Report
                  </Button>
                </Box>

                <Box flex="1 1 200px">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ExcelIcon />}
                    onClick={() =>
                      onExport({
                        format: "excel",
                        period: "30d",
                        includeCharts: false,
                        includeUserData: true,
                        includeSystemMetrics: true,
                      })
                    }
                    disabled={loading}
                  >
                    User Data Excel
                  </Button>
                </Box>

                <Box flex="1 1 200px">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CsvIcon />}
                    onClick={() =>
                      onExport({
                        format: "csv",
                        period: "7d",
                        includeCharts: false,
                        includeUserData: true,
                        includeSystemMetrics: false,
                      })
                    }
                    disabled={loading}
                  >
                    Weekly CSV
                  </Button>
                </Box>

                <Box flex="1 1 200px">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ReportIcon />}
                    onClick={() =>
                      onExport({
                        format: "pdf",
                        period: "7d",
                        includeCharts: true,
                        includeUserData: false,
                        includeSystemMetrics: true,
                      })
                    }
                    disabled={loading}
                  >
                    System Report
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
