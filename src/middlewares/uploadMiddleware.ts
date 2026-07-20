import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { env } from '../config/env';

const uploadsDir = path.resolve(process.cwd(), env.uploads.dir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = crypto.randomUUID();
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${uniqueSuffix}${extension}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, callback: FileFilterCallback): void {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(new Error('Formato de imagem não suportado. Use JPEG, PNG ou WEBP.'));
    return;
  }
  callback(null, true);
}

export const uploadBannerImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.uploads.maxSizeMb * 1024 * 1024 },
});

/** Caminho relativo salvo no banco e usado para montar a URL pública. */
export function toRelativeUploadPath(filename: string): string {
  return path.posix.join(env.uploads.dir.replace(/\\/g, '/'), filename);
}
