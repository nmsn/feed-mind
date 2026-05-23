import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FeedsRepository {
  constructor(private db: DatabaseService) {}

  async findByUserId(userId: string) {
    return this.db.query(
      'SELECT * FROM rss_sources WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
  }

  async findById(id: string) {
    return this.db.queryOne('SELECT * FROM rss_sources WHERE id = $1', [id]);
  }

  async create(userId: string, input: { name: string; url: string; description?: string; category?: string }) {
    const id = crypto.randomUUID();
    const now = new Date();
    await this.db.query(
      `INSERT INTO rss_sources (id, user_id, name, url, description, category, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8)`,
      [id, userId, input.name, input.url, input.description || null, input.category || null, now, now]
    );
    return this.findById(id);
  }

  async update(id: string, input: { name?: string; description?: string; category?: string; isActive?: boolean }) {
    const sets: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (input.name !== undefined) {
      sets.push(`name = $${paramIndex++}`);
      params.push(input.name);
    }
    if (input.description !== undefined) {
      sets.push(`description = $${paramIndex++}`);
      params.push(input.description);
    }
    if (input.category !== undefined) {
      sets.push(`category = $${paramIndex++}`);
      params.push(input.category);
    }
    if (input.isActive !== undefined) {
      sets.push(`is_active = $${paramIndex++}`);
      params.push(input.isActive);
    }

    if (sets.length === 0) return this.findById(id);

    sets.push(`updated_at = $${paramIndex++}`);
    params.push(new Date());
    params.push(id);

    await this.db.query(
      `UPDATE rss_sources SET ${sets.join(', ')} WHERE id = $${paramIndex}`,
      params
    );
    return this.findById(id);
  }

  async delete(id: string) {
    await this.db.query('DELETE FROM rss_sources WHERE id = $1', [id]);
  }

  async updateLastFetched(id: string, lastFetchedAt: Date) {
    await this.db.query(
      'UPDATE rss_sources SET last_fetched_at = $1, updated_at = $2 WHERE id = $3',
      [lastFetchedAt, new Date(), id]
    );
  }
}