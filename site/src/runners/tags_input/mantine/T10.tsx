'use client';

/**
 * tags_input-mantine-T10: Replace a tag when maxTags limit is reached (two instances, small corner panel)
 *
 * The page shows a compact **settings panel** anchored to the bottom-right corner.
 * All inputs are rendered in a **small** size with tight spacing.
 *
 * Instances (2):
 * - "Internal labels" (distractor): TagsInput pre-filled with pills "internal", "private".
 * - "Public labels" (target): TagsInput with a hard limit `maxTags=3`.
 *
 * Initial state (target):
 * - Public labels already has 3 pills: "first", "second", "third" (the maximum).
 * - Because the max is reached, the component will not accept adding another tag until one is removed.
 *
 * Interaction:
 * - Each pill has a remove icon.
 * - New pills can be created by typing and pressing Enter.
 *
 * Clutter:
 * - A segmented control ("Visibility") sits above the tag fields, but it does not affect success.
 * - The tight corner placement reduces available space for the dropdown (though suggestions are not required for this task).
 *
 * Success: The target Tags Input component (Public labels) contains exactly these tags (order does not matter): first, second, final.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [internalLabels, setInternalLabels] = React.useState<string[]>(['internal', 'private']);
  const [publicLabels, setPublicLabels] = React.useState<string[]>(['first', 'second', 'third']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = publicLabels.map(t => t.toLowerCase().trim());
    const requiredTags = ['first', 'second', 'final'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    // Also verify internal labels remain unchanged
    const internalUnchanged = internalLabels.length === 2 && 
      internalLabels.includes('internal') && 
      internalLabels.includes('private');
    
    if (isSuccess && internalUnchanged && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [publicLabels, internalLabels, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 280 }}>
      <Text fw={600} size="md" mb="sm">Label Settings</Text>
      
      <SegmentedControl
        data={['Public', 'Private', 'Hidden']}
        defaultValue="Public"
        size="xs"
        mb="md"
        fullWidth
      />

      <TagsInput
        label="Internal labels"
        size="sm"
        placeholder="Add internal labels..."
        value={internalLabels}
        onChange={setInternalLabels}
        mb="md"
        data-testid="internal-labels-input"
        aria-label="Internal labels"
      />

      <TagsInput
        label="Public labels"
        size="sm"
        placeholder="Add public labels..."
        value={publicLabels}
        onChange={setPublicLabels}
        maxTags={3}
        description="Max 3 labels"
        data-testid="public-labels-input"
        aria-label="Public labels"
      />
    </Card>
  );
}
