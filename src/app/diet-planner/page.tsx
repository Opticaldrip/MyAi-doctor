'use client';

import React, { useState } from 'react';
import DietRoutineForm from '../components/DietRoutineForm';
import DietRoutinePlan from '../components/DietRoutinePlan';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveHealthPlan, getUserHealthPlans } from '@/lib/firebase/healthPlanUtils';

interface FormData {
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

export default function DietPlannerPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  // Load user's saved plans
  React.useEffect(() => {
    async function loadSavedPlans() {
      if (user) {
        try {
          const plans = await getUserHealthPlans(user.uid);
          setSavedPlans(plans);
        } catch (err) {
          console.error('Error loading saved plans:', err);
        }
      }
    }
    loadSavedPlans();
  }, [user]);

  const handleSubmit = async (formData: FormData) => {
    if (!user) {
      setError('Please sign in to generate a health plan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      setPlan(data.plan);

      // Save the plan to Firebase
      await saveHealthPlan(user.uid, formData, data.plan);

      // Refresh saved plans
      const updatedPlans = await getUserHealthPlans(user.uid);
      setSavedPlans(updatedPlans);
    } catch (err) {
      setError('Failed to generate your plan. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Personalized Health & Wellness Planner
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Get a customized wellness plan with natural remedies and lifestyle recommendations
          </p>

          {!user && (
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Google to Start
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {user && !loading && !plan && <DietRoutineForm onSubmit={handleSubmit} />}
        
        {!loading && plan && <DietRoutinePlan plan={plan} onReset={handleReset} />}

        {/* Display saved plans */}
        {user && savedPlans.length > 0 && !plan && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Previous Plans</h2>
            <div className="space-y-6">
              {savedPlans.map((savedPlan: any) => (
                <div
                  key={savedPlan.id}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Plan from {new Date(savedPlan.createdAt.seconds * 1000).toLocaleDateString()}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Health Goal: {savedPlan.healthGoal}
                      </p>
                    </div>
                    <button
                      onClick={() => setPlan(savedPlan.generatedPlan)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 