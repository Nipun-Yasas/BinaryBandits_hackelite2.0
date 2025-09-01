import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BookOpen } from 'lucide-react';
import { useTheme } from '@mui/material/styles';


export default function CustomAppTitle() {
  const theme = useTheme();
  const gradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%', 
        px: 2,
        gap:5 
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
  );
}
