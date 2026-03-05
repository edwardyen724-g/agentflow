import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth, firebase } from 'firebase/auth';
import 'tailwindcss/tailwind.css';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isPasswordStrong = (password: string): boolean => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isPasswordStrong(password)) {
      setError('Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.');
      setLoading(false);
      return;
    }

    try {
      const auth: Auth = firebase.auth();
      await auth.createUserWithEmailAndPassword(email, password);
      router.push('/dashboard'); // Redirect to dashboard after signup
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Sign Up for AgentFlow</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">{loading ? 'Loading...' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
