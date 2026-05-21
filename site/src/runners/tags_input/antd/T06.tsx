'use client';

/**
 * tags_input-antd-T06: Paste comma-separated tags (tokenization enabled)
 *
 * The UI is a compact "Label editor" card anchored near the top-right of the viewport.
 * It contains one form field labeled "Tags" implemented with Ant Design Select in **tags** mode.
 *
 * Component configuration:
 * - Spacing mode is **compact** and the Select uses the **small** size variant.
 * - Automatic tokenization is enabled via token separators: comma (,) and semicolon (;). This means pasted/typed text containing separators will be split into individual tags when committed.
 * - The dropdown suggestions are disabled for this task (no option list), so tags must be created from text input.
 *
 * Initial state:
 * - The Tags field starts empty.
 *
 * Feedback:
 * - Each committed token appears as a small chip inside the field; chips may wrap to a second line due to the small width.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): red, green, blue.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['red', 'green', 'blue'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card title="Label editor" style={{ width: 280 }} size="small">
      <div>
        <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Tags</Text>
        <Select
          mode="tags"
          size="small"
          style={{ width: '100%' }}
          placeholder="Type tags separated by commas..."
          value={tags}
          onChange={setTags}
          tokenSeparators={[',', ';']}
          data-testid="tags-input"
          open={false}
        />
      </div>
    </Card>
  );
}
