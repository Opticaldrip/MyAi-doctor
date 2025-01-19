import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.proxyapi.ai/openai',
});

const DEEPSEEK_API_URL = 'https://api.proxyapi.ai/deepseek/v1/chat/completions';

async function getDeepSeekRecommendations(prompt: string) {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-v3',
        messages: [
          {
            role: 'system',
            content: 'You are a holistic health consultant specializing in natural remedies and traditional medicine. Focus on providing specific natural remedies, herbs, and traditional treatments for health concerns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from DeepSeek API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      dietaryRestrictions, 
      activityLevel, 
      healthGoal,
      weight,
      height,
      allergies,
      healthConcerns,
      currentSymptoms,
      stressLevel,
      sleepQuality
    } = body;

    // Create prompts for both models
    const basePrompt = `
    Personal Information:
    - Dietary Restrictions: ${dietaryRestrictions.join(', ')}
    - Activity Level: ${activityLevel}
    - Health Goal: ${healthGoal}
    - Weight: ${weight}kg
    - Height: ${height}cm
    - Allergies: ${allergies?.join(', ') || 'None'}
    
    Health Status:
    - Health Concerns: ${healthConcerns.join(', ')}
    - Current Symptoms: ${currentSymptoms || 'None reported'}
    - Stress Level: ${stressLevel}
    - Sleep Quality: ${sleepQuality}`;

    // Get natural remedies recommendations from DeepSeek
    const naturalRemediesPrompt = `Based on the following user profile, provide specific natural remedies, herbs, and traditional treatments for their health concerns and symptoms:
    ${basePrompt}
    
    Focus on:
    1. Traditional medicine recommendations
    2. Herbal remedies for specific symptoms
    3. Essential oils and aromatherapy
    4. Natural supplements
    5. Home remedies
    
    Format the response in markdown.`;

    const deepseekResponse = await getDeepSeekRecommendations(naturalRemediesPrompt);

    // Get lifestyle and diet recommendations from OpenAI
    const openaiPrompt = `As a holistic health consultant, create a comprehensive wellness plan for a person with the following profile:
    ${basePrompt}

    Please provide a comprehensive wellness plan including:
    
    1. Lifestyle Recommendations:
       - Sleep hygiene tips
       - Stress reduction practices
       - Mind-body exercises
       - Daily wellness routines
    
    2. Diet Plan:
       - 7-day meal plan
       - Foods that help address their health concerns
       - Foods to avoid
    
    3. Exercise Routine:
       - Weekly exercise plan
       - Gentle movement recommendations
       - Stretching and mobility exercises
    
    4. Progress Monitoring:
       - Signs of improvement to watch for
       - Warning signs to be aware of
       - When to seek professional medical care
    
    Format the response in markdown. Include disclaimers about consulting healthcare providers when necessary.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a holistic health consultant with expertise in nutrition, fitness, and wellness. Provide comprehensive, evidence-based health solutions while being mindful of safety and medical limitations."
        },
        {
          role: "user",
          content: openaiPrompt
        }
      ],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Combine both responses
    const combinedPlan = `
# Your Personalized Wellness Plan

## Natural Remedies and Traditional Treatments
${deepseekResponse || ''}

## Lifestyle and Diet Recommendations
${completion.choices[0].message.content}

---
*Disclaimer: This plan is for informational purposes only and should not replace professional medical advice. Always consult with healthcare providers before starting any new health regimen.*
    `;

    return NextResponse.json({
      plan: combinedPlan
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
} 