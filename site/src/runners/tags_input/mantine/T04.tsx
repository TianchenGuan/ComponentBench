'use client';

/**
 * tags_input-mantine-T04: Paste pipe-separated quarter tags (splitChars enabled)
 *
 * The UI is a compact card titled "Roadmap labels" centered on the page.
 * It contains one Mantine TagsInput labeled "Tags".
 *
 * Component configuration:
 * - Spacing mode is **compact** and the input width is constrained to a medium column.
 * - `splitChars` is configured to split on comma (,), pipe (|), and spaces.
 * - Values are also split on paste, so pasting `Q1-2026|Q2-2026|Q3-2026` should create three tags once committed.
 *
 * Initial state:
 * - The field starts empty.
 *
 * Feedback:
 * - Each committed token appears as a pill; because of compact spacing, pills wrap quickly.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): Q1-2026, Q2-2026, Q3-2026.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Case-sensitive comparison
    const requiredTags = ['Q1-2026', 'Q2-2026', 'Q3-2026'];
    const isSuccess = requiredTags.length === tags.length &&
      requiredTags.every(t => tags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="md" mb="sm">Roadmap labels</Text>
      <TagsInput
        label="Tags"
        placeholder="Type or paste tags separated by , | or space"
        value={tags}
        onChange={setTags}
        splitChars={[',', '|', ' ']}
        data-testid="tags-input"
      />
    </Card>
  );
}
