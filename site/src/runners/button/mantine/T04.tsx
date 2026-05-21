'use client';

/**
 * button-mantine-T04: Match the light variant button (visual reference)
 * 
 * Card titled "Choose by style" with target sample showing Light variant.
 * Four "Continue" buttons with different variants: Filled, Outline, Light, Subtle.
 * Task: Click the Light variant button.
 */

import React, { useState } from 'react';
import { Button, Card, Text, Group, Stack, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (variant: string) => {
    setSelected(variant);
    if (variant === 'light') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">Choose by style</Text>
        <Box>
          <Text size="xs" c="dimmed" mb={4}>Target sample:</Text>
          <Button variant="light" size="xs" data-reference-id="mantine-target-variant-light">
            Continue
          </Button>
        </Box>
      </Group>
      
      <Text size="sm" c="dimmed" mb="md">
        Click the button that matches the Target sample style shown above.
      </Text>
      
      <Stack gap="sm">
        <Button
          variant="filled"
          onClick={() => handleClick('filled')}
          data-testid="mantine-btn-continue-filled"
        >
          Continue
        </Button>
        <Button
          variant="outline"
          onClick={() => handleClick('outline')}
          data-testid="mantine-btn-continue-outline"
        >
          Continue
        </Button>
        <Button
          variant="light"
          onClick={() => handleClick('light')}
          data-testid="mantine-btn-continue-light"
        >
          Continue
        </Button>
        <Button
          variant="subtle"
          onClick={() => handleClick('subtle')}
          data-testid="mantine-btn-continue-subtle"
        >
          Continue
        </Button>
      </Stack>
      
      {selected && (
        <Text mt="md" c={selected === 'light' ? 'green' : 'red'}>
          Selection saved
        </Text>
      )}
    </Card>
  );
}
