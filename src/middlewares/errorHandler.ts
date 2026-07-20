import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

/**
 * Middleware final de tratamento de erros. Qualquer erro lançado (ou
 * passado via next(err)) em rotas/serviços cai aqui, evitando
 * try/catch repetido em cada controller.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof MulterError) {
    res.status(400).json({ message: `Erro no upload da imagem: ${error.message}` });
    return;
  }

  if (error instanceof Error) {
    console.error('[ERRO NÃO TRATADO]', error);
    res.status(500).json({
      message: 'Erro interno do servidor.',
      detail: env.nodeEnv === 'development' ? error.message : undefined,
    });
    return;
  }

  console.error('[ERRO DESCONHECIDO]', error);
  res.status(500).json({ message: 'Erro interno do servidor.' });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}
