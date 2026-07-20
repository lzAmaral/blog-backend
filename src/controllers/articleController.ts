import { Request, Response } from 'express';
import { articleService } from '../services/articleService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, UnauthorizedError } from '../utils/AppError';
import { toRelativeUploadPath } from '../middlewares/uploadMiddleware';
import { ArticleWithAuthor } from '../types';

function buildBannerUrl(req: Request, bannerImage: string | null): string | null {
  if (!bannerImage) return null;
  return `${req.protocol}://${req.get('host')}/${bannerImage.replace(/\\/g, '/')}`;
}

function toResponse(req: Request, article: ArticleWithAuthor) {
  return {
    id: article.id,
    title: article.title,
    content: article.content,
    authorId: article.author_id,
    authorName: article.author_name,
    publishedAt: article.published_at,
    updatedAt: article.updated_at,
    bannerImageUrl: buildBannerUrl(req, article.banner_image),
  };
}

function parseArticleId(rawId: string): number {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('Identificador de artigo inválido.', 400);
  }
  return id;
}

export const articleController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const articles = await articleService.list();
    res.status(200).json(articles.map((article) => toResponse(req, article)));
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseArticleId(req.params.id);
    const article = await articleService.getById(id);
    res.status(200).json(toResponse(req, article));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();

    const bannerImagePath = req.file ? toRelativeUploadPath(req.file.filename) : null;

    const article = await articleService.create(req.user.userId, {
      title: req.body.title,
      content: req.body.content,
      bannerImagePath,
    });

    res.status(201).json(toResponse(req, article));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const id = parseArticleId(req.params.id);

    const bannerImagePath = req.file ? toRelativeUploadPath(req.file.filename) : undefined;

    const article = await articleService.update(id, req.user.userId, {
      title: req.body.title,
      content: req.body.content,
      bannerImagePath,
    });

    res.status(200).json(toResponse(req, article));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const id = parseArticleId(req.params.id);

    await articleService.delete(id, req.user.userId);
    res.status(204).send();
  }),
};
