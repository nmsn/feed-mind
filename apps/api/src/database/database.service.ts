import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      connectionString: this.configService.get('DATABASE_URL'),
    });
  }

  getPool(): Pool {
    return this.pool;
  }

  async query<T>(text: string, params?: unknown[]): Promise<T[]> {
    const result = await this.pool.query(text, params);
    return result.rows as T[];
  }

  async queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
    const result = await this.pool.query(text, params);
    return (result.rows[0] as T) || null;
  }
}