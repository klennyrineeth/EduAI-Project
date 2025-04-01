import React from 'react';
import { Upload, Cpu, Video, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Content',
    description: 'Submit your educational materials and curriculum requirements'
  },
  {
    icon: Cpu,
    title: 'AI Processing',
    description: 'Our AI analyzes and transforms content into engaging video lessons'
  },
  {
    icon: Video,
    title: 'Image & Video Generation',
    description: 'High-quality educational images and videos are created automatically'
  },
  {
    icon: CheckCircle,
    title: 'Ready to Use',
    description: 'Download or stream your AI-generated educational content'
  }
];

export function HowItWorks() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Simple steps to transform your educational content</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <step.icon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-purple-200" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}