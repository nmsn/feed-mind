import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { AiService } from './ai.service';
import { SummarizeSchema, FilterSchema, AnswerSchema } from './dto/summarize.dto';
import type { Request } from 'express';

@Controller('ai')
export class AiController {
  constructor(private ai: AiService) {}

  @Post('summarize')
  async summarize(@Body() body: unknown, @Req() req: Request) {
    const input = SummarizeSchema.parse(body);
    const userId = (req as { user: { id: string } }).user?.id;
    return this.ai.summarizeArticle(input.articleId, userId);
  }

  @Post('answer')
  async answer(@Body() body: unknown, @Req() req: Request) {
    const input = AnswerSchema.parse(body);
    const userId = (req as { user: { id: string } }).user?.id;
    return this.ai.answerQuestion(input.articleId, userId, input.question);
  }

  @Get('filter/:articleId')
  async filter(@Param('articleId') articleId: string, @Req() req: Request) {
    return this.ai.filterArticle(articleId);
  }
}