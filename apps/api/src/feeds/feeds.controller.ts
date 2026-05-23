import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedSchema, UpdateFeedSchema } from './dto/create-feed.dto';
import type { Request } from 'express';

@Controller('feeds')
export class FeedsController {
  constructor(private feeds: FeedsService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.feeds.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.feeds.findOne(id, userId);
  }

  @Post()
  async create(@Body() body: unknown, @Req() req: Request) {
    const input = CreateFeedSchema.parse(body);
    const userId = (req as { user: { id: string } }).user?.id;
    return this.feeds.create(userId, input);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: unknown, @Req() req: Request) {
    const input = UpdateFeedSchema.parse(body);
    const userId = (req as { user: { id: string } }).user?.id;
    return this.feeds.update(id, userId, input);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.feeds.delete(id, userId);
  }
}