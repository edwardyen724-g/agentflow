import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button';

const features = [
  {
    title: 'Visual Workflow Builder',
    description: 'Easily map out AI agent tasks for improved clarity and efficiency.',
  },
  {
    title: 'Automated Scheduling System',
    description: 'Prioritize tasks and set deadlines automatically to streamline operations.',
  },
  {
    title: 'Integration with Popular AI Tools',
    description: 'Seamlessly connect with TensorFlow, OpenAI API, and more for enhanced functionality.',
  },
  {
    title: 'Real-time Notifications',
    description: 'Stay updated on agent statuses with real-time alerts and updates.',
  },
  {
    title: 'User-friendly Dashboard',
    description: 'Monitor all agents at a glance with an intuitive interface.',
  },
];

const Page: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center p-8 bg-gray-100 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Take Control of Your AI Agents with AgentFlow</h1>
        <p className="text-lg text-gray-600">
          Streamline your AI agents' tasks and schedules with ease.
        </p>
        <Button className="mt-6" onClick={() => alert('Get Started Clicked!')}>
          Get Started
        </Button>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
      <footer className="mt-12 text-center">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} AgentFlow. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Page;