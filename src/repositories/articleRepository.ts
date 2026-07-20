import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { Article, ArticleWithAuthor } from '../types';

interface ArticleRow extends ArticleWithAuthor, RowDataPacket {}

const SELECT_WITH_AUTHOR = `
  SELECT
    articles.id,
    articles.title,
    articles.content,
    articles.banner_image,
    articles.author_id,
    articles.published_at,
    articles.updated_at,
    users.name AS author_name
  FROM articles
  INNER JOIN users ON users.id = articles.author_id
`;

export const articleRepository = {
  async findAll(): Promise<ArticleWithAuthor[]> {
    const [rows] = await pool.query<ArticleRow[]>(
      `${SELECT_WITH_AUTHOR} ORDER BY articles.published_at DESC`,
    );
    return rows;
  },

  async findById(id: number): Promise<ArticleWithAuthor | null> {
    const [rows] = await pool.query<ArticleRow[]>(
      `${SELECT_WITH_AUTHOR} WHERE articles.id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ?? null;
  },

  async create(data: {
    title: string;
    content: string;
    bannerImage: string | null;
    authorId: number;
  }): Promise<ArticleWithAuthor> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO articles (title, content, banner_image, author_id, published_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [data.title, data.content, data.bannerImage, data.authorId],
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error('Falha ao recuperar artigo recém-criado.');
    }
    return created;
  },

  async update(
    id: number,
    data: { title?: string; content?: string; bannerImage?: string | null },
  ): Promise<ArticleWithAuthor | null> {
    const fields: string[] = [];
    const values: Array<string | null> = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.content !== undefined) {
      fields.push('content = ?');
      values.push(data.content);
    }
    if (data.bannerImage !== undefined) {
      fields.push('banner_image = ?');
      values.push(data.bannerImage);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = NOW()');
    values.push(String(id));

    await pool.query(`UPDATE articles SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM articles WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async existsById(id: number): Promise<Article | null> {
    const [rows] = await pool.query<(Article & RowDataPacket)[]>(
      'SELECT * FROM articles WHERE id = ? LIMIT 1',
      [id],
    );
    return rows[0] ?? null;
  },
};
