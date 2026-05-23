import { boss } from './feed-scheduler';
import { ArticlesRepository } from '../articles/articles.repository';
import { ReadingRepository } from '../reading/reading.repository';
import { AnnotationsRepository } from '../annotations/annotations.repository';
import { ClaudeClient } from '../ai/clients/claude.client';

export function registerAiAnswerProcessor(
  articlesRepo: ArticlesRepository,
  readingRepo: ReadingRepository,
  annotationsRepo: AnnotationsRepository
) {
  const claudeClient = new ClaudeClient();

  boss.work('ai.answer', { concurrency: 2 }, async (args: { articleId: string; userId: string; question: string }) => {
    console.log(`AI answering question for article: ${args.articleId}`);

    const article = await articlesRepo.findById(args.articleId);
    if (!article) {
      console.error(`Article not found: ${args.articleId}`);
      return;
    }

    const content = (article as { content?: string }).content ||
      (article as { description?: string }).description || '';

    try {
      const result = await claudeClient.answer(content, args.question);

      const readingItem = await readingRepo.findByUserAndArticle(args.userId, args.articleId);
      if (readingItem) {
        const id = crypto.randomUUID();
        await annotationsRepo.create({
          id,
          readingItemId: readingItem.id,
          type: 'answer',
          content: `Q: ${args.question}\n\nA: ${result.answer}`,
        });
      }

      return result;
    } catch (error) {
      console.error(`AI answer failed for ${args.articleId}:`, error);
      throw error;
    }
  });
}