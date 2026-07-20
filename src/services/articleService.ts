import fs from 'fs/promises';
import path from 'path';
import { articleRepository } from '../repositories/articleRepository';
import { AppError, ForbiddenError, NotFoundError } from '../utils/AppError';
import { isNonEmptyString } from '../utils/validators';
import { ArticleWithAuthor, CreateArticleDTO, UpdateArticleDTO } from '../types';
import { env } from '../config/env';

const UPLOADS_ROOT = path.resolve(process.cwd(), env.uploads.dir);

async function removeImageFile(imagePath: string | null): Promise<void> {
  if (!imagePath) return;
  const absolutePath = path.resolve(process.cwd(), imagePath);

  // Garante que o arquivo removido está dentro da pasta de uploads.
  if (!absolutePath.startsWith(UPLOADS_ROOT)) return;

  try {
    await fs.unlink(absolutePath);
  } catch {
    // Se o arquivo já não existir, não há nada a fazer.
  }
}

function assertIsAuthor(article: ArticleWithAuthor, userId: number): void {
  if (article.author_id !== userId) {
    throw new ForbiddenError('Você só pode alterar artigos que você mesmo criou.');
  }
}

export const articleService = {
  async list(): Promise<ArticleWithAuthor[]> {
    return articleRepository.findAll();
  },

  async getById(id: number): Promise<ArticleWithAuthor> {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError('Artigo');
    }
    return article;
  },

  async create(authorId: number, data: CreateArticleDTO): Promise<ArticleWithAuthor> {
    const title = data.title?.trim();
    const content = data.content?.trim();

    if (!isNonEmptyString(title, 3)) {
      throw new AppError('O título deve ter pelo menos 3 caracteres.');
    }
    if (!isNonEmptyString(content, 10)) {
      throw new AppError('O conteúdo deve ter pelo menos 10 caracteres.');
    }

    return articleRepository.create({
      title,
      content,
      bannerImage: data.bannerImagePath ?? null,
      authorId,
    });
  },

  async update(id: number, userId: number, data: UpdateArticleDTO): Promise<ArticleWithAuthor> {
    const article = await this.getById(id);
    assertIsAuthor(article, userId);

    if (data.title !== undefined && !isNonEmptyString(data.title.trim(), 3)) {
      throw new AppError('O título deve ter pelo menos 3 caracteres.');
    }
    if (data.content !== undefined && !isNonEmptyString(data.content.trim(), 10)) {
      throw new AppError('O conteúdo deve ter pelo menos 10 caracteres.');
    }

    const previousImage = article.banner_image;
    const isReplacingImage = data.bannerImagePath !== undefined && data.bannerImagePath !== null;

    const updated = await articleRepository.update(id, {
      title: data.title?.trim(),
      content: data.content?.trim(),
      bannerImage: data.bannerImagePath,
    });

    if (!updated) {
      throw new NotFoundError('Artigo');
    }

    if (isReplacingImage && previousImage) {
      await removeImageFile(previousImage);
    }

    return updated;
  },

  async delete(id: number, userId: number): Promise<void> {
    const article = await this.getById(id);
    assertIsAuthor(article, userId);

    await articleRepository.delete(id);
    await removeImageFile(article.banner_image);
  },
};
