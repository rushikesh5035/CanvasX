export function checkRequiredEnvVars() {
  const required = {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
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

    if (missing.includes("UPSTASH_REDIS_REST_URL")) {
      console.error("\n🔴 To get Upstash Redis credentials:");
      console.error("   1. Visit: https://console.upstash.com/");
      console.error("   2. Create a new Redis database");
      console.error("   3. Copy REST URL and REST Token");
    }

    if (missing.includes("INNGEST_SIGNING_KEY")) {
      console.error("\n⚡ To get Inngest credentials:");
      console.error("   1. Visit: https://app.inngest.com/");
      console.error("   2. Create a new project or select existing");
      console.error("   3. Go to Settings > Keys");
      console.error("   4. Copy Signing Key and Event Key");
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

export function validateRedisCredentials(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error("❌ Redis configuration incomplete");
    console.error("   Missing:", !url ? "UPSTASH_REDIS_REST_URL" : "");
    console.error("   Missing:", !token ? "UPSTASH_REDIS_REST_TOKEN" : "");
    return false;
  }

  if (!url.startsWith("https://")) {
    console.error("⚠️  UPSTASH_REDIS_REST_URL should start with https://");
    return false;
  }

  return true;
}

export function validateAllKeys(): boolean {
  const checks = [
    validateGeminiApiKey(),
    validateRedisCredentials(),
    checkRequiredEnvVars(),
  ];
  return checks.every((check) => check === true);
}
