import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, initializeApp } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const isPasswordStrong = (password: string): boolean => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
  };

  if (!isPasswordStrong(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.' });
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    return res.status(201).json({ message: 'User created successfully', uid: userCredential.user.uid });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'An error occurred during signup. Please check your credentials and try again.' });
  }
}
