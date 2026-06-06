import React, { useState } from 'react';
import {
  ClassicThreeColumnLayout,
  Sidebar,
  ArticleList,
  Reader,
} from '@feed-mind/ui';
import { useFeeds, useCreateFeed, useRefreshFeed } from './hooks/useFeeds';
import { useArticles, useArticle } from './hooks/useArticles';
import { formatRelativeTime } from './utils/format-relative-time';

function AddFeedForm({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const createFeed = useCreateFeed();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createFeed.mutateAsync({ name: name || url, url });
      onClose();
    } catch {
      setError('Failed to add feed');
    }
  };

  return (
    <div className="p-4 border-b">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Feed name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        />
        <input
          type="url"
          placeholder="Feed URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded text-sm"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
            Add
          </button>
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Mock user for testing RSS functionality without database
const MOCK_USER = { id: '1', email: 'test@test.com', name: 'Test User' };

function App() {
  // Bypass auth for testing - always use mock user
  const user = MOCK_USER;

  const { data: feeds = [], isLoading: feedsLoading, isError: feedsError, refetch: refetchFeeds } = useFeeds();
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [view, setView] = useState<'all' | 'unread' | 'starred'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [showAddFeed, setShowAddFeed] = useState(false);

  // 选中订阅源时才拉取文章列表
  const {
    data: articles = [],
    isLoading: articlesLoading,
    isError: articlesError,
    refetch: refetchArticles,
  } = useArticles(selectedFeedId ?? undefined);

  // 选中文章时才拉取详情
  const {
    data: selectedArticle,
    isLoading: articleLoading,
    isError: articleError,
  } = useArticle(selectedArticleId ?? '');

  // 刷新当前选中订阅源
  const refreshFeed = useRefreshFeed();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const handleRefreshFeed = async () => {
    if (!selectedFeedId) return;
    setRefreshing(true);
    setRefreshError(null);
    try {
      await refreshFeed.mutateAsync(selectedFeedId);
      // 成功后让文章列表立即重新拉取（hook 自身也会 invalidate，但显式调用更可控）
      refetchArticles();
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : '刷新失败');
    } finally {
      setRefreshing(false);
    }
  };

  // 当前选中订阅源的名称（用于阅读面板的 feedTitle）
  const currentFeedName = selectedFeedId
    ? feeds.find((f: { id: string }) => f.id === selectedFeedId)?.name
    : undefined;

  // 文章按时间排序（newest 优先）
  const sortedArticles = [...articles].sort((a, b) => {
    const ta = new Date(a.published_at as string | number | Date).getTime();
    const tb = new Date(b.published_at as string | number | Date).getTime();
    return sort === 'newest' ? tb - ta : ta - tb;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">FeedMind</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
            <span className="text-xs text-muted-foreground">(Demo Mode)</span>
          </div>
        </nav>
      </header>

      <ClassicThreeColumnLayout>
        {/* Sidebar: Feed list */}
        <Sidebar className="p-0">
          {showAddFeed ? (
            <AddFeedForm onClose={() => setShowAddFeed(false)} />
          ) : (
            <button
              onClick={() => setShowAddFeed(true)}
              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-accent border-b"
            >
              + Add Feed
            </button>
          )}
          <div className="p-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Feeds
            </h2>
            {feedsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : feedsError ? (
              <div className="space-y-2">
                <p className="text-sm text-red-500">加载订阅源失败</p>
                <button
                  onClick={() => refetchFeeds()}
                  className="text-xs text-primary hover:underline"
                >
                  重试
                </button>
              </div>
            ) : feeds.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无订阅源，请添加</p>
            ) : (
              <ul className="space-y-1">
                {feeds.map((feed: { id: string; name: string }) => (
                  <li key={feed.id}>
                    <button
                      onClick={() => {
                        setSelectedFeedId(feed.id);
                        setSelectedArticleId(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                        selectedFeedId === feed.id ? 'bg-accent' : 'hover:bg-accent'
                      }`}
                    >
                      <span className="truncate">{feed.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-4 px-4">
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

          <div className="px-4">
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
          {!selectedFeedId ? (
            <p className="p-4 text-sm text-muted-foreground">请选择订阅源</p>
          ) : articlesLoading ? (
            <p className="p-4 text-sm text-muted-foreground">加载中…</p>
          ) : articlesError ? (
            <p className="p-4 text-sm text-red-500">加载文章失败</p>
          ) : sortedArticles.length === 0 ? (
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">暂无文章</p>
              <button
                onClick={handleRefreshFeed}
                disabled={refreshing}
                className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md disabled:opacity-50"
              >
                {refreshing ? '刷新中…' : '刷新订阅源'}
              </button>
              {refreshError && (
                <p className="text-xs text-red-500">{refreshError}</p>
              )}
            </div>
          ) : (
            <ul className="divide-y">
              {sortedArticles.map((article: {
                id: string;
                title: string;
                author?: string | null;
                published_at: string | number | Date;
                description?: string | null;
              }) => (
                <li key={article.id}>
                  <button
                    onClick={() => setSelectedArticleId(article.id)}
                    className={`w-full text-left p-3 hover:bg-accent transition-colors ${
                      selectedArticleId === article.id ? 'bg-accent' : ''
                    }`}
                  >
                    <h3 className="text-sm line-clamp-2 mb-1">{article.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {article.author && <span>{article.author}</span>}
                      {article.author && <span>·</span>}
                      <span>{formatRelativeTime(article.published_at)}</span>
                    </div>
                    {article.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ArticleList>

        {/* Reader */}
        <Reader className="p-6">
          {!selectedArticleId ? (
            <p className="text-sm text-muted-foreground">请选择文章</p>
          ) : articleLoading ? (
            <p className="text-sm text-muted-foreground">加载中…</p>
          ) : articleError || !selectedArticle ? (
            <p className="text-sm text-red-500">加载文章失败</p>
          ) : (
            <article className="max-w-2xl mx-auto">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {currentFeedName ?? ''}
                </p>
                <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {selectedArticle.author && <span>By {selectedArticle.author}</span>}
                  {selectedArticle.author && <span>·</span>}
                  <span>{formatRelativeTime(selectedArticle.published_at)}</span>
                </div>
              </div>
              <div
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    (selectedArticle.content as string | null | undefined) ??
                    (selectedArticle.description as string | null | undefined) ??
                    '',
                }}
              />
            </article>
          )}
        </Reader>
      </ClassicThreeColumnLayout>
    </div>
  );
}

export default App;
