'use client';

/**
 * toggle_button_group_multi-mantine-T22: Clear delivery methods
 *
 * Layout: isolated_card centered in the viewport.
 *
 * A card titled "Delivery methods" contains:
 * - A Mantine Chip.Group with multiple selection enabled.
 * - Chips: Email, SMS, Push.
 * - A small secondary button labeled "Clear" to the right of the label (same row).
 *
 * Initial state:
 * - Email and SMS are selected.
 * - Push is unselected.
 *
 * Clicking "Clear" resets the group to an empty array (no selected chips). 
 * No other components or confirmations.
 *
 * Success: Selected options equal exactly: (none selected)
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Chip, Group, Button, Flex } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const METHODS = ['Email', 'SMS', 'Push'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Email', 'SMS']);

  useEffect(() => {
    if (selected.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleClear = () => {
    setSelected([]);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Flex justify="space-between" align="center" mb="sm">
        <Text fw={500} size="lg">Delivery methods</Text>
        <Button variant="subtle" size="xs" onClick={handleClear} data-testid="clear-button">
          Clear
        </Button>
      </Flex>
      <Text size="sm" c="dimmed" mb="md">
        Clear all selections.
      </Text>

      <Chip.Group multiple value={selected} onChange={setSelected} data-testid="delivery-methods-group">
        <Group gap="sm">
          {METHODS.map(method => (
            <Chip key={method} value={method} data-testid={`method-${method.toLowerCase()}`}>
              {method}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Card>
  );
}
