export function checkRequiredEnvVars() {
  const required = {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
  };

  const missing: string[] = [];

  Object.entries(required).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables:\n${missing.map((key) => `   - ${key}`).join("\n")}`
    );
    console.error(
      "\n💡 Please check your .env file and ensure all required variables are set."
    );

    if (missing.includes("GOOGLE_GENERATIVE_AI_API_KEY")) {
      console.error("\n🔑 To get Google Gemini API key:");
      console.error("   1. Visit: https://aistudio.google.com/app/apikey");
      console.error("   2. Click 'Create API Key'");
      console.error(
        "   3. Add to .env: GOOGLE_GENERATIVE_AI_API_KEY=your_key_here"
      );
    }

    return false;
  }

  console.log("✅ All required environment variables are set");
  return true;
}

export function validateGeminiApiKey(): boolean {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is not set");
    return false;
  }

  if (apiKey.length < 20) {
    console.error(
      "⚠️  GOOGLE_GENERATIVE_AI_API_KEY seems too short - please verify"
    );
    return false;
  }

  return true;
}
