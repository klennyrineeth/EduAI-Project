import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Transform Education with
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> AI-Powered</span> Learning
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Create engaging, personalized video content for digital boards using advanced AI technology. Revolutionize how students learn and teachers teach.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-purple-900 px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
              Try Demo <Play size={16} />
            </button>
            <button className="border border-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-white hover:bg-opacity-10 transition-all">
              Learn More <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}