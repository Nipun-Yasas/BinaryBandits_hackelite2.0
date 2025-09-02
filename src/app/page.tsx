"use client";

import { useEffect, useState } from "react";

import About from "./_components/landing/About";
import Features from "./_components/landing/Features";
import Header from "./_components/landing/Header";
import Hero from "./_components/landing/Hero";
import Stats from "./_components/landing/Stats";
import Testimonials from "./_components/landing/Testimonial";
import CallToAction from "./_components/landing/CallToAction";
import Footer from "./_components/landing/Footer";
import { Box } from "@mui/material";

import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";

export default function Home() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const isReady = pageLoaded && minDelayPassed;

  useEffect(() => {
    const t = window.setTimeout(() => setMinDelayPassed(true), 1000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onLoad = () => setPageLoaded(true);

    if (document.readyState === "complete") {
      setPageLoaded(true);
      return;
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  if (!isReady) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#f8f9fa",
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Cardio size="50" stroke="4" speed="2" color="#8073fa" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Header />
      <Hero />
      <Stats />
      <About />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </Box>
  );
}
