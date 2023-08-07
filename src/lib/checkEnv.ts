export const checkAuth = () => {
  return !!(
    process.env.NEXT_PUBLIC_AUTH_SECRET &&
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_API_KEY &&
    ((process.env.NEXT_PUBLIC_EMAIL_SERVER_HOST &&
      process.env.NEXT_PUBLIC_EMAIL_SERVER_PORT &&
      process.env.NEXT_PUBLIC_EMAIL_SERVER_USER &&
      process.env.NEXT_PUBLIC_EMAIL_SERVER_PASSWORD &&
      process.env.NEXT_PUBLIC_EMAIL_FROM) ||
      (process.env.NEXT_PUBLIC_GITHUB_ID &&
        process.env.NEXT_PUBLIC_GITHUB_SECRET) ||
      (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET))
  );
};

export const checkEmail = () => {
  return !!(
    process.env.NEXT_PUBLIC_EMAIL_SERVER_HOST &&
    process.env.NEXT_PUBLIC_EMAIL_SERVER_PORT &&
    process.env.NEXT_PUBLIC_EMAIL_SERVER_USER &&
    process.env.NEXT_PUBLIC_EMAIL_SERVER_PASSWORD &&
    process.env.NEXT_PUBLIC_EMAIL_FROM
  );
};

export const checkGithub = () => {
  return !!(
    process.env.NEXT_PUBLIC_GITHUB_ID && process.env.NEXT_PUBLIC_GITHUB_SECRET
  );
};

export const checkGoogle = () => {
  return !!(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  );
};

export const checkRedis = () => {
  return !!(
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL &&
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN
  );
};

export const checkTTS = () => {
  return !!(
    process.env.NEXT_PUBLIC_AZURE_TTS_KEY &&
    process.env.NEXT_PUBLIC_AZURE_TTS_REGION
  );
};
