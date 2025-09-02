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
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

const UserMenu: React.FC = () => {
  const theme = useTheme();
  // const { user, logout } = useAuth();
  // const pathname = usePathname();
  // const isHome = pathname === "/";
  // const menuLinkHref = isHome ? "/dashboard" : "/profile";
  // const menuLabel = isHome ? "Dashboard" : "My Profile";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    handleCloseMenu();
    window.location.href = "/login";
  };

  // if (!user) {
  //   return null;
  // }

  const avatarGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Divider orientation="vertical" flexItem />

      <Box
        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={handleOpenMenu}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            // src={user.avatar || undefined}
            // alt={user.name}
            sx={{
              width: 40,
              height: 40,
              background: avatarGradient,
              fontSize: "1.2rem",
              fontWeight: 700,
              color: theme.palette.getContrastText(theme.palette.primary.main),
            }}
          >
            {/* {!user.avatar && <PersonOutlineIcon fontSize="small" />} */}
          </Avatar>
          <Typography
            variant="body1"
            color={theme.palette.text.secondary}
            fontFamily="'Poppins-Medium', Helvetica"
            fontWeight={500}
          >
            {/* {user.name.split(" ")[0]} */}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              color: "text.secondary",
              fontSize: 11,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </Stack>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            
            width: 200,
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
        {/* <Link href={menuLinkHref} passHref legacyBehavior>
          <MenuItem component="a">
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
            </ListItemIcon>
            <Typography variant="body2" color="text.primary">
              {menuLabel}
            </Typography>
          </MenuItem>
        </Link> */}

        <Divider sx={{ my: 1 }} />

        <MenuItem
          sx={{
            color: theme.palette.primary.main,
            "&:hover": {
              background: theme.palette.action.hover,
              color: theme.palette.secondary.main,
              "& .MuiListItemIcon-root": {
                color: theme.palette.secondary.main,
              },
            },
          }}
          onClick={handleLogout}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <Typography variant="body2">Log out</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default UserMenu;
