import { boss } from './feed-scheduler';
import { ArticlesRepository } from '../articles/articles.repository';
import { ClaudeClient } from '../ai/clients/claude.client';

export function registerAiFilterProcessor(articlesRepo: ArticlesRepository) {
  const claudeClient = new ClaudeClient();

  boss.work('ai.filter', { concurrency: 3 }, async (args: { articleId: string; userPreferences?: string }) => {
    console.log(`AI filtering article: ${args.articleId}`);

    const article = await articlesRepo.findById(args.articleId);
    if (!article) {
      console.error(`Article not found: ${args.articleId}`);
      return;
    }

    const content = (article as { description?: string }).description || '';

    try {
      const result = await claudeClient.filter(content, args.userPreferences);
      console.log(`AI filter complete for article: ${args.articleId}, relevant: ${result.relevant}`);
      return result;
    } catch (error) {
      console.error(`AI filter failed for ${args.articleId}:`, error);
      throw error;
    }
  });
}