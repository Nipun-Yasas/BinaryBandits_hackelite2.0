"use client";

import { useState, MouseEvent } from "react";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../_providers/AuthProvider";


const UserMenu: React.FC = () => {
  const {user,logout} = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const menuLinkHref = isHome ? "/dashboard" : "/profile";
  const menuLabel = isHome ? "Dashboard" : "My Profile";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      logout();
    } catch {}
    setAnchorEl(null);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Divider orientation="vertical" flexItem />

      <Box
        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={handleOpenMenu}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            {user?.name}
          </Avatar>
          <Typography
            variant="body1"
            color="#737791"
            fontFamily="'Poppins-Medium', Helvetica"
            fontWeight={500}
            sx={{
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={user?.name}
          >
            {user?.name}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              color: "text.secondary",
              fontSize: 18,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </Stack>
      </Box>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            width: 220,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} href={menuLinkHref}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" sx={{ color: "#737791" }} />
          </ListItemIcon>
          <Typography variant="body2" color="text.primary">
            {menuLabel}
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout} sx={{ color: "primary.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <Typography variant="body2">Log out</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default UserMenu;
