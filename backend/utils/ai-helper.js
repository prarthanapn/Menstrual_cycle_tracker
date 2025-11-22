// AI Integration Helper
// Uses OpenAI API if available, otherwise uses fallback rules

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Fallback triaging rules (if no OpenAI key)
const urgentKeywords = ['emergency', 'severe', 'severe pain', 'bleeding heavily', 'unconscious', 'fever over 103'];
const doctorKeywords = ['persistent pain', 'unusual bleeding', 'concerns', 'pregnant', 'medication'];

// Rule-based triage fallback
export const triageByRules = (message) => {
  const lower = message.toLowerCase();
  
  if (urgentKeywords.some(keyword => lower.includes(keyword))) {
    return 'urgent';
  }
  if (doctorKeywords.some(keyword => lower.includes(keyword))) {
    return 'see_doctor';
  }
  return 'normal';
};

// Get AI response using OpenAI or fallback
export const getAIResponse = async (userMessage) => {
  try {
    if (OPENAI_API_KEY) {
      // Use OpenAI API
      return await getOpenAIResponse(userMessage);
    } else {
      // Use fallback rule-based response
      return getFallbackResponse(userMessage);
    }
  } catch (error) {
    console.warn('AI API failed, using fallback:', error.message);
    return getFallbackResponse(userMessage);
  }
};

// Call OpenAI API for chat
const getOpenAIResponse = async (userMessage) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful menstrual health assistant. Answer questions about menstrual health, 
          provide general information, and when needed, advise seeing a doctor. Keep responses concise (2-3 sentences).`,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const botResponse = data.choices[0].message.content;
  const triageLevel = triageByRules(userMessage);

  return {
    bot_response: botResponse,
    triage_level: triageLevel,
  };
};

// Fallback rule-based response
const getFallbackResponse = (userMessage) => {
  const lower = userMessage.toLowerCase();
  let botResponse = '';

  if (lower.includes('cramp')) {
    botResponse = 'Cramps are common during menstruation. Try heat therapy, light exercise, or over-the-counter pain relief. If severe, consult a doctor.';
  } else if (lower.includes('heavy') || lower.includes('bleeding')) {
    botResponse = 'Heavy bleeding can be normal, but if it\'s affecting your daily life, please see a doctor for evaluation.';
  } else if (lower.includes('mood') || lower.includes('emotional')) {
    botResponse = 'Mood changes during your cycle are related to hormonal fluctuations. Regular exercise and stress management can help.';
  } else if (lower.includes('cycle') || lower.includes('period')) {
    botResponse = 'A typical menstrual cycle is 21-35 days. If your cycles are irregular, tracking them can help identify patterns.';
  } else {
    botResponse = 'Thank you for your question. For personalized medical advice, please consult a healthcare professional.';
  }

  const triageLevel = triageByRules(userMessage);
  return {
    bot_response: botResponse,
    triage_level: triageLevel,
  };
};

// Generate AI summary for reports
export const generateAISummary = async (user, cycles, symptoms) => {
  try {
    if (!OPENAI_API_KEY) {
      return generateFallbackSummary(cycles, symptoms);
    }

    // Calculate stats
    const avgCycleLength = cycles.length > 0
      ? Math.round(cycles.reduce((sum, c) => sum + (c.cycle_length || 0), 0) / cycles.length)
      : 0;

    const flowCounts = {};
    cycles.forEach(c => {
      flowCounts[c.flow_level] = (flowCounts[c.flow_level] || 0) + 1;
    });

    const symptomCounts = {};
    symptoms.forEach(s => {
      if (s.mood) symptomCounts[`Mood: ${s.mood}`] = (symptomCounts[`Mood: ${s.mood}`] || 0) + 1;
      if (s.cramps) symptomCounts['Cramps'] = (symptomCounts['Cramps'] || 0) + 1;
      if (s.headache) symptomCounts['Headache'] = (symptomCounts['Headache'] || 0) + 1;
      if (s.bloating) symptomCounts['Bloating'] = (symptomCounts['Bloating'] || 0) + 1;
    });

    const prompt = `Generate a brief 2-3 sentence health summary for a menstrual tracker report.
    Average cycle length: ${avgCycleLength} days
    Flow patterns: ${JSON.stringify(flowCounts)}
    Common symptoms: ${JSON.stringify(Object.entries(symptomCounts).slice(0, 3))}
    Provide actionable insight or reassurance.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a medical summarization AI. Generate helpful, accurate menstrual health insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content;
    }

    return generateFallbackSummary(cycles, symptoms);
  } catch (error) {
    console.warn('AI summary failed, using fallback:', error.message);
    return generateFallbackSummary(cycles, symptoms);
  }
};

// Fallback summary generation
const generateFallbackSummary = (cycles, symptoms) => {
  if (cycles.length === 0) {
    return 'No cycle data available yet. Start tracking your cycles to generate meaningful insights.';
  }

  const avgLength = Math.round(cycles.reduce((sum, c) => sum + (c.cycle_length || 0), 0) / cycles.length);
  const commonSymptoms = ['Cramps', 'Bloating', 'Mood changes'].join(', ');

  return `Your recent cycles average ${avgLength} days in length. Common symptoms include ${commonSymptoms}. Continue tracking for better insights into your patterns.`;
};
