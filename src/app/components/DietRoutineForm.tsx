'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DietRoutineFormData {
  dietaryRestrictions: string[];
  activityLevel: string;
  healthGoal: string;
  weight?: number;
  height?: number;
  allergies?: string[];
  healthConcerns: string[];
  currentSymptoms: string;
  stressLevel: string;
  sleepQuality: string;
}

interface DietRoutineFormProps {
  onSubmit: (data: DietRoutineFormData) => void;
}

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Lightly active (light exercise 1-3 days/week)' },
  { value: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)' },
  { value: 'very', label: 'Very active (hard exercise 6-7 days/week)' },
  { value: 'extra', label: 'Extra active (very hard exercise & physical job)' }
];

const dietaryRestrictions = [
  'Vegan',
  'Vegetarian',
  'Pescatarian',
  'Gluten-free',
  'Dairy-free',
  'Keto',
  'Paleo',
  'None'
];

const commonHealthConcerns = [
  'Digestive Issues',
  'Sleep Problems',
  'Anxiety/Stress',
  'Joint Pain',
  'Headaches',
  'Fatigue',
  'High Blood Pressure',
  'Diabetes',
  'Skin Issues',
  'Allergies',
  'Weight Management',
  'Immune System Support'
];

const stressLevels = [
  { value: 'low', label: 'Low - Generally relaxed' },
  { value: 'moderate', label: 'Moderate - Occasionally stressed' },
  { value: 'high', label: 'High - Frequently stressed' },
  { value: 'severe', label: 'Severe - Constantly stressed' }
];

const sleepQualities = [
  { value: 'excellent', label: 'Excellent - 7-9 hours of quality sleep' },
  { value: 'good', label: 'Good - 6-7 hours with occasional disruptions' },
  { value: 'fair', label: 'Fair - 5-6 hours or frequently disrupted' },
  { value: 'poor', label: 'Poor - Less than 5 hours or very disrupted' }
];

export default function DietRoutineForm({ onSubmit }: DietRoutineFormProps) {
  const [form, setForm] = useState<DietRoutineFormData>({
    dietaryRestrictions: [],
    activityLevel: 'sedentary',
    healthGoal: '',
    weight: undefined,
    height: undefined,
    allergies: [],
    healthConcerns: [],
    currentSymptoms: '',
    stressLevel: 'moderate',
    sleepQuality: 'good'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleDietaryRestrictionChange = (restriction: string) => {
    setForm(prev => {
      if (prev.dietaryRestrictions.includes(restriction)) {
        return {
          ...prev,
          dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
        };
      }
      return {
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction]
      };
    });
  };

  const handleHealthConcernChange = (concern: string) => {
    setForm(prev => {
      if (prev.healthConcerns.includes(concern)) {
        return {
          ...prev,
          healthConcerns: prev.healthConcerns.filter(c => c !== concern)
        };
      }
      return {
        ...prev,
        healthConcerns: [...prev.healthConcerns, concern]
      };
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">Personalize Your Health & Wellness Plan</h2>
        
        <div className="space-y-6">
          {/* Health Concerns Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Health & Wellness</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Concerns
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonHealthConcerns.map((concern) => (
                    <label
                      key={concern}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.healthConcerns.includes(concern)}
                        onChange={() => handleHealthConcernChange(concern)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Symptoms (if any)
                </label>
                <textarea
                  value={form.currentSymptoms}
                  onChange={(e) => setForm({ ...form, currentSymptoms: e.target.value })}
                  placeholder="Describe any current symptoms or health issues you'd like to address..."
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stress Level
                  </label>
                  <select
                    value={form.stressLevel}
                    onChange={(e) => setForm({ ...form, stressLevel: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {stressLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Quality
                  </label>
                  <select
                    value={form.sleepQuality}
                    onChange={(e) => setForm({ ...form, sleepQuality: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {sleepQualities.map((quality) => (
                      <option key={quality.value} value={quality.value}>
                        {quality.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Original Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dietaryRestrictions.map((restriction) => (
                  <label
                    key={restriction}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.dietaryRestrictions.includes(restriction)}
                      onChange={() => handleDietaryRestrictionChange(restriction)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{restriction}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                value={form.activityLevel}
                onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Goal
              </label>
              <input
                type="text"
                value={form.healthGoal}
                onChange={(e) => setForm({ ...form, healthGoal: e.target.value })}
                placeholder="e.g., Weight loss, Muscle gain, Better energy, Reduce stress"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={form.weight || ''}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                  placeholder="Enter weight in kg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={form.height || ''}
                  onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
                  placeholder="Enter height in cm"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies (comma-separated)
              </label>
              <input
                type="text"
                value={form.allergies?.join(', ') || ''}
                onChange={(e) => setForm({ ...form, allergies: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="e.g., nuts, shellfish, eggs"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate Personalized Plan
          </button>
        </div>
      </div>
    </motion.form>
  );
} 