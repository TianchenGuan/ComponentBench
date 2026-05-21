'use client';

/**
 * tags_input-mantine-T02: Select two suggested tags from Mantine TagsInput
 *
 * The UI is an isolated centered card titled "Libraries".
 * It contains one Mantine TagsInput labeled "Tags".
 *
 * Suggestions:
 * - The TagsInput is configured with a small suggestions list (data) containing: React, Angular, Vue, Svelte.
 * - When the field is focused, a dropdown list appears under the input with these suggestions.
 * - Selecting a suggestion adds it as a pill; the user can still type custom values, but this task asks for the suggested ones.
 *
 * Initial state:
 * - The field starts empty.
 *
 * No other interactive elements appear on the card.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): React, Svelte.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const suggestions = ['React', 'Angular', 'Vue', 'Svelte'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Case-sensitive comparison for this task
    const requiredTags = ['React', 'Svelte'];
    const isSuccess = requiredTags.length === tags.length &&
      requiredTags.every(t => tags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Libraries</Text>
      <TagsInput
        label="Tags"
        placeholder="Select frameworks..."
        value={tags}
        onChange={setTags}
        data={suggestions}
        data-testid="tags-input"
      />
    </Card>
  );
}
