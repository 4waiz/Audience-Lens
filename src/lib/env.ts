export const providerStatus = {
  transcription:
    process.env.OPENAI_API_KEY ||
    process.env.DEEPGRAM_API_KEY ||
    process.env.ASSEMBLYAI_API_KEY
      ? "Configured"
      : "Demo fallback",
  adaptation:
    process.env.OPENAI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
      ? "Configured"
      : "Demo fallback",
  storage: process.env.DATABASE_URL ? "Database" : "Local browser storage",
  hasConfiguredProvider: Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.DEEPGRAM_API_KEY ||
      process.env.ASSEMBLYAI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  ),
};
