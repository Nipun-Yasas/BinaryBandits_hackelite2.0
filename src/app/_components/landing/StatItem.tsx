import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import CountUp from "react-countup";

interface StatItemProps {
  icon: string;
  number: number;
  text: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, number, text }) => {
  const theme = useTheme();

  return (
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        p: { xs: 1, md: 1.5 },
        borderRadius: 2,
      }}
    >
      {/* Icon wrapper with theme-based background and border */}
      <Box
        sx={{
          width: { xs: 56, md: 72 },
          height: { xs: 56, md: 72 },
          mb: 2,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.12)}`,
        }}
      >
        <Box
          component="img"
          src={icon}
          alt="Stat icon"
          sx={{
            width: { xs: 28, md: 36 },
            height: { xs: 28, md: 36 },
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          fontSize: { xs: "1.25rem", md: "1.5rem" },
          color: "primary.main",
          lineHeight: 1.1,
        }}
      >
        <CountUp end={number} duration={2} separator="," />+
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.8rem", md: "0.95rem" },
          mt: 1,
          color: "text.secondary",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default StatItem;
