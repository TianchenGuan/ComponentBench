import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific feed_infinite_scroll components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Feed item for news/article/log feeds
 */
export interface FeedItem {
  id: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  isUnread?: boolean;
  isStarred?: boolean;
  icon?: string;
  iconColor?: string;
  tag?: string;
  tagColor?: string;
  details?: string;
}

/**
 * Generate feed items with a prefix and count
 */
export function generateFeedItems(
  prefix: string,
  startIndex: number,
  count: number,
  titleGenerator: (index: number) => string,
  options?: {
    unreadRatio?: number;
    starredRatio?: number;
  }
): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = startIndex; i < startIndex + count; i++) {
    const id = `${prefix}-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titleGenerator(i),
      subtitle: `Updated ${Math.floor(Math.random() * 24) + 1}h ago`,
      isUnread: options?.unreadRatio ? Math.random() < options.unreadRatio : undefined,
      isStarred: options?.starredRatio ? Math.random() < options.starredRatio : undefined,
      details: `Details for ${id}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    });
  }
  return items;
}

/**
 * Common news article titles
 */
export const NEWS_TITLES: Record<number, string> = {
  1: 'Morning market opens',
  2: 'Tech stocks rally',
  3: 'New legislation proposed',
  4: 'Weather forecast update',
  5: 'Sports championship results',
  6: 'Healthcare reform bill',
  7: 'Economic indicators rise',
  8: 'City council approves new park',
  9: 'Innovation summit announced',
  10: 'Quarterly earnings report',
  11: 'Museum opens new exhibit',
  12: 'Infrastructure funding approved',
  13: 'Environmental study released',
  14: 'Community event scheduled',
  15: 'Research breakthrough',
  16: 'Market analysis report',
  17: 'Policy changes announced',
  18: 'Technology update released',
  19: 'Budget proposal submitted',
  20: 'Transportation plan unveiled',
};

/**
 * Get title for a news item by index
 */
export function getNewsTitleByIndex(index: number): string {
  return NEWS_TITLES[index] || `News item ${index}`;
}
