# FeedMind Database Schema

## Tables

### users
用户表
- id: string (primary key)
- email: string (unique)
- name: string
- avatarUrl: string (optional)
- passwordHash: string (optional, for credentials auth)
- createdAt: timestamp
- updatedAt: timestamp

### sessions
会话表 (better-auth)
- id: string (primary key)
- userId: string (FK to users)
- expiresAt: timestamp
- createdAt: timestamp

### rss_sources
RSS 源表
- id: string (primary key)
- userId: string (FK to users)
- name: string
- url: string
- description: string (optional)
- iconUrl: string (optional)
- category: string (optional)
- isActive: boolean (default true)
- lastFetchedAt: timestamp (optional)
- createdAt: timestamp
- updatedAt: timestamp

### articles
文章表
- id: string (primary key)
- sourceId: string (FK to rss_sources)
- title: string
- url: string
- author: string (optional)
- description: string (optional)
- content: string (optional)
- imageUrl: string (optional)
- publishedAt: timestamp
- createdAt: timestamp
- updatedAt: timestamp

### reading_items
阅读项表 (用户的稍后阅读)
- id: string (primary key)
- userId: string (FK to users)
- articleId: string (FK to articles)
- status: enum ('unread', 'reading', 'read', 'saved')
- progress: number (0-1, optional)
- aiSummary: string (optional)
- createdAt: timestamp
- updatedAt: timestamp

### ai_annotations
AI 标注表
- id: string (primary key)
- readingItemId: string (FK to reading_items)
- type: enum ('summary', 'highlight', 'question', 'answer')
- content: string
- createdAt: timestamp