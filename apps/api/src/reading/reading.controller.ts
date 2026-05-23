import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Query } from '@nestjs/common';
import { ReadingService } from './reading.service';
import { CreateReadingItemSchema, UpdateReadingItemSchema } from './dto/create-reading-item.dto';
import type { Request } from 'express';

@Controller('reading')
export class ReadingController {
  constructor(private reading: ReadingService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.reading.findAll(userId, parseInt(limit || '50'), parseInt(offset || '0'));
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.reading.findByStatus(userId, status, parseInt(limit || '50'), parseInt(offset || '0'));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.reading.findOne(id, userId);
  }

  @Post()
  async create(@Body() body: unknown, @Req() req: Request) {
    const input = CreateReadingItemSchema.parse(body);
    const userId = (req as { user: { id: string } }).user?.id;
    return this.reading.create(userId, input);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: unknown, @Req() req: Request) {
    const input = UpdateReadingItemSchema.parse(body);
    const userId = (req as { user: { id: string } }).user?.id;
    return this.reading.update(id, userId, input);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.reading.delete(id, userId);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.reading.markAsRead(id, userId);
  }

  @Post(':id/save')
  async markAsSaved(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as { user: { id: string } }).user?.id;
    return this.reading.markAsSaved(id, userId);
  }
}