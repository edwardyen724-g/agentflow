import type { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import db from "../../../lib/firestore";
import validator from 'validator';
import { NextCors } from 'nextjs-cors';

void db;

function isPasswordStrong(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!isPasswordStrong(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters and include uppercase, lowercase, and numbers.",
    });
  }

  try {
    const user = await admin.auth().createUser({ email, password });
    return res.status(201).json({ message: "User created successfully", uid: user.uid });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "An error occurred during signup. Please try again." });
  }
}