'use client';

/**
 * tags_input-mantine-T03: Clear tags using Mantine clear button
 *
 * The page is a centered card titled "Tag cleanup".
 * It contains a Mantine TagsInput labeled "Tags".
 *
 * Component configuration:
 * - `clearable` is enabled, so a clear button appears in the right section when the component has a value.
 * - Each tag pill also has a remove icon.
 *
 * Initial state:
 * - The field starts with three tags: "React", "Angular", "Svelte".
 *
 * Feedback:
 * - Clearing removes all pills immediately; there is no confirmation dialog.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): (empty).
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>(['React', 'Angular', 'Svelte']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (tags.length === 0 && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tag cleanup</Text>
      <TagsInput
        label="Tags"
        placeholder="Add tags..."
        value={tags}
        onChange={setTags}
        clearable
        data-testid="tags-input"
      />
    </Card>
  );
}
