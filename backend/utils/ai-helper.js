// AI chatbot with OpenAI and fallback rule-based responses

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
const OPENAI_MODEL = 'gpt-3.5-turbo';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Pattern matching for message classification
const ruleChecks = {
  urgent: (lower) => lower.includes('bleeding') && lower.includes('heavy'),
  see_doctor: (lower) => ['pain', 'cramps', 'severe'].some(k => lower.includes(k)),
  normal: (lower) => ['delay', 'late period', 'late'].some(k => lower.includes(k)),
  greeting: (lower) => ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'].some(k => lower.includes(k)),
  symptoms: (lower) => ['symptoms', 'periods', 'menstruation', 'during periods', 'faced during periods'].some(k => lower.includes(k)),
};

// Classify message urgency level
export const triageByRules = (message) => {
  const lower = (message || '').toLowerCase();
  if (ruleChecks.urgent(lower)) return 'urgent';
  if (ruleChecks.see_doctor(lower)) return 'see_doctor';
  if (ruleChecks.normal(lower)) return 'normal';
  return 'normal';
};

// Get chatbot response (try OpenAI, fallback to rules)
export const getAIResponse = async (userMessage) => {
  if (OPENAI_API_KEY) {
    try {
      return await getOpenAIResponse(userMessage);
    } catch (err) {
      console.warn('[AI] OpenAI failed, using rules:', err.message);
    }
  }
  return getRuleResponse(userMessage);
};

// Call OpenAI API with timeout
const getOpenAIResponse = async (userMessage) => {
  const systemPrompt = `You are a helpful menstrual health assistant. Respond helpfully and supportively about menstrual health topics. Keep responses short (1-3 sentences). Be empathetic and medically accurate.`;

  try {
    // Setup 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const bot_response = (data.choices?.[0]?.message?.content || '').trim();

    if (!bot_response) {
      throw new Error('Empty response from OpenAI');
    }

    const triage_level = triageByRules(userMessage);
    return { bot_response, triage_level };
  } catch (error) {
    console.warn('[AI] OpenAI request failed:', error.message);
    throw error;
  }
};

