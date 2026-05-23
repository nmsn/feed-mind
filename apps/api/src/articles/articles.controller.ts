import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private articles: ArticlesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articles.findOne(id);
  }

  @Get('source/:sourceId')
  async findBySource(
    @Param('sourceId') sourceId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.articles.findBySourceId(sourceId, parseInt(limit || '20'), parseInt(offset || '0'));
  }
}