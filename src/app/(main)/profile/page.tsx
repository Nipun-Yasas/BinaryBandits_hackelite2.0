"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Input,
} from "@mui/material";
import { motion } from "framer-motion";
import { X, Save, Camera, Edit } from "lucide-react";
import { useAuth } from "../../_providers/AuthProvider";
import ProfileSkeleton from "./components/ProfileSkeleton";
import theme from "../../../theme";

interface ProfileFormData {
  name: string;
  fullName: string;
  email: string;
  bio: string;
  school: string;
  grade: string;
}

export default function ProfilePage() {
  const { user, updateUser, refreshUser, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    fullName: "",
    email: "",
    bio: "",
    school: "",
    grade: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        fullName: user.fullName || "",
        email: user.email || "",
        bio: user.bio || "",
        school: user.school || "",
        grade: user.grade || "",
      });
    }
  }, [user, isLoading, router]);

  // Keep form in sync when user changes
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      name: user.name ?? prev.name,
      fullName: user.fullName ?? prev.fullName,
      email: user.email ?? prev.email,
      bio: user.bio ?? prev.bio,
      school: user.school ?? prev.school,
      grade: user.grade ?? prev.grade,
    }));
  }, [user]);

  const handleInputChange = (
    field: keyof ProfileFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!user || !user._id) {
        setIsSaving(false);
        return;
      }
      const uid = user._id ? String(user._id) : "";
      if (!uid || uid === "undefined" || uid === "null") {
        setIsSaving(false);
        return;
      }
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": uid,
        },
        body: JSON.stringify({
          name: formData.name,
          fullName: formData.fullName,
          bio: formData.bio,
          school: formData.school,
          grade: formData.grade,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser.user);
        await refreshUser();
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !user._id) return;
    const uid = String(user._id);
    if (!uid || uid === "undefined" || uid === "null") return;
    setIsUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "x-user-id": uid },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      updateUser(data.user);
      // Optional: update local formData to reflect new avatar immediately
      setFormData((prev) => ({ ...prev }));
    } catch (e: unknown) {
      console.log(e);
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = "";
    }
  };

  // Fetch profile once per user id to avoid infinite update loop
  const hasFetchedProfile = useRef<string | null>(null);
  useEffect(() => {
    if (!user?._id) return;
    if (hasFetchedProfile.current === user._id) return;
    hasFetchedProfile.current = user._id as unknown as string;

    const uid = user._id ? String(user._id) : "";
    if (!uid || uid === "undefined" || uid === "null") return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: { "x-user-id": uid },
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          updateUser(data.user); // single update; ref prevents re-fetch
        }
      } catch {
        // ignore
      }
    })();
    return () => controller.abort();
  }, [user?._id]); // do not depend on `user` or `updateUser`

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              My Profile
            </Typography>
            <Button
              variant={isEditing ? "outlined" : "contained"}
              startIcon={isEditing ? <X /> : <Edit />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{
                background: isEditing
                  ? "transparent"
                  : "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                "&:hover": {
                  background: isEditing
                    ? "rgba(0, 123, 255, 0.1)"
                    : "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                },
              }}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </Box>
          <Typography variant="h6" color="text.secondary">
            Manage your basic account information
          </Typography>
        </Box>

        {/* Profile Picture & Basic Info */}
        <Paper
          elevation={10}
          sx={{
            textAlign: "center",
            p: 4,
            mb: 4,
            position: "relative",
            zIndex: 1,
            backdropFilter: "blur(10px) saturate(1.08)",
            WebkitBackdropFilter: "blur(10px) saturate(1.08)",
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 40px rgba(0,0,0,0.45)"
                : "0 10px 40px rgba(0,0,0,0.12)",
            transition: "background-color 200ms ease, backdrop-filter 200ms ease",
            "&:hover": {
              boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
              mb: 4,
              // Stack below avatar on very small screens
              "@media (max-width: 500px)": {
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2,
              },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.profilePicture || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  background:
                    "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                  fontSize: "3rem",
                  fontWeight: 700,
                }}
              >
                {!user.profilePicture && formData.name
                  ? formData.name.charAt(0).toUpperCase()
                  : null}
              </Avatar>
              {isEditing && (
                <>
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "primary.main",
                      color: "white",
                      width: 36,
                      height: 36,
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <Camera size={16} />
                    )}
                  </IconButton>
                  <Input
                    type="file"
                    inputRef={fileInputRef}
                    inputProps={{ accept: "image/png,image/jpeg,image/webp" }}
                    onChange={handleAvatarChange}
                    sx={{ display: "none" }}
                  />
                </>
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                "@media (max-width: 500px)": {
                  width: "100%",
                  mt: 2,
                },
              }}
            >
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                disabled
                sx={{ mb: 2 }}
                helperText="Email cannot be changed"
              />

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Role:
                </Typography>
                <Chip
                  label={(user.role || "user").toString()}
                  color={user.role === "admin" ? "secondary" : "default"}
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Bio"
            placeholder="Tell others about yourself..."
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            <TextField
              label="School"
              placeholder="Your school"
              value={formData.school}
              onChange={(e) => handleInputChange("school", e.target.value)}
              disabled={!isEditing}
            />
            <TextField
              label="Grade"
              placeholder="e.g., 10th, 12th, Freshman"
              value={formData.grade}
              onChange={(e) => handleInputChange("grade", e.target.value)}
              disabled={!isEditing}
            />
          </Box>
        </Paper>

        {/* Save Button */}
        {isEditing && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={isSaving}
              sx={{
                background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                },
                px: 4,
                py: 1.5,
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        )}
      </motion.div>
    </Container>
  );
}
