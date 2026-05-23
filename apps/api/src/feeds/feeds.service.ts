import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FeedsRepository } from './feeds.repository';
import { CreateFeedInput, UpdateFeedInput } from './dto/create-feed.dto';

@Injectable()
export class FeedsService {
  constructor(private feeds: FeedsRepository) {}

  async findAll(userId: string) {
    return this.feeds.findByUserId(userId);
  }

  async findOne(id: string, userId: string) {
    const feed = await this.feeds.findById(id);
    if (!feed) throw new NotFoundException('Feed not found');
    if ((feed as { user_id: string }).user_id !== userId) throw new ForbiddenException();
    return feed;
  }

  async create(userId: string, input: CreateFeedInput) {
    return this.feeds.create(userId, input);
  }

  async update(id: string, userId: string, input: UpdateFeedInput) {
    await this.findOne(id, userId);
    return this.feeds.update(id, input);
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.feeds.delete(id);
  }

  async enqueueRefresh(id: string, userId: string) {
    await this.findOne(id, userId); // validates ownership
    // Import boss dynamically to avoid circular dependencies
    const { boss } = await import('../worker/feed-scheduler');
    await boss.send('feed.fetch', { feedId: id });
    return { success: true };
  }
}