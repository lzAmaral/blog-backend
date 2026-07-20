import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { User } from '../types';

interface UserRow extends User, RowDataPacket {}

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1',
      [email],
    );
    return rows[0] ?? null;
  },

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE id = ? LIMIT 1',
      [id],
    );
    return rows[0] ?? null;
  },

  async create(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [data.name, data.email, data.passwordHash],
    );

    const createdUser = await this.findById(result.insertId);
    if (!createdUser) {
      throw new Error('Falha ao recuperar usuário recém-criado.');
    }
    return createdUser;
  },
};
