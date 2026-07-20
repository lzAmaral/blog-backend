import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { userRepository } from '../repositories/userRepository';
import { AppError, ConflictError, UnauthorizedError } from '../utils/AppError';
import { isNonEmptyString, isStrongEnoughPassword, isValidEmail } from '../utils/validators';
import { CreateUserDTO, LoginDTO, PublicUser } from '../types';

const SALT_ROUNDS = 10;

function toPublicUser(user: { id: number; name: string; email: string; created_at: Date }): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
}

function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, env.jwt.secret, { expiresIn: env.jwt.expiresIn } as jwt.SignOptions);
}

export const authService = {
  async register(data: CreateUserDTO): Promise<{ user: PublicUser; token: string }> {
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();

    if (!isNonEmptyString(name, 2)) {
      throw new AppError('O nome deve ter pelo menos 2 caracteres.');
    }
    if (!isValidEmail(email ?? '')) {
      throw new AppError('Informe um e-mail válido.');
    }
    if (!isStrongEnoughPassword(data.password)) {
      throw new AppError('A senha deve ter pelo menos 6 caracteres.');
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Já existe uma conta cadastrada com este e-mail.');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await userRepository.create({ name, email, passwordHash });
    const token = generateToken(user.id, user.email);

    return { user: toPublicUser(user), token };
  },

  async login(data: LoginDTO): Promise<{ user: PublicUser; token: string }> {
    const email = data.email?.trim().toLowerCase();

    if (!isValidEmail(email ?? '') || !isNonEmptyString(data.password)) {
      throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
    if (!passwordMatches) {
      throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    const token = generateToken(user.id, user.email);
    return { user: toPublicUser(user), token };
  },

  async getProfile(userId: number): Promise<PublicUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado.');
    }
    return toPublicUser(user);
  },
};