// Pattern-based responses for offline use
const getRuleResponse = (userMessage) => {
  const lower = (userMessage || '').toLowerCase();

  // Emergency triage - heavy bleeding
  if (ruleChecks.urgent(lower)) {
    return {
      bot_response: 'Heavy bleeding may indicate a serious issue — seek immediate medical attention or visit the emergency department.',
      triage_level: 'urgent'
    };
  }

  // Severe pain or concerning symptoms - recommend doctor
  if (ruleChecks.see_doctor(lower)) {
    return {
      bot_response: 'Severe pain or persistent cramps are concerning. Please contact your healthcare provider to discuss evaluation and pain management options.',
      triage_level: 'see_doctor'
    };
  }

  // Delayed period - explain common causes
  if (ruleChecks.normal(lower)) {
    return {
      bot_response: 'A late or delayed period can be caused by stress, travel, or hormonal changes. If delays persist, consider tracking and discussing with your clinician.',
      triage_level: 'normal'
    };
  }

  // User greeting the chatbot
  if (ruleChecks.greeting(lower)) {
    return {
      bot_response: 'Hello! I\'m here to help with any questions about your menstrual health. Feel free to ask about cycles, symptoms, or general wellness.',
      triage_level: 'normal'
    };
  }

  // General symptom inquiry
  if (ruleChecks.symptoms(lower)) {
    return {
      bot_response: 'Common symptoms during periods include cramps, bloating, fatigue, mood changes, headaches, and breast tenderness. These vary by person and can be managed with rest, hydration, and over-the-counter pain relief. If symptoms are severe or unusual, consult your healthcare provider.',
      triage_level: 'normal'
    };
  }

  // Questions about cycle, periods, hormones, ovulation
  if (/cycle|period|menstrual|menstruation|hormone|ovulation|ovarian/.test(lower)) {
    // Definitional questions: "What is...", "Explain...", "Tell me about..."
    if (/what is|define|explain|tell me about/.test(lower)) {
      return {
        bot_response: 'A menstrual cycle typically lasts 21–35 days and includes four phases: menstruation (bleeding), follicular phase (hormone buildup), ovulation (egg release), and luteal phase (progesterone dominates). Each cycle prepares the body for possible pregnancy.',
        triage_level: 'normal'
      };
    }
    // Cycle length questions
    if (/length|how long|duration|days/.test(lower)) {
      return {
        bot_response: 'A typical menstrual cycle lasts about 28 days, but ranges from 21–35 days are normal. Cycle length can vary month to month due to stress, illness, exercise, or diet.',
        triage_level: 'normal'
      };
    }
    // Flow intensity questions
    if (/heavy|light|flow/.test(lower)) {
      return {
        bot_response: 'Menstrual flow varies by person. Light flow is normal for some, while others experience heavier periods. If your flow suddenly changes dramatically or is extremely heavy (soaking pads hourly), consult your doctor.',
        triage_level: 'normal'
      };
    }
    // Irregular cycle questions
    if (/irregular|irregular cycle/.test(lower)) {
      return {
        bot_response: 'Irregular cycles can be caused by stress, hormonal changes, diet, exercise, or underlying conditions. Tracking helps you understand your pattern. If irregular for 3+ months, discuss with your healthcare provider.',
        triage_level: 'normal'
      };
    }
    // Default cycle-related response
    return {
      bot_response: 'Menstruation is a natural monthly process where the uterus sheds its lining. Track your cycles here to identify patterns and predict future periods. Log symptoms daily to understand what\'s normal for you.',
      triage_level: 'normal'
    };
  }

  // Questions about how to use the app
  if (/track|log|record|how to|how do i|use|feature/.test(lower)) {
    // Symptom logging questions
    if (/symptom|mood|pain|flow/.test(lower)) {
      return {
        bot_response: 'Go to the "Log Symptoms" section to record mood, cramps, bloating, flow, and discharge. Regular logging helps identify patterns and triggers unique to your cycle.',
        triage_level: 'normal'
      };
    }
    // Cycle tracking questions
    if (/cycle|period|start|begin/.test(lower)) {
      return {
        bot_response: 'To start tracking: go to "Track Cycle," select the start date, choose your flow and pain level, then save. You can log symptoms daily and end the cycle when your period finishes.',
        triage_level: 'normal'
      };
    }
    // Generic tracking help
    return {
      bot_response: 'You can track your cycle by logging the start date, flow level, and pain level. Then visit "Log Symptoms" to record how you feel daily. This helps predict your next period and identify patterns.',
      triage_level: 'normal'
    };
  }

  // General health habits affecting cycle
  if (/health|wellness|stress|sleep|exercise|diet/.test(lower)) {
    return {
      bot_response: 'Good health habits support a regular cycle: manage stress, get 7–9 hours of sleep, exercise regularly, and eat a balanced diet rich in iron and nutrients. Extreme diet or exercise changes can affect your cycle.',
      triage_level: 'normal'
    };
  }

  // Fertility and contraception questions
  if (/pregnant|pregnancy|conception|contraceptive|birth control/.test(lower)) {
    return {
      bot_response: 'If you\'re planning to conceive, understanding your cycle (especially ovulation timing around day 14) is helpful. For contraceptive options or pregnancy concerns, consult your healthcare provider.',
      triage_level: 'normal'
    };
  }

  // When to see a healthcare provider
  if (/doctor|healthcare|provider|medical|concern|worried/.test(lower)) {
    // Specific question about when to seek medical help
    if (/when|should i|when should/.test(lower)) {
      return {
        bot_response: 'See a doctor if you: have severe pain that interferes with daily life, bleed heavily (soaking pads every 1-2 hours), miss periods for 3+ months, have sudden changes in your cycle, experience symptoms that worry you, or notice unusual discharge. Regular check-ups are also good for overall health.',
        triage_level: 'normal'
      };
    }
    // General doctor consultation advice
    return {
      bot_response: 'Consider seeing a doctor if you experience severe pain, unusually heavy bleeding, missed periods for 3+ months, or any symptoms that worry you. It\'s always good to discuss concerns with a professional.',
      triage_level: 'normal'
    };
  }

  // ===== TEEN-FOCUSED QUESTIONS =====

  // What is a menstrual cycle and why does it happen?
  if (/what|cycle|happen|why|starts|begins/.test(lower) && /period|menstrual/.test(lower)) {
    return {
      bot_response: 'A menstrual cycle is your body\'s monthly process of preparing for possible pregnancy. Each month, your uterus builds a lining. If you don\'t get pregnant, your body sheds this lining as blood and tissue—that\'s your period. This cycle typically lasts 21-35 days and happens about once a month throughout your reproductive years.',
      triage_level: 'normal'
    };
  }

  // When will I get my first period?
  if (/first period|menarche|when will i/.test(lower)) {
    return {
      bot_response: 'Most girls get their first period between ages 8-16, with an average around age 12-13. Every body is different—there\'s a wide range of "normal." You may notice signs like breast development, pubic hair growth, or increased height before your first period arrives. Talk to a trusted adult if you have concerns.',
      triage_level: 'normal'
    };
  }

  // Is my period normal if it's irregular?
  if (/irregular|normal|skip/.test(lower) && /period|cycle/.test(lower)) {
    return {
      bot_response: 'Irregular periods are very common, especially in the first few years. Your cycle may vary by a few days month to month—that\'s normal. Stress, illness, exercise, diet, and sleep changes can affect your period. Track your cycle for a few months to see your pattern. If your period stops for several months or changes dramatically, talk to a doctor.',
      triage_level: 'normal'
    };
  }

  // How long does a period usually last?
  if (/how long|duration|last|days/.test(lower) && /period/.test(lower)) {
    return {
      bot_response: 'Most periods last 3-7 days. Some last 2 days, others last 10—both can be normal. Heavy bleeding usually lasts 1-2 days, then becomes lighter. Track your period length to understand what\'s normal for you. If your period lasts more than 10 days or you\'re concerned, talk to a doctor.',
      triage_level: 'normal'
    };
  }

  // Is it normal to have cramps or pain?
  if (/cramp|pain|ache|hurt/.test(lower)) {
    return {
      bot_response: 'Mild to moderate cramps are very normal—they\'re caused by your uterus contracting to shed its lining. Many people experience them a day or two before and during their period. Try heat (heating pad), rest, light exercise, or over-the-counter pain relief. Severe cramps that stop you from doing normal activities should be discussed with a doctor.',
      triage_level: 'normal'
    };
  }

  // Why is my flow heavy/light?
  if (/flow|heavy|light|bleeding|bleed/.test(lower)) {
    return {
      bot_response: 'Period flow varies naturally between people and even month to month. Some people bleed lightly, others heavily—both are usually normal. Heavy bleeding is if you soak through a pad or tampon in an hour, or change products more than every 2 hours. Light periods can happen due to diet, stress, or exercise. If your flow suddenly changes dramatically, check with a doctor.',
      triage_level: 'normal'
    };
  }

  // What should I do if I bleed through my clothes?
  if (/bleed through|leak|stain|accident/.test(lower)) {
    return {
      bot_response: 'Don\'t worry—this happens to many people! Try rinsing stains with cold water immediately (hot water sets blood stains). Use higher-absorbency pads, tampons, or menstrual cups. You can also wear dark pants on heavy days. Consider keeping spare underwear or clothes at school. If you\'re having frequent leaks, try a different product or see a doctor about your flow.',
      triage_level: 'normal'
    };
  }

  // Which products should I use—pads, tampons, menstrual cups?
  if (/product|pad|tampon|cup|diaper/.test(lower)) {
    return {
      bot_response: 'All period products are safe—choose what\'s comfortable for you. Pads are easy to use and visible if leaking. Tampons are discreet and good for sports. Menstrual cups hold more and are reusable. Some people use different products on different days. Experiment to find what works best. Remember to change pads/tampons every 4-8 hours and follow cup instructions carefully.',
      triage_level: 'normal'
    };
  }

  // Can I swim or play sports during my period?
  if (/swim|sport|exercise|activity|gym|dance/.test(lower)) {
    return {
      bot_response: 'Yes, absolutely! You can swim, play sports, and exercise during your period. Exercise can actually help reduce cramps. Wear a tampon, cup, or leak-proof period underwear while swimming. Many athletes compete during their periods. Don\'t let your period stop you from doing things you enjoy. Listen to your body—if you\'re tired, rest is okay too.',
      triage_level: 'normal'
    };
  }

  // Why does my mood change before my period?
  if (/mood|emotional|irritable|sad|angry|cry|pms/.test(lower)) {
    return {
      bot_response: 'Hormonal changes during your cycle affect mood and emotions. Before your period (luteal phase), progesterone and estrogen levels drop, which can cause mood changes, anxiety, or irritability—this is called PMS (premenstrual syndrome). Exercise, sleep, stress management, and talking to someone helps. These mood changes are real and normal—they usually go away once your period starts.',
      triage_level: 'normal'
    };
  }

  // Is vaginal discharge normal?
  if (/discharge|vaginal|healthy/.test(lower)) {
    return {
      bot_response: 'Yes, vaginal discharge is completely normal and healthy! It changes during your cycle: thicker around ovulation, thinner after your period. Clear or white discharge is normal. See a doctor if discharge is green, gray, or yellow, has a strong smell, causes itching, or you have pain—these could indicate an infection.',
      triage_level: 'normal'
    };
  }

  // What if I skip a period?
  if (/skip|miss|missed|late|no period/.test(lower)) {
    return {
      bot_response: 'A missed period can happen due to stress, illness, weight changes, exercise, poor nutrition, hormonal changes, or pregnancy. If you\'re sexually active, take a pregnancy test first. Otherwise, your period usually comes next month. If you miss 3 or more periods in a row (when not pregnant), or if you\'re concerned, talk to a doctor.',
      triage_level: 'normal'
    };
  }

  // Can I get pregnant if I have sex during my period?
  if (/pregnant|pregnancy|sex|sexual/.test(lower) && /period|menstruation/.test(lower)) {
    return {
      bot_response: 'Yes, you can get pregnant from sex during your period, though the risk is lower than during ovulation. Sperm can live 5+ days, and ovulation timing varies. If you don\'t want to get pregnant, use contraception every time. This is something to discuss with a healthcare provider or trusted adult if you have questions.',
      triage_level: 'normal'
    };
  }

  // Is it normal to feel tired during my period?
  if (/tired|fatigue|exhausted|energy/.test(lower) && /period/.test(lower)) {
    return {
      bot_response: 'Feeling tired during your period is very normal. Your body is losing blood and energy, hormones shift, and many people sleep poorly. Get extra rest, eat iron-rich foods (like spinach and beans), stay hydrated, and take it easy on heavy days. If you\'re exhausted all month, talk to a doctor—you might need an iron supplement.',
      triage_level: 'normal'
    };
  }

  // ===== ADULT-FOCUSED QUESTIONS =====

  // What is PMS?
  if (/pms|premenstrual/.test(lower)) {
    if (/what|define|explain/.test(lower)) {
      return {
        bot_response: 'PMS (premenstrual syndrome) is a collection of physical and emotional symptoms that occur in the week or two before your period. Common symptoms include bloating, breast tenderness, mood changes, headaches, fatigue, and food cravings. Symptoms typically disappear once your period starts. PMS affects up to 85% of menstruating people to some degree.',
        triage_level: 'normal'
      };
    }
    if (/help|reduce|treat|manage/.test(lower)) {
      return {
        bot_response: 'To reduce PMS symptoms: track your symptoms to identify patterns, get regular exercise, manage stress, ensure adequate sleep (7-9 hours), eat a balanced diet with enough calcium and magnesium, limit salt and sugar, stay hydrated, and consider over-the-counter pain relief. Some people benefit from birth control or prescribed medications. Talk to your doctor about options.',
        triage_level: 'normal'
      };
    }
    return {
      bot_response: 'PMS is very common and manageable. Symptoms vary widely between people. Most people find relief through lifestyle changes, exercise, stress management, and tracking. If symptoms severely impact your life, see a doctor—there are treatments available.',
      triage_level: 'normal'
    };
  }

  // What's the difference between PMS and PMDD?
  if (/pmdd|severe pms|different/.test(lower)) {
    return {
      bot_response: 'PMDD (premenstrual dysphoric disorder) is a severe form of PMS. With PMS, symptoms are manageable. With PMDD, emotional symptoms are severe—deep depression, anxiety, rage, or inability to function during the luteal phase. PMDD is less common (3-8% of people) but serious. If you experience severe mood changes that interfere with work, relationships, or daily life, see a healthcare provider—PMDD is treatable with medication or therapy.',
      triage_level: 'see_doctor'
    };
  }

  // What is a "normal" menstrual cycle length?
  if (/normal|length|cycle|how long|days/.test(lower) && /cycle|period/.test(lower)) {
    return {
      bot_response: 'A normal menstrual cycle is 21-35 days long, with an average of 28 days. Cycle lengths vary between people and can vary month to month. Some cycles are consistently shorter or longer—that\'s still normal if it\'s regular for you. Track your cycle for several months to identify your personal pattern. Sudden changes warrant a doctor visit.',
      triage_level: 'normal'
    };
  }

  // Why is my cycle changing as I get older?
  if (/changing|age|older|perimenopause|menopause/.test(lower) && /cycle|period/.test(lower)) {
    return {
      bot_response: 'Your cycle naturally changes with age. In your 20s-30s, cycles are often most regular. In your 40s, you may enter perimenopause—cycles become irregular, heavier, or lighter. Hormonal fluctuations cause these changes. Stress, health conditions, medications, and lifestyle also affect cycles. If changes concern you or are sudden, consult your doctor.',
      triage_level: 'normal'
    };
  }

  // What causes heavy or painful periods?
  if (/heavy|painful|pain|cause|why/.test(lower) && /period/.test(lower)) {
    return {
      bot_response: 'Heavy or painful periods can be caused by: hormonal imbalances, fibroids, endometriosis, polyps, IUDs, thyroid problems, bleeding disorders, or PMS/PMDD. Other factors include stress, poor diet, inadequate sleep, or lifestyle changes. If you\'re soaking pads hourly, have severe pain, or sudden changes, see a doctor. Diagnosis helps guide treatment options.',
      triage_level: 'see_doctor'
    };
  }

  // Why do I sometimes spot between periods?
  if (/spot|bleed between|bleeding between|intermenstrual/.test(lower)) {
    return {
      bot_response: 'Spotting between periods can be caused by: ovulation (mid-cycle light bleeding), hormonal birth control, infections, fibroids, polyps, thyroid issues, or stress. One episode is usually not concerning. Frequent or heavy spotting warrants a doctor visit. Track spotting dates and amounts to share with your healthcare provider.',
      triage_level: 'normal'
    };
  }

  // What causes irregular cycles?
  if (/irregular|cause|why|reason/.test(lower) && /cycle/.test(lower)) {
    return {
      bot_response: 'Common causes of irregular cycles: stress, major weight changes, excessive exercise, poor nutrition, hormonal conditions (PCOS, thyroid disorders), reproductive issues (fibroids, endometriosis), medications, or hormonal birth control. Aging and perimenopause also cause irregularity. Track your cycle and consult a doctor if irregularity persists beyond 3 months or is accompanied by other symptoms.',
      triage_level: 'normal'
    };
  }

  // How does stress affect my period?
  if (/stress|affect|impact|late|change/.test(lower) && /period|cycle/.test(lower)) {
    return {
      bot_response: 'Stress significantly affects your period. High stress can delay or skip your period, make it heavier or lighter, cause more painful cramps, and worsen PMS symptoms. Chronic stress disrupts hormones that regulate your cycle. Stress management (exercise, meditation, sleep, talking to someone) helps restore cycle regularity. If stress is severe and prolonged, seek support from a mental health professional.',
      triage_level: 'normal'
    };
  }

  // Can birth control change my cycle?
  if (/birth control|hormonal|pill|iud|contraceptive/.test(lower)) {
    return {
      bot_response: 'Yes, hormonal birth control changes your cycle. The pill, patch, ring, or implant thin the uterine lining and can reduce flow and lighten or skip periods—this is safe. Some methods cause spotting initially, then regulate. Non-hormonal IUDs may increase flow. Changes usually settle within 3-6 months. Discuss options with your doctor to find what works for your body and lifestyle.',
      triage_level: 'normal'
    };
  }

  // How do I know when I'm ovulating?
  if (/ovulating|ovulation|fertile|window|when/.test(lower)) {
    return {
      bot_response: 'Ovulation typically occurs around day 14 of a 28-day cycle, but varies widely. Signs include: change in cervical mucus (stretchy, clear), slight temperature rise (use a basal thermometer), mild lower abdominal pain (mittelschmerz), or breast tenderness. Track these signs for several cycles. Ovulation predictor kits detect hormonal changes. Apps and tracking help identify your fertile window.',
      triage_level: 'normal'
    };
  }

  // How does the menstrual cycle affect fertility?
  if (/fertility|fertile|pregnant|conception|window/.test(lower)) {
    return {
      bot_response: 'You can only get pregnant during a small fertile window around ovulation (5 days before to 1 day after). If your cycle is 28 days, ovulation is roughly day 14. Sperm can live 5+ days. Tracking ovulation (basal temp, mucus, or kits) helps if you\'re planning pregnancy. If you\'re trying to conceive and having trouble after 12 months (or 6+ if over 35), see a fertility specialist.',
      triage_level: 'normal'
    };
  }

  // What is a normal amount of bleeding?
  if (/normal|amount|bleeding|flow|heavy|light/.test(lower)) {
    return {
      bot_response: 'Normal period bleeding is 30-40 mL (about 2-3 tablespoons) per day, totaling 30-40 mL for the entire period. Heavy bleeding is soaking a pad or tampon every 1-2 hours, or passing clots larger than a quarter. Light periods are less than 1 tablespoon per day. Heavy bleeding can lead to anemia. Track your flow and discuss unusual amounts with your doctor.',
      triage_level: 'normal'
    };
  }

  // Why are my periods getting lighter or heavier?
  if (/lighter|heavier|changing|getting|increasing|decreasing/.test(lower) && /flow|period/.test(lower)) {
    return {
      bot_response: 'Changes in flow can be caused by: hormonal shifts, stress, diet, exercise, age, medications, medical conditions (thyroid, bleeding disorders, fibroids), or pregnancy. Gradual changes as you age are normal. Sudden changes warrant a doctor visit. Track your flow for 2-3 months and note any other symptoms. Your doctor can determine if changes need evaluation.',
      triage_level: 'normal'
    };
  }

  // How do perimenopause and menopause affect cycles?
  if (/perimenopause|menopause|transition|age 40|age 50/.test(lower)) {
    return {
      bot_response: 'Perimenopause (usually ages 40-55) brings irregular periods, hot flashes, mood changes, and sleep issues as hormones fluctuate. Periods may skip months, then return. Some become heavier, others lighter. Menopause occurs when you haven\'t had a period for 12 months. Average age is 51. This is a natural transition. Talk to your doctor about managing symptoms—options exist.',
      triage_level: 'normal'
    };
  }

  // Default response if no pattern matches
  return {
    bot_response: 'I can help with questions about your cycle, symptoms, tracking, and health. Try asking about any of these topics or check the Learn section.',
    triage_level: 'normal'
  };
};

