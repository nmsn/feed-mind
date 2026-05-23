import { boss } from './feed-scheduler';
import { RssService } from '../rss/rss.service';
import { ArticlesService } from '../articles/articles.service';

export function registerFeedProcessors(rssService: RssService, articlesService: ArticlesService) {
  // Process individual feed fetch jobs
  boss.work('feed.fetch', { concurrency: 3 }, async (args: { feedId: string }) => {
    console.log(`Processing feed: ${args.feedId}`);
    try {
      const result = await articlesService.refreshFeed(args.feedId);
      console.log(`Fetched ${result.newArticles?.length || 0} new articles from feed ${args.feedId}`);
      return result;
    } catch (error) {
      console.error(`Failed to fetch feed ${args.feedId}:`, error);
      throw error;
    }
  });

  // Process scheduled refresh check
  boss.work('feed-refresh-scheduler', { concurrency: 1 }, async () => {
    console.log('Running feed refresh scheduler...');
    // This would query for feeds that need refresh based on their refresh interval
    // and enqueue feed.fetch jobs for each one
  });
}