'use client';

/**
 * tags_input-mantine-T06: Match Mantine TagsInput to visual badge reference
 *
 * The page shows an isolated card titled "Collection".
 *
 * Visual reference:
 * - A static row labeled "Target badges" shows three Mantine Badge components: "featured", "staff-pick", "2026".
 *
 * Target component:
 * - Below the reference row is a Mantine TagsInput labeled "Tags".
 * - The TagsInput allows free text entry and also offers suggestions that include the target values.
 *
 * Initial state:
 * - The TagsInput starts with two pills: "featured" (correct) and "draft" (incorrect extra).
 *
 * No overlay or additional inputs are present; only the TagsInput state is checked for success.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): featured, staff-pick, 2026.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput, Badge, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const suggestions = ['featured', 'staff-pick', '2026', 'draft', 'popular', 'new'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>(['featured', 'draft']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['featured', 'staff-pick', '2026'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Collection</Text>
      
      <div style={{ marginBottom: 16 }}>
        <Text size="sm" c="dimmed" mb="xs">Target badges</Text>
        <Group gap="xs">
          <Badge variant="light" color="blue">featured</Badge>
          <Badge variant="light" color="green">staff-pick</Badge>
          <Badge variant="light" color="orange">2026</Badge>
        </Group>
      </div>

      <TagsInput
        label="Tags"
        placeholder="Match the badges above..."
        value={tags}
        onChange={setTags}
        data={suggestions}
        data-testid="tags-input"
      />
    </Card>
  );
}
