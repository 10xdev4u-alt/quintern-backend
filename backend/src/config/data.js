// ── TEST / DEV CREDENTIALS ──────────────────────────────────
// Hardcoded so Railway/Vercel deploys work without env vars.
// FIXME: Remove this file and use real env vars before production.
//
// Usage: require('./data').applyDefaults(process.env);

const DEFAULTS = {
  JWT_SECRET: 'vTi5021OI4Z2CCrysqvEZBP3I13iHC07cdAjPm/7t/lJK1K0MV2I5UZ8Z1To8krr',
  JWT_ACCESS_SECRET: 'MeTHklxqdSn276J8u72vdCE0f3cv1XsHxCXCVYwvRmRkvPLCh3OCMKNtBcxC+Ykv',
  JWT_REFRESH_SECRET: 'ECpYAC9I0nYWQGimfeoIEi8XJXbwI4Tai72MAVDuvE5x3SCx4+CgS1cLnZe4hvNY',
  CSRF_SECRET: 'ij1YQpheaBKzqjT3tAxKeylBv7FNLVuLxZdLa/5dbH+FXxJUwCzsZZdJA1+/hRvl',
  API_KEY: 'MeTHklxqdSn276J8u72vdCE0f3cv1XsHxCXCVYwvRmRkvPLCh3OCMKNtBcxC+Ykv',
  UPSTASH_REDIS_REST_URL: 'https://measured-dory-122478.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'gQAAAAAAAd5uAAIgcDEwN2Q1Y2RlNjJmYTI0ZWIxOWI5ZGQ3MjU0NTdmZTY4Ng',
  GROQ_API_KEY: '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',
  DATABASE_URL: 'postgresql://neondb_owner:npg_fwnoY7Tr1Hzs@ep-empty-wave-at24pjtz-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require',
};

/**
 * Apply missing defaults to an env-like object (e.g. process.env).
 * Only sets values that are not already defined.
 */
function applyDefaults(env) {
  for (const [key, value] of Object.entries(DEFAULTS)) {
    if (!env[key]) {
      env[key] = value;
    }
  }
}

module.exports = { DEFAULTS, applyDefaults };
