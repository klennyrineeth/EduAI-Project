import React from 'react';
import { Brain, Globe, Zap, Clock, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Content Generation',
    description: 'Advanced algorithms create engaging educational videos tailored to your curriculum'
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Automatically translate content into multiple languages for global accessibility'
  },
  {
    icon: Zap,
    title: 'Real-time Adaptability',
    description: 'Content adjusts based on student performance and learning patterns'
  },
  {
    icon: Clock,
    title: 'Time-Saving',
    description: 'Generate hours of quality content in minutes, not days'
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Foster engagement through interactive video experiences'
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'AI-generated content reviewed for educational standards compliance'
  }
];

export function Features() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Modern Education</h2>
          <p className="text-xl text-gray-600">Discover how our AI technology revolutionizes educational content creation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}