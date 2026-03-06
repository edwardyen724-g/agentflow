import type { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import db from "../../../lib/firestore";

void db;

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) return false;
  record.count++;
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const ip = (req.headers["x-forwarded-for"] as string) ?? req.socket.remoteAddress ?? "unknown";
  if (!checkRateLimit(ip)) return res.status(429).json({ message: "Too many login attempts. Try again later." });

  const { idToken } = req.body as { idToken?: string };
  if (!idToken) return res.status(400).json({ message: "idToken is required" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return res.status(200).json({ uid: decoded.uid, email: decoded.email });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    console.error("Login error:", msg);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
