"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import BackgroundShape from "../_components/background/BackgroundShape";

import MarketingPanel from "./components/MarketingPanel";
import LoginCard from "./components/LoginCard";
import FloatingSparkle from "./components/FloatingSparkle";
import FloatingBook from "./components/FloatingBook";

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (response.ok) {
        // Get user info to check role
        const userResponse = await fetch("/api/auth/me");
        const userData = await userResponse.json();

        if (userData.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    { icon: Users, value: "2,800+", label: "Students Guided" },
    { icon: Award, value: "1,250+", label: "Careers Explored" },
    { icon: TrendingUp, value: "4.8★", label: "Avg. Rating" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <BackgroundShape
        className="shape2"
        color={theme.palette.secondary.main}
        opacity="0.15"
        width={600}
        height={300}
        cx={300}
        cy={150}
        rx={250}
        ry={120}
      />

      {/* Floating elements */}
      <FloatingSparkle
        sx={{
          position: "absolute",
          top: "10%",
          right: "15%",
          zIndex: 1,
        }}
      />
      <FloatingBook
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          zIndex: 1,
        }}
      />

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 6,
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          {!isMobile && <MarketingPanel />}
          <LoginCard />
        </Box>
      </Container>

      {/* CSS for shape animations */}
      <style jsx global>{`
        .shape1 {
          animation: float1 8s ease-in-out infinite;
        }
        .shape2 {
          animation: float2 10s ease-in-out infinite;
        }
        .shape3 {
          animation: float3 12s ease-in-out infinite;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-40px, -20px) rotate(180deg);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -40px) rotate(90deg);
          }
          50% {
            transform: translate(-30px, -20px) rotate(180deg);
          }
          75% {
            transform: translate(-10px, 30px) rotate(270deg);
          }
        }
      `}</style>
    </Box>
  );
}
