import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">
        {/* Traditional Blackboard Side */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gray-900 flex items-center justify-center p-8"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Traditional Teaching</h2>
            <p className="text-gray-300">Static content limited by physical constraints</p>
          </div>
        </motion.div>

        {/* Digital Board Side */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-8"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="relative text-white text-center">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Learning</h2>
            <p className="text-gray-100">Interactive content that adapts to student needs</p>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-white py-16"
      >
        <div className="max-w-2xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Teaching
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of education with AI-powered digital boards
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/live-demo"
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-purple-700 transition-colors"
            >
              Try Demo <Play size={16} />
            </Link>
            <Link
              to="/how-it-works"
              className="border border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-purple-50 transition-colors"
            >
              Learn More <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}