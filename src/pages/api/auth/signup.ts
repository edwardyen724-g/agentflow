import type { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import db from "../../../lib/firestore";

void db;

function isPasswordStrong(pw: string) {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw);
}

function isValidEmail(email: string) {
  return /^[^s@]+@[^s@]+.[^s@]+$/.test(email);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email format" });
  if (!isPasswordStrong(password)) return res.status(400).json({ error: "Password must be 8+ chars with uppercase, lowercase, and numbers" });

  try {
    const user = await admin.auth().createUser({ email, password });
    return res.status(201).json({ message: "User created successfully", uid: user.uid });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signup failed";
    console.error("Signup error:", msg);
    return res.status(500).json({ error: "An error occurred during signup. Please try again." });
  }
}
