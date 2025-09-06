"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface User {
  _id: string;
  email: string;
  name?: string;
  role: string;
  banned: boolean;
  createdAt: string;
  lastLogin?: string;
  queryCount?: number;
  successRate?: number;
}

interface UserManagementProps {
  users: User[];
  onUserAction: (userId: string, action: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function UserManagement({
  users,
  onUserAction,
  onRefresh,
  loading = false,
  error = null,
}: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: "ban" | "unban" | "promote" | "demote" | "delete" | null;
  }>({ open: false, action: null });

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUserAction = async (
    user: User,
    action: "ban" | "unban" | "promote" | "demote" | "delete"
  ) => {
    try {
      await onUserAction(user._id, action);
      setActionDialog({ open: false, action: null });
      setSelectedUser(null);
    } catch (err) {
      console.error("Error performing user action:", err);
    }
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "primary" : "default";
  };

  const getStatusColor = (banned: boolean) => {
    return banned ? "error" : "success";
  };

  const getActionDialogTitle = () => {
    switch (actionDialog.action) {
      case "ban":
        return "Ban User";
      case "unban":
        return "Unban User";
      case "promote":
        return "Promote to Admin";
      case "demote":
        return "Demote to User";
      case "delete":
        return "Delete User";
      default:
        return "Confirm Action";
    }
  };

  const getActionDialogContent = () => {
    if (!selectedUser) return null;

    switch (actionDialog.action) {
      case "ban":
        return `Are you sure you want to ban ${selectedUser.name || selectedUser.email}? This will prevent them from accessing the system.`;
      case "unban":
        return `Are you sure you want to unban ${selectedUser.name || selectedUser.email}? This will restore their access to the system.`;
      case "promote":
        return `Are you sure you want to promote ${selectedUser.name || selectedUser.email} to admin? They will have full administrative privileges.`;
      case "demote":
        return `Are you sure you want to demote ${selectedUser.name || selectedUser.email} from admin to regular user? They will lose administrative privileges.`;
      case "delete":
        return `Are you sure you want to permanently delete ${selectedUser.name || selectedUser.email}? This action cannot be undone.`;
      default:
        return "Are you sure you want to perform this action?";
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" component="h2">
          User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Queries</TableCell>
              <TableCell>Success Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {user.role === "admin" ? (
                      <AdminIcon sx={{ mr: 1 }} />
                    ) : (
                      <PersonIcon sx={{ mr: 1 }} />
                    )}
                    {user.name || "N/A"}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.banned ? "Banned" : "Active"}
                    color={getStatusColor(user.banned)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.queryCount || 0}</TableCell>
                <TableCell>
                  {user.successRate ? `${user.successRate.toFixed(1)}%` : "N/A"}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {user.banned ? (
                      <IconButton
                        color="success"
                        onClick={() => {
                          setSelectedUser(user);
                          setActionDialog({ open: true, action: "unban" });
                        }}
                        title="Unban User"
                        size="small"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedUser(user);
                          setActionDialog({ open: true, action: "ban" });
                        }}
                        title="Ban User"
                        size="small"
                      >
                        <BlockIcon />
                      </IconButton>
                    )}

                    {user.role === "user" ? (
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedUser(user);
                          setActionDialog({ open: true, action: "promote" });
                        }}
                        title="Promote to Admin"
                        size="small"
                      >
                        <AdminIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="default"
                        onClick={() => {
                          setSelectedUser(user);
                          setActionDialog({ open: true, action: "demote" });
                        }}
                        title="Demote to User"
                        size="small"
                      >
                        <PersonIcon />
                      </IconButton>
                    )}

                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedUser(user);
                        setActionDialog({ open: true, action: "delete" });
                      }}
                      title="Delete User"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, action: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{getActionDialogTitle()}</DialogTitle>
        <DialogContent>
          <Typography>{getActionDialogContent()}</Typography>
          {selectedUser && (
            <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>User:</strong> {selectedUser.name || selectedUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Role:</strong> {selectedUser.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong>{" "}
                {selectedUser.banned ? "Banned" : "Active"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setActionDialog({ open: false, action: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedUser && actionDialog.action) {
                handleUserAction(selectedUser, actionDialog.action);
              }
            }}
            color={actionDialog.action === "delete" ? "error" : "primary"}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
