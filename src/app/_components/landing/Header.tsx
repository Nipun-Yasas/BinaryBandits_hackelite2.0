"use client";

import { useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users } from "lucide-react";

import { ThemeSwitcher } from "@toolpad/core";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";

import UserMenu from "../main/UserMenu";

const drawerWidth = 240;

export default function Header() {
  const theme = useTheme();
  const gradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;
  const gradientHover = `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`;

  const [mobileOpen, setMobileOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // await logout();
    handleUserMenuClose();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BookOpen size={20} color={theme.palette.primary.main} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PathFinder
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Link href="#about" style={{ textDecoration: "none" }}>
          <Typography
            variant="body1"
            sx={{
              color: "primary.main",
              transition: "color 0.3s ease",
            }}
          >
            About
          </Typography>
        </Link>

        <Link href="#features" style={{ textDecoration: "none" }}>
          <Typography
            variant="body1"
            sx={{
              color: "primary.main",
              transition: "color 0.3s ease",
            }}
          >
            Features
          </Typography>
        </Link>

        <Link href="/login" style={{ textDecoration: "none" }}>
          <Typography
            variant="body1"
            sx={{
              color: "primary.main",
              transition: "color 0.3s ease",
              mx: 2,
              gap: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Users size={16} />
            <span>Find Mentors</span>
          </Typography>
        </Link>
        {/* {user && (
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            <Link href="/dashboard">Dashboard</Link>
          </Typography>
        )} */}
      </Box>

      {/* Mobile Auth Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
        {/* {user ? (
          <>
            <Typography variant="body2" sx={{ color: "text.primary", mb: 1 }}>
              Welcome, {user.name}!
            </Typography>
            <Button
              onClick={handleLogout}
              variant="outlined"
              size="small"
              sx={{ color: "error.main", borderColor: "error.main" }}
            >
              Logout
            </Button>
          </>
        ) : ( */}
        <>
          <Link href="/login" passHref style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "secondary.main",
                  color: "secondary.main",
                },
              }}
            >
              Login
            </Button>
          </Link>

          <Link href="/signup" passHref style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                background: gradient,
                "&:hover": {
                  background: gradientHover,
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Sign Up
            </Button>
          </Link>
        </>
        {/* )} */}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        component="nav"
        elevation={0}
        sx={{
          backgroundColor: "transparent",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "primary.main" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Brand */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BookOpen size={32} color={theme.palette.primary.main} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background: gradient,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  PathFinder
                </Typography>
              </Link>
            </motion.div>
          </Box>

          {/* Mobile Logo */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <BookOpen size={32} color={theme.palette.primary.main} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PathFinder
            </Typography>
          </Box>

          <Box sx={{ mx: 2 }}>
            <ThemeSwitcher />
          </Box>

          {/* Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: { sm: 2, md: 3 },
              alignItems: "center",
            }}
          >
            <Link href="#about" style={{ textDecoration: "none" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "primary.main",
                  transition: "color 0.3s ease",
                }}
              >
                About
              </Typography>
            </Link>

            <Link href="#features" style={{ textDecoration: "none" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "primary.main",
                  transition: "color 0.3s ease",
                }}
              >
                Features
              </Typography>
            </Link>

            <Link href="/login" style={{ textDecoration: "none" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "primary.main",
                  transition: "color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Users size={16} />
                Find Mentors
              </Typography>
            </Link>

            {/* Authentication Buttons */}
            {/* {user ? (
                <UserMenu/>
            ) : ( */}
            <>
              <Link href="/login" passHref style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: "secondary.main",
                      color: "secondary.main",
                    },
                  }}
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup" passHref style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    background: gradient,
                    "&:hover": {
                      background: gradientHover,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
            {/* )} */}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}
