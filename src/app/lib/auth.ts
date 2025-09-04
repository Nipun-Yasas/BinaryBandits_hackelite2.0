import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  user?: {
    id: string;
    email: string;
    role: "user" | "admin";
    name?: string;
  };
}

const defaultSession: SessionData = {};

export async function getSession() {
  const sessionSecret = process.env.SESSION_SECRET;
  
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET environment variable is required. Please add it to your .env.local file.");
  }

  const session = await getIronSession<SessionData>(await cookies(), {
    password: sessionSecret,
    cookieName: "pathfinder-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  });

  if (!session.user) {
    session.user = defaultSession.user;
  }

  return session;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}