// Generate AI summary for cycle reports
export const generateAISummary = async (user, cycles, symptoms) => {
  try {
    // Calculate cycle statistics
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

    // Create AI prompt with data
    const prompt = `Generate a brief 2-3 sentence health summary for a menstrual health report.
Average cycle length: ${avgCycleLength} days
Flow patterns: ${JSON.stringify(flowCounts)}
Common symptoms: ${JSON.stringify(Object.entries(symptomCounts).slice(0, 3))}
Provide actionable insight or reassurance based on these patterns.`;

    // Try OpenAI first
    if (OPENAI_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(OPENAI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              { role: 'system', content: 'You are a helpful menstrual health assistant. Generate concise, actionable summaries.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 150
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Extract summary from OpenAI response
        if (response.ok) {
          const data = await response.json();
          const summary = (data.choices?.[0]?.message?.content || '').trim();
          if (summary && summary.length > 10) {
            return summary; // Return AI-generated summary
          }
        }
      } catch (err) {
        console.warn('[AI] OpenAI summary generation failed:', err.message);
      }
    }

    // Fallback to template-based summary
    return generateFallbackSummary(cycles, symptoms);
  } catch (error) {
    console.warn('[AI] Summary generation error, using fallback:', error.message);
    return generateFallbackSummary(cycles, symptoms);
  }
};

// Generate fallback summary from statistics
const generateFallbackSummary = (cycles, symptoms) => {
  if (cycles.length === 0) {
    return 'No cycle data available yet. Start tracking your cycles to generate meaningful insights.';
  }

  const avgLength = Math.round(cycles.reduce((sum, c) => sum + (c.cycle_length || 0), 0) / cycles.length);
  const commonSymptoms = ['Cramps', 'Bloating', 'Mood changes'].join(', ');

  return `Your recent cycles average ${avgLength} days in length. Common symptoms include ${commonSymptoms}. Continue tracking for better insights into your patterns.`;
};
