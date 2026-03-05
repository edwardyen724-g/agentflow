import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { FirebaseAppProvider } from 'reactfire';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AgentFlow',
  description: 'Streamline your AI agents\' tasks and schedules with ease.',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseAppProvider firebaseConfig={{
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    }}>
      <AuthProvider>
        <html lang="en" className={inter.className}>
          <body className="bg-gray-100 text-gray-800">
            <header className="p-4 bg-white shadow-md">
              <h1 className="text-2xl font-bold">Take Control of Your AI Agents with AgentFlow</h1>
            </header>
            <main className="flex flex-col items-center justify-center min-h-screen">
              {children}
            </main>
            <Toaster />
            <footer className="p-4 bg-white shadow-md">
              <p className="text-center text-sm">© {new Date().getFullYear()} AgentFlow. All rights reserved.</p>
            </footer>
          </body>
        </html>
      </AuthProvider>
    </FirebaseAppProvider>
  );
};

export default Layout;
