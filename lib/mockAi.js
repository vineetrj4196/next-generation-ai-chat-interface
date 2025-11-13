export async function mockAiResponse(prompt) {
  await new Promise((res) => setTimeout(res, 1500));

  const lowerPrompt = prompt.trim().toLowerCase();

  const qaMap = {
    hi: "Hello! How are you?",
    hello: "Hello! How are you?",
    "how are you": "I'm a mock AI, but I'm doing great! How about you?",
    help: "Sure! What do you need help with?",
    "what is your name": "I am a mock AI created for testing your chat app.",
    "tell me a joke": "Why did the developer go broke? Because he used up all his cache!",
    "what is javascript": "JavaScript is a versatile programming language used for web development.",
    "what is react": "React is a JavaScript library for building user interfaces.",
    "bye": "Goodbye! Have a great day!"
  };

  const randomResponses = [
    "Interesting question! Let me think...",
    "I'm not sure about that, but you can try searching online.",
    "Can you please rephrase your question?",
    "That's a great question! I'm learning more every day.",
    "Hmm… I don't have a definite answer for that yet."
  ];

  for (const key in qaMap) {
    if (lowerPrompt.includes(key)) {
      return qaMap[key];
    }
  }

  const randomIndex = Math.floor(Math.random() * randomResponses.length);
  const fallback = randomResponses[randomIndex];

  return `# Response to: ${prompt}

${fallback}

## Example Markdown
- You asked: **${prompt}**
- AI says: ${fallback}

\`\`\`js
console.log('Mock AI response for: ${prompt}');
\`\`\`
`;
}
