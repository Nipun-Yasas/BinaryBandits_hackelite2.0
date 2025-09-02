"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useLocale } from "./LocaleContext";

type Dict = Record<string, any>;

const messages: Record<"enUS" | "siLK", Dict> = {
  enUS: {
    nav: {
      about: "About",
      features: "Features",
      findMentors: "Find Mentors",
      login: "Login",
      signUp: "Sign Up",
    },
    hero: {
      title: "PathFinder for Students in Sri Lanka",
      subtitle:
        "Take a career assessment, get personalized suggestions, explore careers, and follow step‑by‑step learning paths. Download your report, switch Sinhala/English, chat with an AI career guide, and connect with a supportive community. Profiles for students, teachers, and parents.",
      features: [
        "Career Quiz",
        "Career Explorer",
        "PDF Report",
        "සිංහල / English",
        "AI Chatbot",
        "Community",
      ],
      startQuiz: "Start Career Quiz",
      exploreCareers: "Explore Careers",
      imgAlt: "PathFinder – Career guidance for Sri Lankan students",
    },
    stats: {
      title: "Guiding Futures, At Scale",
      subtitle:
        "Join thousands using PathFinder to discover careers, explore study routes, and make informed decisions.",
      studentsGuided: "Students Guided",
      careersExplored: "Careers Explored",
      reportsGenerated: "Reports Generated",
      satisfactionRating: "Satisfaction Rating",
    },
    about: {
      overline: "ABOUT PATHFINDER",
      title: "Career guidance built for Sri Lankan students",
      subtitle:
        "PathFinder evaluates your interests and strengths to suggest careers, explains subject choices and study routes, and provides bilingual guidance with a downloadable report. Students, teachers, and parents can collaborate to make confident decisions.",
      features: [
        {
          title: "Career Assessment Quiz",
          desc: "Personality and interest‑based quiz maps you to suitable career clusters aligned with Sri Lankan streams.",
        },
        {
          title: "Career Explorer",
          desc: "Search and filter careers with job info, required subjects, local pathways, and prospects.",
        },
        {
          title: "Downloadable Report",
          desc: "Export a personalized PDF with quiz results, career suggestions, and learning paths.",
        },
        {
          title: "Sinhala / English",
          desc: "Bilingual content throughout quizzes, careers, and reports. Tamil planned in a future phase.",
        },
        {
          title: "Profiles & Authentication",
          desc: "Secure accounts for students, teachers, and parents. Save attempts, bookmarks, and reports.",
        },
        {
          title: "Community Forum",
          desc: "Ask questions, share tips, and upvote helpful answers in a moderated space.",
        },
        {
          title: "AI Career Guidance Chatbot",
          desc: "Get local, Sri Lanka‑aware answers like subject combinations, in Sinhala or English.",
        },
      ],
      startQuiz: "Start the Quiz",
      imgAlt: "Discover careers and learning paths",
    },
    features: {
      title: "PathFinder features",
      subtitle: "Built for Sri Lankan students, teachers, and parents",
      viewDetails: "View Details",
      items: [
        {
          icon: "https://unpkg.com/lucide-static@latest/icons/brain-circuit.svg",
          title: "Career Assessment Quiz",
          description:
            "Interactive, interest‑based quiz mapping you to suitable career clusters.",
        },
        {
          icon: "https://unpkg.com/lucide-static@latest/icons/stars.svg",
          title: "Personalized Suggestions",
          description: "Ranked career recommendations for Sri Lanka.",
        },
        {
          icon: "https://unpkg.com/lucide-static@latest/icons/route.svg",
          title: "Learning Paths",
          description:
            "Step‑by‑step guidance: A/L subjects, degrees, diplomas, and vocational routes in Sri Lanka.",
        },
        {
          icon: "https://unpkg.com/lucide-static@latest/icons/bot.svg",
          title: "AI Career Chatbot",
          description:
            "Ask in Sinhala or English about subjects, pathways, and in‑demand jobs in Sri Lanka.",
        },
      ],
    },
    callToAction: {
      title: "Start your Path with PathFinder",
      subtitle:
        "Take the career quiz, explore options, and follow learning paths tailored to Sri Lanka.",
      body: "Get personalized career suggestions, A/L subject guidance, and bilingual support (සිංහල / English). Download your report, ask our AI chatbot, and engage with a supportive community.",
      quizBtn: "Start Career Quiz",
      careersBtn: "Explore Careers",
      imgAlt: "Students discovering careers with PathFinder",
    },
    footer: {
      brand: "PathFinder",
      tagline: "Career guidance for Sri Lankan students.",
      contact: "Contact",
      address: "Colombo, Sri Lanka",
      product: "Product",
      about: "About PathFinder",
      quiz: "Career Quiz",
      explorer: "Career Explorer",
      paths: "Learning Paths",
      chatbot: "AI Chatbot",
      forum: "Community Forum",
      support: "Support",
      help: "Help Center",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      language: "Sinhala / English",
      copyright: "All rights reserved.",
      privacyShort: "Privacy",
      termsShort: "Terms",
      contactShort: "Contact",
    },
    chatbot: {
      title: "PathFinder Assistant",
      message:
        "Hello! I'm your PathFinder Assistant. I can help you explore and navigate the platform. You can ask me about anything.",
      loading: "Generating reply...",
      textareaPlaceholder: "Ask about anything.",
      button:'send'
    },
  },
  siLK: {
    nav: {
      about: "අප ගැන",
      features: "විශේෂාංග",
      findMentors: "මඟ පෙන්වන්නන් සොයන්න",
      login: "ඇතුල් වන්න",
      signUp: "ලියාපදිංචි වන්න",
    },
    hero: {
      title: "PathFinder ශ්‍රී ලංකා සිසුන් සඳහා",
      subtitle:
        "කාර්ය මාර්ග ඇසුරුම්, පුද්ගලික නිර්දේශ, රැකියා සෙවීම, පියවරෙන් පියවර ඉගෙනුම් මාර්ග. ඔබේ වාර්තාව බාගන්න, සිංහල/ඉංග්‍රීසි මාරු කරන්න, AI මඟ පෙන්වන්නා සමඟ කතා කරන්න, සහය දක්වන ප්‍රජාවක් සමඟ සම්බන්ධ වන්න. සිසුන්, ගුරුවරුන් සහ දෙමාපියන් සඳහා පැතිකඩ.",
      features: [
        "කාර්ය මාර්ග ඇසුරුම්",
        "රැකියා සෙවීම",
        "PDF වාර්තාව",
        "සිංහල / English",
        "AI මඟ පෙන්වන්නා",
        "ප්‍රජාව",
      ],
      startQuiz: "කාර්ය මාර්ග ඇසුරුම් අරඹන්න",
      exploreCareers: "රැකියා සෙවීම",
      imgAlt: "PathFinder – ශ්‍රී ලංකා සිසුන් සඳහා කාර්ය මාර්ග මඟ පෙන්වීම",
    },
    stats: {
      title: "අනාගතය සඳහා මඟ පෙන්වීම",
      subtitle:
        "PathFinder භාවිතා කරන දහස් ගණනක් සිසුන්ට රැකියා සෙවීම, ඉගෙනුම් මාර්ග සෙවීම සහ නිවැරදි තීරණ ගැනීම සඳහා එකතු වන්න.",
      studentsGuided: "මඟ පෙන්වා ඇති සිසුන්",
      careersExplored: "සෙවූ රැකියා",
      reportsGenerated: "නිපදවා ඇති වාර්තා",
      satisfactionRating: "සතුටුදායක ශ්‍රේණිගත කිරීම",
    },
    about: {
      overline: "PATHFINDER ගැන",
      title: "ශ්‍රී ලංකා සිසුන් සඳහා නිර්මාණය කළ කාර්ය මාර්ග මඟ පෙන්වීම",
      subtitle:
        "PathFinder ඔබේ රුචිකත්වයන් සහ ශක්තිමත් පැති සලකා බලමින් රැකියා නිර්දේශ කරයි, විෂය තේරීම් සහ ඉගෙනුම් මාර්ග පැහැදිලි කරයි, දෙබසින් මාර්ගෝපදේශනය සහ බාගත කළ හැකි වාර්තාවක් ලබා දෙයි. සිසුන්, ගුරුවරුන් සහ දෙමාපියන්ට විශ්වාසයෙන් තීරණ ගැනීමට සහය.",
      features: [
        {
          title: "කාර්ය මාර්ග ඇසුරුම් ප්‍රශ්නාවලිය",
          desc: "පෞරුෂය සහ රුචිකත්වයන් මත පදනම් වූ ප්‍රශ්නාවලිය ඔබට සුදුසු රැකියා කණ්ඩායම් සෙවීම සඳහා.",
        },
        {
          title: "රැකියා සෙවීම",
          desc: "රැකියා තොරතුරු, අවශ්‍ය විෂයයන්, දේශීය මාර්ග සහ අවස්ථා අනුව සෙවීම සහ පෙරහන් කිරීම.",
        },
        {
          title: "බාගත කළ හැකි වාර්තාව",
          desc: "ප්‍රශ්නාවලිය ප්‍රතිඵල, රැකියා නිර්දේශ සහ ඉගෙනුම් මාර්ග සහිත පුද්ගලික PDF එකක් බාගන්න.",
        },
        {
          title: "සිංහල / ඉංග්‍රීසි",
          desc: "ප්‍රශ්නාවලි, රැකියා සහ වාර්තා තුළ දෙබසින් අන්තර්ගතය. ඉදිරියේදී දෙමළද එක් කිරීමට සැලසුම් කර ඇත.",
        },
        {
          title: "පැතිකඩ සහ ඇතුළු වීම",
          desc: "සිසුන්, ගුරුවරුන් සහ දෙමාපියන් සඳහා ආරක්ෂිත ගිණුම්. උත්සාහ, පොත් සලකුණු සහ වාර්තා සුරකින්න.",
        },
        {
          title: "ප්‍රජා වේදිකාව",
          desc: "ප්‍රශ්න අසන්න, උපදෙස් බෙදා ගන්න, සහ උපකාරක පිළිතුරු උසස් කරන්න.",
        },
        {
          title: "AI කාර්ය මාර්ග මඟ පෙන්වන්නා",
          desc: "දේශීය, ශ්‍රී ලංකා‑අනුවාද පිළිතුරු ලබා ගන්න, විෂය සංයෝජන වැනි, සිංහල හෝ ඉංග්‍රීසි භාෂාවෙන්.",
        },
      ],
      startQuiz: "ප්‍රශ්නාවලිය අරඹන්න",
      imgAlt: "රැකියා සහ ඉගෙනුම් මාර්ග සොයන්න",
    },
    features: {
      title: "PathFinder විශේෂාංග",
      subtitle: "ශ්‍රී ලංකා සිසුන්, ගුරුවරුන් සහ දෙමාපියන් සඳහා නිර්මාණය කළ",
      viewDetails: "විස්තර බලන්න",
      items: [
        {
          icon: "https://unpkg.com/lucide-static@latest/icons/brain-circuit.svg",
          title: "කාර්ය මාර්ග ඇසුරුම් ප්‍රශ්නාවලිය",
          description:
            "රුචිකත්වයන් මත පදනම් වූ අන්තර්ක්‍රියාත්මක ප්‍රශ්නාවලිය.",
        },
        {
          icon: "https://unpkg.com/lucide-static@latest/icons/stars.svg",
          title: "පුද්ගලික නිර්දේශ",
          description: "ශ්‍රී ලංකාව සඳහා රැකියා නිර්දේශ.",
        },
        {
          icon: "https://unpkg.com/lucide-static@latest/icons/route.svg",
          title: "ඉගෙනුම් මාර්ග",
          description:
            "පියවරෙන් පියවර මාර්ගෝපදේශනය: A/L විෂයයන්, උපාධි, ඩිප්ලෝමා සහ වෘත්තීය මාර්ග.",
        },
        {
          icon: "https://unpkg.com/lucide-static@latest/icons/bot.svg",
          title: "AI කාර්ය මාර්ග චැට්බොට්",
          description:
            "විෂයයන්, මාර්ග සහ ඉල්ලුම් රැකියා ගැන සිංහල හෝ ඉංග්‍රීසි භාෂාවෙන් අසන්න.",
        },
      ],
    },
    callToAction: {
      title: "PathFinder සමඟ ඔබේ මාර්ගය ආරම්භ කරන්න",
      subtitle:
        "කාර්ය මාර්ග ප්‍රශ්නාවලිය අරඹන්න, විකල්ප සොයන්න, ශ්‍රී ලංකාවට අදාළ ඉගෙනුම් මාර්ග අනුගමනය කරන්න.",
      body: "පුද්ගලික රැකියා නිර්දේශ, A/L විෂය මාර්ගෝපදේශනය, දෙබසින් සහය (සිංහල / ඉංග්‍රීසි). ඔබේ වාර්තාව බාගන්න, AI චැට්බොට් අසන්න, සහය දක්වන ප්‍රජාවක් සමඟ සම්බන්ධ වන්න.",
      quizBtn: "කාර්ය මාර්ග ප්‍රශ්නාවලිය අරඹන්න",
      careersBtn: "රැකියා සොයන්න",
      imgAlt: "PathFinder සමඟ රැකියා සොයන සිසුන්",
    },
    footer: {
      brand: "PathFinder",
      tagline: "ශ්‍රී ලංකා සිසුන් සඳහා කාර්ය මාර්ග මඟ පෙන්වීම.",
      contact: "සම්බන්ධ වන්න",
      address: "කොළඹ, ශ්‍රී ලංකාව",
      product: "නිෂ්පාදනය",
      about: "PathFinder ගැන",
      quiz: "කාර්ය මාර්ග ප්‍රශ්නාවලිය",
      explorer: "රැකියා සෙවීම",
      paths: "ඉගෙනුම් මාර්ග",
      chatbot: "AI චැට්බොට්",
      forum: "ප්‍රජා වේදිකාව",
      support: "සහාය",
      help: "උදව් මධ්‍යස්ථානය",
      privacy: "රහස්‍යතා ප්‍රතිපත්තිය",
      terms: "සේවා නියමයන්",
      language: "සිංහල / ඉංග්‍රීසි",
      copyright: "සියලු හිමිකම් ඇවිරිණි.",
      privacyShort: "රහස්‍යතා",
      termsShort: "නියමයන්",
      contactShort: "සම්බන්ධ වන්න",
    },
    chatbot: {
      title: "PathFinder උදව්කරු",
      message:
        "ආයුබෝවන්! මම ඔබේ PathFinder උදව්කරු. මම ඔබට වේදිකාව සොයා බැලීමට සහ මාර්ගෝපදේශ ලබා ගැනීමට උදව් කළ හැකිය. ඔබට ඕනෑම දෙයක් ගැන මට අසන්න.",
      loading: "පිළිතුර ජනනය වෙමින්...",
      textareaPlaceholder: "ඕනෑම දෙයක් අසන්න.",
      button: "යවන්න"
    },
  },
};

function get(obj: Dict, path: string, fallback?: any) {
  return (
    path.split(".").reduce((acc, key) => acc?.[key] ?? undefined, obj) ??
    fallback
  );
}

type I18nCtx = { t: (key: string, fallback?: any) => any };
const I18nContext = createContext<I18nCtx>({ t: (_k, fb) => fb });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const dict = messages[locale] ?? messages.enUS;
  const value = useMemo<I18nCtx>(
    () => ({ t: (key, fb) => get(dict, key, fb) }),
    [dict]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
