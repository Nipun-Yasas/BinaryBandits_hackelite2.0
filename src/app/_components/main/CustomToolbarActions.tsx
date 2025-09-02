import { useState } from 'react';
import { ThemeSwitcher } from '@toolpad/core';
import Box from '@mui/material/Box';
import UserMenu from './UserMenu';

import Button from "@mui/material/Button";
import LanguageIcon from "@mui/icons-material/Language";

import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useLocale } from "../../_providers/LocaleContext";
import { useI18n } from "../../_providers/I18nProvider";

export default function CustomToolbarActions() {
  const { locale, setLocale } = useLocale();
  const { t } = useI18n();
  const label = locale === "siLK" ? "SI" : "EN";

  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const openLang = Boolean(langAnchor);

  const handleOpenLang = (e: React.MouseEvent<HTMLElement>) => setLangAnchor(e.currentTarget);
  const handleCloseLang = () => setLangAnchor(null);
  const handleChoose = (value: "enUS" | "siLK") => {
    setLocale(value);
    handleCloseLang();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<LanguageIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenLang(e as any);
          }}
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": { borderColor: "secondary.main", color: "secondary.main" },
          }}
        >
          {label}
        </Button>
        <Menu anchorEl={langAnchor} open={openLang} onClose={handleCloseLang}>
          <MenuItem onClick={() => handleChoose("enUS")}>English (EN)</MenuItem>
          <MenuItem onClick={() => handleChoose("siLK")}>සිංහල (SI)</MenuItem>
        </Menu>
      </Box>
      <ThemeSwitcher />
      <UserMenu />
    </Box>
  );
}
