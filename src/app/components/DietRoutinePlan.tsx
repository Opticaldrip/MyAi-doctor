'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface DietRoutinePlanProps {
  plan: string;
  onReset: () => void;
}

export default function DietRoutinePlan({ plan, onReset }: DietRoutinePlanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown>{plan}</ReactMarkdown>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Generate New Plan
        </button>
      </div>
    </motion.div>
  );
} 