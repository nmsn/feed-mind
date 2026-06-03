import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;
  private initialized = false;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;
    const databaseUrl = this.configService.get('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    this.pool = new Pool({ connectionString: databaseUrl });
    this.initialized = true;
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