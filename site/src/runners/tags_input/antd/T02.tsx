'use client';

/**
 * tags_input-antd-T02: Pick three fruit tags from suggestions
 *
 * The page is a centered "Product metadata" card (isolated card layout).
 * There is a single form control labeled "Tags" implemented with Ant Design Select in **tags** mode.
 *
 * Component configuration:
 * - The Select has a predefined suggestions list that appears in a dropdown when the field is focused/opened.
 * - Suggested options include: apple, banana, cherry, date, fig, grape (and a few others).
 * - The field starts empty.
 * - Selecting an option adds it as a tag chip inside the field; the dropdown stays open until dismissed.
 *
 * No other tags inputs are present; a non-functional "Help" link appears below the card as a benign distractor.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): apple, banana, cherry.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Link } = Typography;

const fruitOptions = [
  { value: 'apple', label: 'apple' },
  { value: 'banana', label: 'banana' },
  { value: 'cherry', label: 'cherry' },
  { value: 'date', label: 'date' },
  { value: 'fig', label: 'fig' },
  { value: 'grape', label: 'grape' },
  { value: 'kiwi', label: 'kiwi' },
  { value: 'lemon', label: 'lemon' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['apple', 'banana', 'cherry'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <div>
      <Card title="Product metadata" style={{ width: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Tags</Text>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Select tags..."
            value={tags}
            onChange={setTags}
            options={fruitOptions}
            data-testid="tags-input"
          />
        </div>
      </Card>
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Link type="secondary" style={{ fontSize: 12 }}>Help</Link>
      </div>
    </div>
  );
}
