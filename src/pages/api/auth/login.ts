import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../../../lib/firebase';

const auth = getAuth(firebaseApp);

export default async function login(req: NextApiRequest, res: NextApiResponse) {
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
    return res.status(401).json({ message: 'An error occurred during login. Please try again.' });
  }
}
