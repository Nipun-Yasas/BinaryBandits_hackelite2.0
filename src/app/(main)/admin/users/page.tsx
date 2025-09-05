"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: "ban" | "unban" | "promote" | "demote" | null;
  }>({ open: false, action: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (
    user: User,
    action: "ban" | "unban" | "promote" | "demote"
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error("Failed to perform action");
      }

      // Refresh users list
      await fetchUsers();
      setActionDialog({ open: false, action: null });
      setSelectedUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleColor = (role: string) => {
    return role === "admin" ? "primary" : "default";
  };

  const getStatusColor = (banned: boolean) => {
    return banned ? "error" : "success";
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

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
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
      <Card sx={{ mb: 3 }}>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
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
                    {user.successRate
                      ? `${user.successRate.toFixed(1)}%`
                      : "N/A"}
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
                        >
                          <PersonIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, action: null })}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionDialog.action === "ban" && "ban"}
            {actionDialog.action === "unban" && "unban"}
            {actionDialog.action === "promote" && "promote to admin"}
            {actionDialog.action === "demote" && "demote to user"} this user?
          </Typography>
          {selectedUser && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedUser.name || selectedUser.email}
            </Typography>
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
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
