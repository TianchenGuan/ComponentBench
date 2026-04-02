'use client';

/**
 * tags_input-mantine-T09: Resolve validation by committing tags with Enter (no blur accept)
 *
 * The page is a **form section** titled "Create segment".
 * The target control is a Mantine TagsInput labeled "Tags".
 *
 * Component configuration:
 * - `acceptValueOnBlur` is set to **false**: typing text and clicking away does NOT add the tag. Tags are added only when the user presses Enter or clicks a suggestion.
 * - A validation hint below the field starts in an error state: "Please add exactly 3 tags".
 * - As tags are added, the error hint updates; it disappears only when there are exactly 3 tags.
 *
 * Initial state:
 * - The TagsInput is empty.
 *
 * Distractors:
 * - A "Segment name" TextInput above (already filled).
 * - A disabled "Save segment" button below that becomes enabled only when validation passes (not required to click for success; it just reflects feedback).
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): alpha, beta, gamma.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput, TextInput, Button } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  const validationError = tags.length !== 3 ? 'Please add exactly 3 tags' : undefined;

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['alpha', 'beta', 'gamma'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Create segment</Text>
      
      <TextInput
        label="Segment name"
        defaultValue="Q1 Power Users"
        mb="md"
        data-testid="segment-name-input"
      />

      <TagsInput
        label="Tags"
        placeholder="Type and press Enter..."
        value={tags}
        onChange={setTags}
        acceptValueOnBlur={false}
        error={validationError}
        mb="md"
        data-testid="tags-input"
      />

      <Button 
        disabled={tags.length !== 3}
        fullWidth
      >
        Save segment
      </Button>
    </Card>
  );
}
