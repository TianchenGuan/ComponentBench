'use client';

/**
 * toggle_button_group_multi-mantine-T25: Match badges to preview
 *
 * Layout: isolated_card centered in the viewport.
 *
 * Two cards are shown:
 * 1) "Badges" (interactive)
 *    - Contains a Mantine Chip.Group with multiple selection enabled.
 *    - Chips: New, Featured, Limited, Sale.
 *    - Initial state: New selected only.
 * 2) "Preview" (non-interactive)
 *    - Shows a mock product tile with the intended badges visually highlighted.
 *
 * There is no Apply/Save control; chip selections apply immediately.
 * Clutter=low due to the additional preview card used as reference.
 *
 * Success: Selected options equal exactly: Featured, Sale
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Chip, Group, Badge, Flex, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const BADGES = ['New', 'Featured', 'Limited', 'Sale'];
const TARGET_SET = new Set(['Featured', 'Sale']);
const PREVIEW_SET = new Set(['Featured', 'Sale']);

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['New']);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Flex gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={500} size="lg" mb="sm">Badges</Text>
        <Text size="sm" c="dimmed" mb="md">
          Match Preview (Featured + Sale).
        </Text>

        <Chip.Group multiple value={selected} onChange={setSelected} data-testid="badges-group">
          <Group gap="sm">
            {BADGES.map(badge => (
              <Chip key={badge} value={badge} data-testid={`badge-${badge.toLowerCase()}`}>
                {badge}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 280 }} data-testid="preview-card">
        <Text fw={500} size="lg" mb="sm">Preview</Text>
        <Text size="sm" c="dimmed" mb="md">
          Target badge configuration:
        </Text>

        <Box style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: 8, 
          padding: 16,
          background: '#fafafa',
        }}>
          <Group gap="xs" mb="sm">
            {BADGES.map(badge => (
              <Badge 
                key={badge} 
                color={PREVIEW_SET.has(badge) ? 'green' : 'gray'}
                variant={PREVIEW_SET.has(badge) ? 'filled' : 'outline'}
              >
                {badge}
              </Badge>
            ))}
          </Group>
          <Text size="xs" c="dimmed">Mock Product Item</Text>
        </Box>

        <Text size="xs" c="dimmed" mt="sm">
          (Reference - not interactive)
        </Text>
      </Card>
    </Flex>
  );
}
