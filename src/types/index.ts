export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export type PublicUser = Omit<User, 'password_hash'>;

export interface Article {
  id: number;
  title: string;
  content: string;
  banner_image: string | null;
  author_id: number;
  published_at: Date;
  updated_at: Date;
}

export interface ArticleWithAuthor extends Article {
  author_name: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateArticleDTO {
  title: string;
  content: string;
  bannerImagePath?: string | null;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  bannerImagePath?: string | null;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
}

// Estende o Request do Express para carregar o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}
