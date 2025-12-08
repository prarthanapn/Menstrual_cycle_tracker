// AI Integration Helper
// Uses Ollama open-source model (Mistral/Llama) if available, otherwise uses fallback rules

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || null;
const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'gpt2';

// Rule-based triage & responses when no Ollama model
const ruleChecks = {
  urgent: (lower) => lower.includes('bleeding') && lower.includes('heavy'),
  see_doctor: (lower) => ['pain', 'cramps', 'severe'].some(k => lower.includes(k)),
  normal: (lower) => ['delay', 'late period', 'late'].some(k => lower.includes(k)),
  greeting: (lower) => ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'].some(k => lower.includes(k)),
  symptoms: (lower) => ['symptoms', 'periods', 'menstruation', 'during periods', 'faced during periods'].some(k => lower.includes(k)),
};

export const triageByRules = (message) => {
  const lower = (message || '').toLowerCase();
  if (ruleChecks.urgent(lower)) return 'urgent';
  if (ruleChecks.see_doctor(lower)) return 'see_doctor';
  if (ruleChecks.normal(lower)) return 'normal';
  return 'normal';
};

// Get AI response using Ollama or fallback
export const getAIResponse = async (userMessage) => {
  // Try Ollama first, then Hugging Face inference (if configured), otherwise fall back to rules
  try {
    return await getOllamaResponse(userMessage);
  } catch (err) {
    console.warn('Ollama API failed:', err.message);
  }

  if (HUGGINGFACE_API_KEY) {
    try {
      return await getHuggingFaceResponse(userMessage);
    } catch (err) {
      console.warn('Hugging Face inference failed:', err.message);
    }
  }

  // Final fallback: rule-based
  return getRuleResponse(userMessage);
};

