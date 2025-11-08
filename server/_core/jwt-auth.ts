import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '@shared/const';
import { ENV } from './env';
import { getUserById } from '../db';
import type { User } from '../../drizzle/schema';

interface JWTPayload {
  userId: number;
  openId: string;
  role: 'aluno' | 'mentor' | 'gestor';
}

/**
 * Autentica requisição usando JWT do cookie
 * Extrai o token do cookie, verifica e retorna o usuário do banco de dados
 */
export async function authenticateJWTRequest(req: Request): Promise<User | null> {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    
    if (!token) {
      return null;
    }

    // Verificar e decodificar JWT
    const decoded = jwt.verify(token, ENV.jwtSecret) as JWTPayload;
    
    if (!decoded.userId) {
      return null;
    }

    // Buscar usuário no banco de dados
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('[JWT Auth] Erro ao autenticar:', error);
    return null;
  }
}
