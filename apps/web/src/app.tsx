import React, { useState } from 'react';
import {
  ClassicThreeColumnLayout,
  Sidebar,
  ArticleList,
  Reader,
} from '@feed-mind/ui';

interface Feed {
  id: string;
  title: string;
  url: string;
  unreadCount: number;
}

interface Article {
  id: string;
  feedId: string;
  title: string;
  author: string;
  publishedAt: string;
  readTime: number;
  preview: string;
  isRead: boolean;
  isStarred: boolean;
}

const mockFeeds: Feed[] = [
  { id: '1', title: 'Hacker News', url: 'https://news.ycombinator.com', unreadCount: 12 },
  { id: '2', title: 'TechCrunch', url: 'https://techcrunch.com', unreadCount: 8 },
  { id: '3', title: 'The Verge', url: 'https://theverge.com', unreadCount: 5 },
  { id: '4', title: 'Ars Technica', url: 'https://arstechnica.com', unreadCount: 3 },
  { id: '5', title: 'RSS.app Blog', url: 'https://rss.app/blog', unreadCount: 21 },
];

const mockArticles: Article[] = [
  {
    id: 'a1',
    feedId: '1',
    title: 'Show HN: I built a local-first RSS reader that runs entirely in your browser',
    author: 'dev123',
    publishedAt: '2h ago',
    readTime: 4,
    preview: 'After months of work, I finally released my side project — a privacy-focused RSS reader with no server...',
    isRead: false,
    isStarred: true,
  },
  {
    id: 'a2',
    feedId: '1',
    title: 'Ask HN: What is your preferred technology stack for building web apps in 2026?',
    author: 'senior_dev',
    publishedAt: '4h ago',
    readTime: 6,
    preview: 'I have been using React for years but want to explore alternatives. What are you using nowadays...',
    isRead: false,
    isStarred: false,
  },
  {
    id: 'a3',
    feedId: '2',
    title: 'Apple announces Vision Pro 2 with neural interface',
    author: 'TechCrunch',
    publishedAt: '6h ago',
    readTime: 3,
    preview: 'The second generation Vision Pro features a non-invasive neural input system that allows users to control...',
    isRead: true,
    isStarred: false,
  },
  {
    id: 'a4',
    feedId: '3',
    title: 'The EU just voted to require all devices to use USB-C by default',
    author: 'The Verge',
    publishedAt: '8h ago',
    readTime: 2,
    preview: 'In a landmark decision, the European Union has mandated that all electronic devices sold in EU territory must...',
    isRead: false,
    isStarred: false,
  },
  {
    id: 'a5',
    feedId: '1',
    title: 'I quit my FAANG job to work on open source full-time',
    author: 'open_source_dev',
    publishedAt: '1d ago',
    readTime: 8,
    preview: 'After 8 years at Google, I decided to take the leap and focus entirely on open source. Here is what I learned...',
    isRead: false,
    isStarred: true,
  },
];

const mockReaderContent = {
  title: 'Show HN: I built a local-first RSS reader that runs entirely in your browser',
  author: 'dev123',
  publishedAt: '2h ago',
  feedTitle: 'Hacker News',
  content: `
    <p>After months of work, I finally released my side project — a privacy-focused RSS reader with no server.</p>
    <p>The app runs entirely in your browser using IndexedDB for storage. Your data never leaves your device.</p>
    <h2>Features</h2>
    <ul>
      <li>Syncs across devices using a peer-to-peer protocol</li>
      <li>Full-text search without sending your data to the cloud</li>
      <li>Custom themes and layout options</li>
      <li>Keyboard shortcuts for power users</li>
    </ul>
    <p>Would love your feedback! The code is fully open source.</p>
  `,
};

function App() {
  const [view, setView] = useState<'all' | 'unread' | 'starred'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">FeedMind</h1>
          <div className="flex gap-4">
            <a href="/login" className="text-sm hover:underline">Login</a>
            <a href="/register" className="text-sm hover:underline">Register</a>
          </div>
        </nav>
      </header>

      <ClassicThreeColumnLayout>
        {/* Sidebar: Feed list */}
        <Sidebar className="p-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Feeds
            </h2>
            <ul className="space-y-1">
              {mockFeeds.map((feed) => (
                <li key={feed.id}>
                  <button className="w-full text-left px-3 py-2 rounded-md hover:bg-accent text-sm flex items-center justify-between">
                    <span className="truncate">{feed.title}</span>
                    {feed.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {feed.unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              View
            </h2>
            <div className="flex gap-1">
              {(['all', 'unread', 'starred'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    view === v
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Sort
            </h2>
            <div className="flex gap-1">
              {(['newest', 'oldest'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    sort === s
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Sidebar>

        {/* Article list */}
        <ArticleList className="p-0">
          <div className="p-3 border-b">
            <h2 className="text-sm font-semibold">Articles</h2>
          </div>
          <ul className="divide-y">
            {mockArticles.map((article) => (
              <li key={article.id}>
                <button
                  className={`w-full text-left p-3 hover:bg-accent transition-colors ${
                    !article.isRead ? 'font-medium' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm line-clamp-2">{article.title}</h3>
                    {article.isStarred && (
                      <span className="text-yellow-500 flex-shrink-0">★</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>·</span>
                    <span>{article.publishedAt}</span>
                    <span>·</span>
                    <span>{article.readTime} min read</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {article.preview}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </ArticleList>

        {/* Reader */}
        <Reader className="p-6">
          <article className="max-w-2xl mx-auto">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                {mockReaderContent.feedTitle}
              </p>
              <h1 className="text-3xl font-bold mb-4">
                {mockReaderContent.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>By {mockReaderContent.author}</span>
                <span>·</span>
                <span>{mockReaderContent.publishedAt}</span>
              </div>
            </div>
            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: mockReaderContent.content }}
            />
          </article>
        </Reader>
      </ClassicThreeColumnLayout>
    </div>
  );
}

export default App;