// Call Ollama API for chat (local open-source model)
const getOllamaResponse = async (userMessage) => {
  const systemPrompt = `You are a helpful menstrual health assistant. Respond helpfully and supportively. Keep responses short (1-3 sentences).`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`,
        stream: false,
        temperature: 0.6,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const bot_response = (data.response || '').trim();

    if (!bot_response) {
      throw new Error('Empty response from Ollama');
    }

    const triage_level = triageByRules(userMessage);
    return { bot_response, triage_level };
  } catch (error) {
    console.warn('Ollama request failed:', error.message);
    throw error; // Re-throw to use fallback
  }
};

// Hugging Face Inference API fallback for chat-like responses
const getHuggingFaceResponse = async (userMessage) => {
  const prompt = `You are a helpful menstrual health assistant. Keep responses short (1-3 sentences). User: ${userMessage}`;
  const hfUrl = `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`;

  const res = await fetch(hfUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200, temperature: 0.7 } })
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`HF inference error: ${res.status} ${res.statusText} ${txt}`);
  }

  const data = await res.json();
  // HF may return an array of objects or a single object
  let text = '';
  if (Array.isArray(data)) {
    if (data[0]?.generated_text) text = data[0].generated_text;
    else if (typeof data[0] === 'string') text = data[0];
  } else if (typeof data === 'object') {
    text = data.generated_text || data[0]?.generated_text || data[0] || '';
  } else if (typeof data === 'string') {
    text = data;
  }

  text = (text || '').toString().trim();
  if (!text) throw new Error('Empty response from Hugging Face');

  const triage_level = triageByRules(userMessage);
  return { bot_response: text, triage_level };
};

// Rule-based response with expanded knowledge base
const getRuleResponse = (userMessage) => {
  const lower = (userMessage || '').toLowerCase();

  // urgent: contains both 'bleeding' and 'heavy'
  if (ruleChecks.urgent(lower)) {
    return {
      bot_response: 'Heavy bleeding may indicate a serious issue — seek immediate medical attention or visit the emergency department.',
      triage_level: 'urgent'
    };
  }

  // see_doctor: pain/cramps/severe
  if (ruleChecks.see_doctor(lower)) {
    return {
      bot_response: 'Severe pain or persistent cramps are concerning. Please contact your healthcare provider to discuss evaluation and pain management options.',
      triage_level: 'see_doctor'
    };
  }

  // normal: delay/late period
  if (ruleChecks.normal(lower)) {
    return {
      bot_response: 'A late or delayed period can be caused by stress, travel, or hormonal changes. If delays persist, consider tracking and discussing with your clinician.',
      triage_level: 'normal'
    };
  }

  // greeting: hi/hello/hey
  if (ruleChecks.greeting(lower)) {
    return {
      bot_response: 'Hello! I\'m here to help with any questions about your menstrual health. Feel free to ask about cycles, symptoms, or general wellness.',
      triage_level: 'normal'
    };
  }

  // symptoms: symptoms/periods/menstruation
  if (ruleChecks.symptoms(lower)) {
    return {
      bot_response: 'Common symptoms during periods include cramps, bloating, fatigue, mood changes, headaches, and breast tenderness. These vary by person and can be managed with rest, hydration, and over-the-counter pain relief. If symptoms are severe or unusual, consult your healthcare provider.',
      triage_level: 'normal'
    };
  }

  // Educational questions about menstrual cycle, period, hormones, etc.
  if (/cycle|period|menstrual|menstruation|hormone|ovulation|ovarian/.test(lower)) {
    if (/what is|define|explain|tell me about/.test(lower)) {
      return {
        bot_response: 'A menstrual cycle typically lasts 21–35 days and includes four phases: menstruation (bleeding), follicular phase (hormone buildup), ovulation (egg release), and luteal phase (progesterone dominates). Each cycle prepares the body for possible pregnancy.',
        triage_level: 'normal'
      };
    }
    if (/length|how long|duration|days/.test(lower)) {
      return {
        bot_response: 'A typical menstrual cycle lasts about 28 days, but ranges from 21–35 days are normal. Cycle length can vary month to month due to stress, illness, exercise, or diet.',
        triage_level: 'normal'
      };
    }
    if (/heavy|light|flow/.test(lower)) {
      return {
        bot_response: 'Menstrual flow varies by person. Light flow is normal for some, while others experience heavier periods. If your flow suddenly changes dramatically or is extremely heavy (soaking pads hourly), consult your doctor.',
        triage_level: 'normal'
      };
    }
    if (/irregular|irregular cycle/.test(lower)) {
      return {
        bot_response: 'Irregular cycles can be caused by stress, hormonal changes, diet, exercise, or underlying conditions. Tracking helps you understand your pattern. If irregular for 3+ months, discuss with your healthcare provider.',
        triage_level: 'normal'
      };
    }
    // Generic cycle-related question
    return {
      bot_response: 'Menstruation is a natural monthly process where the uterus sheds its lining. Track your cycles here to identify patterns and predict future periods. Log symptoms daily to understand what\'s normal for you.',
      triage_level: 'normal'
    };
  }

  // Questions about tracking, logging, or app features
  if (/track|log|record|how to|how do i|use|feature/.test(lower)) {
    if (/symptom|mood|pain|flow/.test(lower)) {
      return {
        bot_response: 'Go to the "Log Symptoms" section to record mood, cramps, bloating, flow, and discharge. Regular logging helps identify patterns and triggers unique to your cycle.',
        triage_level: 'normal'
      };
    }
    if (/cycle|period|start|begin/.test(lower)) {
      return {
        bot_response: 'To start tracking: go to "Track Cycle," select the start date, choose your flow and pain level, then save. You can log symptoms daily and end the cycle when your period finishes.',
        triage_level: 'normal'
      };
    }
    // Generic tracking question
    return {
      bot_response: 'You can track your cycle by logging the start date, flow level, and pain level. Then visit "Log Symptoms" to record how you feel daily. This helps predict your next period and identify patterns.',
      triage_level: 'normal'
    };
  }

  // Health and wellness general questions
  if (/health|wellness|stress|sleep|exercise|diet/.test(lower)) {
    return {
      bot_response: 'Good health habits support a regular cycle: manage stress, get 7–9 hours of sleep, exercise regularly, and eat a balanced diet rich in iron and nutrients. Extreme diet or exercise changes can affect your cycle.',
      triage_level: 'normal'
    };
  }

  // Pregnancy-related questions
  if (/pregnant|pregnancy|conception|contraceptive|birth control/.test(lower)) {
    return {
      bot_response: 'If you\'re planning to conceive, understanding your cycle (especially ovulation timing around day 14) is helpful. For contraceptive options or pregnancy concerns, consult your healthcare provider.',
      triage_level: 'normal'
    };
  }

  // Questions about when to see a doctor
  if (/doctor|healthcare|provider|medical|concern|worried/.test(lower)) {
    return {
      bot_response: 'Consider seeing a doctor if you experience severe pain, unusually heavy bleeding, missed periods for 3+ months, or any symptoms that worry you. It\'s always good to discuss concerns with a professional.',
      triage_level: 'normal'
    };
  }

  // No rule matched: return friendly fallback with suggestion
  return {
    bot_response: 'I\'m not sure how to answer that. Try asking about your cycle, symptoms, tracking, or general menstrual health. You can also check the Learn section for more detailed information.',
    triage_level: 'normal'
  };
};

// Generate AI summary for reports
export const generateAISummary = async (user, cycles, symptoms) => {
  try {
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

    const prompt = `Generate a brief 2-3 sentence health summary for a menstrual health report.
Average cycle length: ${avgCycleLength} days
Flow patterns: ${JSON.stringify(flowCounts)}
Common symptoms: ${JSON.stringify(Object.entries(symptomCounts).slice(0, 3))}
Provide actionable insight or reassurance based on these patterns.`;

    // Try Ollama first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: prompt,
          stream: false,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const summary = (data.response || '').trim();
        if (summary && summary.length > 10) {
          return summary;
        }
      }
    } catch (err) {
      console.warn('Ollama summary generation failed:', err.message);
    }

    // If Ollama failed or returned empty, try Hugging Face inference if configured
    if (HUGGINGFACE_API_KEY) {
      try {
        const hfUrl = `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`;
        const hfRes = await fetch(hfUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200, temperature: 0.7 } })
        });

        if (hfRes.ok) {
          const hfData = await hfRes.json();
          let summary = '';
          if (Array.isArray(hfData)) {
            summary = hfData[0]?.generated_text || hfData[0] || '';
          } else if (typeof hfData === 'object') {
            summary = hfData.generated_text || hfData[0] || '';
          } else if (typeof hfData === 'string') summary = hfData;

          summary = (summary || '').toString().trim();
          if (summary && summary.length > 10) return summary;
        }
      } catch (hfErr) {
        console.warn('Hugging Face summary generation failed:', hfErr.message);
      }
    }

    // Fallback to rule-based summary
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
