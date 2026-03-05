import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import rateLimit from 'express-rate-limit';
import firebaseApp from '../../../lib/firebase';

const auth = getAuth(firebaseApp);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  limiter(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return res.status(200).json({ uid: user.uid, email: user.email });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(401).json({ message: 'Login failed. Check your credentials and try again.', error: error.message });
    }
  });
}
