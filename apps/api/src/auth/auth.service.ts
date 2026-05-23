import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DatabaseService } from '../database/database.service';
import { SignUpInput, SignInInput } from './dto/auth.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private db: DatabaseService
  ) {}

  async signUp(input: SignUpInput) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }
    return this.users.create(input);
  }

  async signIn(input: SignInInput) {
    const user = await this.users.findByEmail(input.email);
    if (!user || !('password_hash' in user)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = this.users.verifyPassword(input.password, user.password_hash as string);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async createSession(userId: string) {
    const id = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await this.db.query(
      'INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES ($1, $2, $3, $4)',
      [id, userId, expiresAt, new Date()]
    );
    return { sessionId: id, expiresAt };
  }

  async validateSession(sessionId: string) {
    const session = await this.db.queryOne(
      'SELECT * FROM sessions WHERE id = $1 AND expires_at > NOW()',
      [sessionId]
    );
    if (!session) return null;
    return this.users.findById((session as { user_id: string }).user_id);
  }
}