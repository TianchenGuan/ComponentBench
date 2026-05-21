'use client';

/**
 * tags_input-antd-T04: Match tags to the visual reference badges
 *
 * The page is a centered card titled "Audience builder".
 *
 * The card has two sections:
 * 1) A small "Target badges" row that visually shows **two** colored badges: "newsletter" and "events".
 * 2) A form field labeled "Tags" implemented with Ant Design Select in **tags** mode (this is the only interactive component that matters).
 *
 * Initial state:
 * - The Tags field starts with one incorrect tag chip: "promo".
 *
 * Behavior:
 * - The agent must make the Tags field match the visual "Target badges" row.
 * - Tags are displayed as chips in the Select; each chip has a remove icon.
 * - The dropdown contains a few suggested tags (including newsletter and events), but free typing is also allowed.
 *
 * There are no other form fields; the visual badges are static and non-clickable (they only serve as the reference).
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): newsletter, events.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Select, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const suggestions = [
  { value: 'newsletter', label: 'newsletter' },
  { value: 'events', label: 'events' },
  { value: 'promo', label: 'promo' },
  { value: 'updates', label: 'updates' },
  { value: 'alerts', label: 'alerts' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>(['promo']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['newsletter', 'events'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card title="Audience builder" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
          Target badges
        </Text>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Tag color="blue">newsletter</Tag>
          <Tag color="green">events</Tag>
        </div>
      </div>
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Tags</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Select or type tags..."
          value={tags}
          onChange={setTags}
          options={suggestions}
          data-testid="tags-input"
        />
      </div>
    </Card>
  );
}
