import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/AppError';
import { AuthTokenPayload } from '../types';

/**
 * Protege rotas que exigem um usuário autenticado.
 * Espera o cabeçalho: Authorization: Bearer <token>
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de autenticação não informado.');
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, env.jwt.secret) as AuthTokenPayload;
    req.user = payload;
    next();
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado.');
  }
}
