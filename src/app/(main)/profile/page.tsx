"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

import {
  User,
  Camera,
  School,
  GraduationCap,
  Mail,
  BookOpen,
  Save,
  Edit,
  Check,
  X,
} from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  school: string;
  grade: string;
  bio: string;
  profilePicture: string;
}

const gradeOptions = [
  "Grade 6",
  "Grade 7", 
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Undergraduate",
  "Graduate",
  "Other",
];

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    fullName: "",
    email: "",
    school: "",
    grade: "Grade 10",
    bio: "",
    profilePicture: "",
  });

  const [originalData, setOriginalData] = useState<ProfileData>({
    id: "",
    fullName: "",
    email: "",
    school: "",
    grade: "Grade 10", 
    bio: "",
    profilePicture: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch("/api/profile");
      
      if (response.ok) {
        const data = await response.json();
        const profileData = {
          id: data.id,
          fullName: data.fullName || data.name || "",
          email: data.email || "",
          school: data.school || "",
          grade: data.grade || "Grade 10",
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
        };
        setProfileData(profileData);
        setOriginalData(profileData);
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setErrors({ profilePicture: "Please select an image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ profilePicture: "File size must be less than 5MB" });
      return;
    }

    setUploadingImage(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) => ({
          ...prev,
          profilePicture: data.url,
        }));
      } else {
        const errorData = await response.json();
        setErrors({ profilePicture: errorData.error || "Failed to upload image" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors({ profilePicture: "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profileData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!profileData.school.trim()) {
      newErrors.school = "School/Institution is required";
    }
    
    if (!profileData.grade) {
      newErrors.grade = "Grade/Year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: profileData.fullName,
          school: profileData.school,
          grade: profileData.grade,
          bio: profileData.bio,
          profilePicture: profileData.profilePicture,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedProfile = {
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          school: data.user.school,
          grade: data.user.grade,
          bio: data.user.bio,
          profilePicture: data.user.profilePicture,
        };
        
        setProfileData(updatedProfile);
        setOriginalData(updatedProfile);
        setEditMode(false);
        setSaveSuccess(true);
        
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors({ submit: errorData.error || "Failed to save profile" });
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      setErrors({ submit: "Failed to save profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setEditMode(false);
    setErrors({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                My Profile
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your personal information and preferences
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              {!editMode ? (
                <Button
                  variant="contained"
                  startIcon={<Edit size={20} />}
                  onClick={() => setEditMode(true)}
                  disabled={isLoadingData}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                    },
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<X size={20} />}
                    onClick={handleCancel}
                    disabled={isLoading}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Save size={20} />
                      )
                    }
                    onClick={handleSave}
                    disabled={isLoading}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </motion.div>

        {/* Success Alert */}
        {saveSuccess && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert
              severity="success"
              icon={<Check />}
              sx={{
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: 20,
                },
              }}
            >
              Profile updated successfully!
            </Alert>
          </motion.div>
        )}

        {/* Error Alert */}
        {errors.submit && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {errors.submit}
            </Alert>
          </motion.div>
        )}

        {isLoadingData ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
                <Skeleton variant="circular" width={120} height={120} sx={{ margin: "0 auto", mb: 2 }} />
                <Skeleton variant="text" width="60%" sx={{ margin: "0 auto", mb: 1 }} />
                <Skeleton variant="text" width="40%" sx={{ margin: "0 auto", mb: 1 }} />
                <Skeleton variant="text" width="80%" sx={{ margin: "0 auto" }} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Skeleton variant="text" width="40%" sx={{ mb: 3, fontSize: "2rem" }} />
                <Grid container spacing={3}>
                  {[...Array(4)].map((_, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Skeleton variant="rounded" height={56} />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Skeleton variant="rounded" height={120} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={4}>
            {/* Profile Picture Section */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    textAlign: "center",
                    height: "fit-content",
                    position: "relative",
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                    <Avatar
                      src={profileData.profilePicture}
                      sx={{
                        width: 120,
                        height: 120,
                        margin: "0 auto",
                        border: `4px solid ${theme.palette.primary.main}20`,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      }}
                    >
                      <User size={48} color="white" />
                    </Avatar>

                    {editMode && (
                      <>
                        <IconButton
                          sx={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            background: theme.palette.primary.main,
                            color: "white",
                            width: 40,
                            height: 40,
                            "&:hover": {
                              background: theme.palette.primary.dark,
                              transform: "scale(1.1)",
                            },
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Camera size={20} />
                          )}
                        </IconButton>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                      </>
                    )}
                  </Box>

                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {profileData.fullName || "User"}
                  </Typography>

                  <Chip
                    label={profileData.grade}
                    color="primary"
                    variant="outlined"
                    sx={{
                      mb: 2,
                      fontWeight: 500,
                    }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    {profileData.school}
                  </Typography>
                  
                  {errors.profilePicture && (
                    <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
                      {errors.profilePicture}
                    </Alert>
                  )}
                </Paper>
              </motion.div>
            </Grid>

            {/* Profile Information */}
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                    Personal Information
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Full Name */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        disabled={!editMode}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                              <User size={20} color={theme.palette.text.secondary} />
                            </Box>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!editMode}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                              <Mail size={20} color={theme.palette.text.secondary} />
                            </Box>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    {/* School */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="School/Institution"
                        value={profileData.school}
                        onChange={(e) => handleInputChange("school", e.target.value)}
                        disabled={!editMode}
                        error={!!errors.school}
                        helperText={errors.school}
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                              <School size={20} color={theme.palette.text.secondary} />
                            </Box>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    {/* Grade */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.grade}>
                        <InputLabel>Current Grade/Year</InputLabel>
                        <Select
                          value={profileData.grade}
                          label="Current Grade/Year"
                          onChange={(e) => handleInputChange("grade", e.target.value)}
                          disabled={!editMode}
                          startAdornment={
                            <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                              <GraduationCap size={20} color={theme.palette.text.secondary} />
                            </Box>
                          }
                          sx={{
                            borderRadius: 2,
                          }}
                        >
                          {gradeOptions.map((grade) => (
                            <MenuItem key={grade} value={grade}>
                              {grade}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.grade && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 1, ml: 2 }}
                          >
                            {errors.grade}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Bio */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        About Me
                      </Typography>
                      <TextField
                        fullWidth
                        label="Bio/Short Description"
                        multiline
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        disabled={!editMode}
                        placeholder="Tell us about your aspirations, interests, and goals..."
                        InputProps={{
                          startAdornment: (
                            <Box
                              sx={{
                                mr: 1,
                                display: "flex",
                                alignItems: "flex-start",
                                mt: 1,
                              }}
                            >
                              <BookOpen size={20} color={theme.palette.text.secondary} />
                            </Box>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        )}
      </motion.div>
    </Container>
  );
}
