import { boss } from './feed-scheduler';
import { ArticlesRepository } from '../articles/articles.repository';
import { ReadingRepository } from '../reading/reading.repository';
import { AnnotationsRepository } from '../annotations/annotations.repository';
import { ClaudeClient } from '../ai/clients/claude.client';

export function registerAiProcessors(
  articlesRepo: ArticlesRepository,
  readingRepo: ReadingRepository,
  annotationsRepo: AnnotationsRepository
) {
  const claudeClient = new ClaudeClient();

  boss.work('ai.summarize', { concurrency: 2 }, async (args: { articleId: string; userId: string }) => {
    console.log(`AI summarizing article: ${args.articleId}`);

    const article = await articlesRepo.findById(args.articleId);
    if (!article) {
      console.error(`Article not found: ${args.articleId}`);
      return;
    }

    const content = (article as { content?: string }).content ||
      (article as { description?: string }).description || '';

    if (!content) {
      console.error(`No content to summarize for article: ${args.articleId}`);
      return;
    }

    try {
      const result = await claudeClient.summarize(content);

      const readingItem = await readingRepo.findByUserAndArticle(args.userId, args.articleId);
      if (readingItem) {
        await readingRepo.update(readingItem.id, { status: 'reading' });
      }

      if (readingItem) {
        const id = crypto.randomUUID();
        await annotationsRepo.create({
          id,
          readingItemId: readingItem.id,
          type: 'summary',
          content: result.summary,
        });
      }

      console.log(`AI summary complete for article: ${args.articleId}`);
      return result;
    } catch (error) {
      console.error(`AI summarize failed for ${args.articleId}:`, error);
      throw error;
    }
  });
}