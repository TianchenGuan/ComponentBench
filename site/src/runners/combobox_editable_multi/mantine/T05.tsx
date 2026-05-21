'use client';

/**
 * combobox_editable_multi-mantine-T05: Match tags from target preview
 *
 * Centered isolated card titled "Segmentation".
 * - Left: Mantine TagsInput labeled "Customer segments" (interactive).
 *   - Initial pills: none
 *   - Suggestions include: SMB, Mid-market, Enterprise, Education, Healthcare, Government, Consumer.
 * - Right: non-interactive pill row labeled "Target segments" showing the desired set: Enterprise, Healthcare, Government.
 * The agent must match the TagsInput selection to the reference pill row exactly (order-insensitive).
 *
 * Success: Selected values equal {Enterprise, Healthcare, Government} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput, Badge, Group, Grid } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const suggestions = ['SMB', 'Mid-market', 'Enterprise', 'Education', 'Healthcare', 'Government', 'Consumer'];

const TARGET_SET = ['Enterprise', 'Healthcare', 'Government'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">Segmentation</Text>
      
      <Grid>
        <Grid.Col span={6}>
          <Text fw={500} size="sm" mb={8}>Customer segments</Text>
          <TagsInput
            data-testid="customer-segments"
            placeholder="Select segments"
            data={suggestions}
            value={value}
            onChange={setValue}
          />
        </Grid.Col>
        
        <Grid.Col span={6}>
          <Text fw={500} size="sm" mb={8}>Target segments</Text>
          <Group data-testid="target-segments-preview" gap="xs">
            <Badge color="blue">Enterprise</Badge>
            <Badge color="green">Healthcare</Badge>
            <Badge color="orange">Government</Badge>
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
