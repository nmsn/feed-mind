import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

/**
 * 默认数据 seed：mock user + 4 个默认 RSS 订阅源。
 * 启动时由 bootstrap 调用，幂等（重复启动不报错）。
 *
 * 与 web 端 apps/web/src/app.tsx 中的 MOCK_USER（id='1', email='test@test.com'）
 * 对齐，使 web 端直接看到这些默认订阅源。
 */
@Injectable()
export class DefaultFeedsSeed {
  private readonly logger = new Logger(DefaultFeedsSeed.name);

  constructor(private db: DatabaseService) {}

  async run() {
    await this.ensureMockUser();
    await this.ensureDefaultFeeds();
  }

  private async ensureMockUser() {
    const existing = await this.db.queryOne('SELECT id FROM users WHERE id = $1', ['1']);
    if (existing) return;

    const now = Math.floor(Date.now() / 1000);
    await this.db.query(
      `INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['1', 'test@test.com', 'Demo User', null, now, now]
    );
    this.logger.log('Seeded mock user (id=1, email=test@test.com)');
  }

  private async ensureDefaultFeeds() {
    // 仅当该 mock user 还没有任何订阅源时插入默认列表
    const existing = await this.db.queryOne(
      'SELECT COUNT(*) as count FROM rss_sources WHERE user_id = $1',
      ['1']
    );
    const count = Number((existing as { count?: string | number })?.count ?? 0);
    if (count > 0) return;

    const defaults = [
      { name: 'Hacker News', url: 'https://news.ycombinator.com' },
      { name: 'TechCrunch', url: 'https://techcrunch.com' },
      { name: 'The Verge', url: 'https://theverge.com' },
      { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
    ];

    const now = Math.floor(Date.now() / 1000);
    for (const feed of defaults) {
      const id = crypto.randomUUID();
      await this.db.query(
        `INSERT INTO rss_sources (id, user_id, name, url, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'true', $5, $6)`,
        [id, '1', feed.name, feed.url, now, now]
      );
    }
    this.logger.log(`Seeded ${defaults.length} default feeds for mock user`);
  }
}
