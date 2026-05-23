import { boss } from './feed-scheduler';
import { ArticlesRepository } from '../articles/articles.repository';
import { extractFulltext } from '../rss/extract-fulltext';

export function registerArticleProcessors(articlesRepo: ArticlesRepository) {
  boss.work('article.fulltext-fetch', { concurrency: 4 }, async (args: { articleId: string; url: string }) => {
    console.log(`Fetching fulltext for article: ${args.articleId}`);
    try {
      const result = await extractFulltext(args.url);
      await articlesRepo.updateContent(args.articleId, result.content);
      console.log(`Fulltext fetched for article: ${args.articleId}`);
      return result;
    } catch (error) {
      console.error(`Failed to fetch fulltext for ${args.articleId}:`, error);
      throw error;
    }
  });
}