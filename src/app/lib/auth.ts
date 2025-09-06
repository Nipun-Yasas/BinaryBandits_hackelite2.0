import { IronSession, getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  user?: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
}

const sessionOptions = {
  password:
    process.env.IRON_SESSION_PASSWORD ||
    "complex_password_at_least_32_characters_long",
  cookieName: "hackelite_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function createSession(user: SessionData["user"]) {
  const session = await getSession();
  session.user = user;
  await session.save();
  return session;
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
  return session;
}
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
