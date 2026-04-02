'use client';

/**
 * tags_input-antd-T01: Add two simple tags (Alpha/Beta)
 *
 * The page shows a single centered card titled "Create rule".
 * Inside the card is a one-row form with a label "Tags" and an Ant Design Select configured in **tags** mode.
 *
 * Component configuration and affordances:
 * - The Select is empty initially (no selected tags).
 * - Placeholder text reads "Type and press Enter…".
 * - A dropdown arrow icon is on the right; clicking the field also focuses the internal text input.
 * - Pressing Enter commits the current text as a tag (chip) in the selector.
 *
 * There are no other interactive components on the card (no clutter), and the Tags field is the only tags-input instance on the page.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): alpha, beta.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['alpha', 'beta'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card title="Create rule" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Tags</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Type and press Enter…"
          value={tags}
          onChange={setTags}
          data-testid="tags-input"
          open={false}
          tokenSeparators={[',']}
        />
      </div>
    </Card>
  );
}
