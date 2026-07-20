import { config } from 'dotenv';

config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(requireEnv('PORT', '3333')),
  nodeEnv: requireEnv('NODE_ENV', 'development'),

  db: {
    host: requireEnv('DB_HOST', 'localhost'),
    port: Number(requireEnv('DB_PORT', '3306')),
    user: requireEnv('DB_USER', 'root'),
    password: requireEnv('DB_PASSWORD', ''),
    name: requireEnv('DB_NAME', 'blog_db'),
  },

  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: requireEnv('JWT_EXPIRES_IN', '1d'),
  },

  uploads: {
    dir: requireEnv('UPLOADS_DIR', 'uploads/banners'),
    maxSizeMb: Number(requireEnv('MAX_UPLOAD_SIZE_MB', '5')),
  },

  corsOrigin: requireEnv('CORS_ORIGIN', '*'),
};
