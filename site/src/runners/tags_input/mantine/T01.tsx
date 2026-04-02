'use client';

/**
 * tags_input-mantine-T01: Add two tags in Mantine TagsInput
 *
 * The page shows a single centered card titled "Scratchpad".
 * Inside is a Mantine **TagsInput** component labeled "Tags".
 *
 * Component behavior (default):
 * - The input accepts free text values.
 * - Pressing Enter submits the current text as a tag pill.
 * - Submitted values render as pills inside the input, each with a small remove icon.
 *
 * Initial state:
 * - No tags are selected.
 *
 * There are no other inputs or overlays on the page.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): notes, ideas.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['notes', 'ideas'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Scratchpad</Text>
      <TagsInput
        label="Tags"
        placeholder="Type and press Enter..."
        value={tags}
        onChange={setTags}
        data-testid="tags-input"
      />
    </Card>
  );
}
