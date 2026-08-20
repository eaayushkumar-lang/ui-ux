// This is a scripted, client-side reply engine, not a live model call.
// Calling a real LLM API from a public browser bundle would mean shipping
// a secret API key to every visitor - a real security hole, not a demo
// shortcut - so this trial page simulates the experience instead of
// wiring up a real backend that doesn't exist for this static site.

interface ReplyRule {
  test: (input: string) => boolean;
  reply: string;
}

const rules: ReplyRule[] = [
  {
    test: (input) => /meeting|schedule|calendar/i.test(input),
    reply:
      "Done! I've scheduled your meeting for tomorrow at 3 PM and sent invites to everyone on the thread.",
  },
  {
    test: (input) => /summar/i.test(input),
    reply:
      "Here's the summary: three action items, one blocker on vendor approval, and a decision needed on the Q3 budget by Friday.",
  },
  {
    test: (input) => /email|write/i.test(input),
    reply:
      'Here\'s a draft: "Hi team, following up on our last conversation. I\'ve attached the updated timeline and would love your thoughts before we finalize scope." Want me to send it?',
  },
  {
    test: (input) => /price|cost|pricing/i.test(input),
    reply:
      "Every engagement is scoped to what you actually need. I'd need a bit more context on your workflow to give you a real number.",
  },
  {
    test: (input) => /hello|hi\b|hey/i.test(input),
    reply: "Hey! I'm the Aurevyn agent. Ask me to schedule something, summarize a document, or draft an email.",
  },
];

const fallbacks = [
  "Got it, I'm on it. I'll pull the relevant data and have an update for you in a moment.",
  "Understood. I've logged that and I'm routing it to the right workflow now.",
  "On it. Give me a second to check your connected tools and I'll follow up here.",
];

export function getSimulatedReply(input: string): string {
  const matched = rules.find((rule) => rule.test(input));
  if (matched) return matched.reply;
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
