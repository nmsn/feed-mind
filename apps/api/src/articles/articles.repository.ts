import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArticlesRepository {
  constructor(private db: DatabaseService) {}

  async findBySourceId(sourceId: string, limit = 20, offset = 0) {
    return this.db.query(
      'SELECT * FROM articles WHERE source_id = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
      [sourceId, limit, offset]
    );
  }

  async findById(id: string) {
    return this.db.queryOne('SELECT * FROM articles WHERE id = $1', [id]);
  }

  async findByGuidOrLink(guid: string, link: string) {
    return this.db.queryOne(
      'SELECT * FROM articles WHERE guid = $1 OR link = $2',
      [guid, link]
    );
  }

  async create(article: {
    id: string;
    sourceId: string;
    title: string;
    url: string;
    author?: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    publishedAt: Date;
  }) {
    const now = new Date();
    await this.db.query(
      `INSERT INTO articles (id, source_id, title, url, author, description, content, image_url, published_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        article.id,
        article.sourceId,
        article.title,
        article.url,
        article.author || null,
        article.description || null,
        article.content || null,
        article.imageUrl || null,
        article.publishedAt,
        now,
        now,
      ]
    );
    return this.findById(article.id);
  }

  async updateContent(id: string, content: string) {
    await this.db.query(
      'UPDATE articles SET content = $1, updated_at = $2 WHERE id = $3',
      [content, new Date(), id]
    );
  }
}