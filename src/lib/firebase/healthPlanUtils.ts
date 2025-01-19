import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';

export interface HealthPlanData {
  userId: string;
  createdAt: Date;
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
  generatedPlan: string;
}

export async function saveHealthPlan(userId: string, formData: any, generatedPlan: string) {
  try {
    const healthPlanData: HealthPlanData = {
      userId,
      createdAt: new Date(),
      ...formData,
      generatedPlan
    };

    const docRef = await addDoc(collection(db, 'healthPlans'), {
      ...healthPlanData,
      createdAt: Timestamp.fromDate(healthPlanData.createdAt)
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving health plan:', error);
    throw error;
  }
}

export async function getUserHealthPlans(userId: string) {
  try {
    const q = query(
      collection(db, 'healthPlans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user health plans:', error);
    throw error;
  }
}

export async function getHealthPlan(planId: string) {
  try {
    const docRef = doc(db, 'healthPlans', planId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Health plan not found');
    }
  } catch (error) {
    console.error('Error getting health plan:', error);
    throw error;
  }
} 