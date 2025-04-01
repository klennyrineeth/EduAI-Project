import React from 'react';
import { motion } from 'framer-motion';

export function About() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About EduAI</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing education through AI-powered technology, making learning more engaging, 
            accessible, and effective for students and educators worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-600">
              To transform traditional education by leveraging artificial intelligence, 
              making quality education accessible to everyone, everywhere. We believe in 
              the power of technology to create immersive, personalized learning experiences 
              that inspire and empower the next generation.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            <p className="text-gray-600">
              We envision a future where every classroom is equipped with AI-powered tools 
              that enhance teaching and learning. A world where education knows no boundaries, 
              and where every student has access to personalized, engaging content that helps 
              them reach their full potential.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}