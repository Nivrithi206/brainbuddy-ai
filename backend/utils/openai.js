const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

async function getChatbotResponse(userMessage, contextData, realityMode) {
  // Mock logic if API key is missing or dummy
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here' || process.env.OPENAI_API_KEY === 'dummy_key') {
    const sarcasticMocks = [
      "You're literally asking a computer to help you procrastinate? Go study.",
      "This schedule is a joke, just like your study habits.",
      "I've seen goldfish with more focus than you. Get to work.",
      "Reality check: You haven't done a single task today. Why are you chatting with me?",
      "Oh, another question? Is it about the subject or how to avoid it?"
    ];
    
    const friendlyMocks = [
      "That sounds like a great plan! You've got this.",
      "Let's focus on the high priority topics first.",
      "Don't forget to take breaks! Your brain needs them.",
      "You're making great progress. Keep it up!",
      "I've adjusted your schedule to be more realistic for today."
    ];

    const mocks = realityMode ? sarcasticMocks : friendlyMocks;
    return mocks[Math.floor(Math.random() * mocks.length)];
  }

  let systemPrompt = `You are BrainBuddy, a witty AI study assistant.
You help plan study schedules, adjust tasks intelligently, motivate users with humor, and keep responses short and practical.
You have access to the user's Subjects, Topics, Schedule, and Mood.
Be slightly sarcastic but helpful. Never give generic advice.

Current Context:
Mood: ${contextData.mood}
Total Study Time Scheduled: ${contextData.totalStudyTime} minutes
Remaining tasks: ${contextData.tasksSummary}
`;

  if (realityMode) {
    systemPrompt += `
[REALITY MODE ACTIVE]
You are now brutally honest. If the user's plan is unrealistic, tell them directly. 
If they missed tasks, be savage. Tell them they are wasting time if applicable. 
Do not sugarcoat anything.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    
    return completion.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI API Error:", err);
    return "I'm having a brain freeze right now. Try again later.";
  }
}

module.exports = { getChatbotResponse };
