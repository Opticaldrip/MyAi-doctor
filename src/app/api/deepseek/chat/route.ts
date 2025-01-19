import { NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.proxyapi.ai/deepseek/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

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
            content: 'You are a holistic health consultant with expertise in natural medicine, nutrition, and wellness. Provide comprehensive, evidence-based natural health solutions while being mindful of safety and medical limitations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from DeepSeek API');
    }

    const data = await response.json();
    return NextResponse.json({
      response: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from DeepSeek' },
      { status: 500 }
    );
  }
} 