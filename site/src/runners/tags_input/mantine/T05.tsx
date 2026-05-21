'use client';

/**
 * tags_input-mantine-T05: Filter suggestions and edit only Exclude tags
 *
 * The scene is a **form section** anchored to the bottom-left of the viewport.
 * Two Mantine TagsInput components are stacked with clear labels:
 * - "Include tags" (distractor)
 * - "Exclude tags" (target)
 *
 * Suggestions and search:
 * - Both fields are configured with a shared suggestions dataset (~30 content labels).
 * - When typing, the dropdown filters options by label substring.
 * - Selecting a suggestion adds it as a pill; custom values are also allowed but not needed.
 *
 * Initial state:
 * - Include tags starts with pills: "news", "sports".
 * - Exclude tags starts empty.
 *
 * Clutter:
 * - A small checkbox "Apply to archived posts" is shown below the fields (not required for success).
 *
 * Success: The target Tags Input component (Exclude tags) contains exactly these tags (order does not matter): spam, ads.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const suggestions = [
  'news', 'sports', 'entertainment', 'tech', 'science',
  'health', 'business', 'politics', 'weather', 'local',
  'world', 'opinion', 'lifestyle', 'travel', 'food',
  'arts', 'culture', 'education', 'jobs', 'real-estate',
  'auto', 'fashion', 'gaming', 'music', 'movies',
  'spam', 'ads', 'clickbait', 'fake', 'outdated'
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [includeTags, setIncludeTags] = React.useState<string[]>(['news', 'sports']);
  const [excludeTags, setExcludeTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = excludeTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['spam', 'ads'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    // Also verify include tags remain unchanged
    const includeUnchanged = includeTags.length === 2 && 
      includeTags.includes('news') && 
      includeTags.includes('sports');
    
    if (isSuccess && includeUnchanged && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [excludeTags, includeTags, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Content Filters</Text>
      
      <TagsInput
        label="Include tags"
        placeholder="Select tags to include..."
        value={includeTags}
        onChange={setIncludeTags}
        data={suggestions}
        mb="md"
        data-testid="include-tags-input"
        aria-label="Include tags"
      />

      <TagsInput
        label="Exclude tags"
        placeholder="Select tags to exclude..."
        value={excludeTags}
        onChange={setExcludeTags}
        data={suggestions}
        mb="md"
        data-testid="exclude-tags-input"
        aria-label="Exclude tags"
      />

      <Checkbox label="Apply to archived posts" size="sm" />
    </Card>
  );
}
