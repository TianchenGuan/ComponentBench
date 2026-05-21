'use client';

/**
 * checkbox-mantine-T05: Match security prompt example (mixed guidance)
 *
 * Layout: isolated card centered in the viewport titled "Security prompt".
 * The card contains:
 *   - A Mantine Checkbox labeled "Require security prompt" (initially unchecked).
 *   - An adjacent non-interactive example panel labeled "Example" that shows a small lock icon and a short caption indicating the prompt is enabled.
 * The goal is specified by the example panel rather than an explicit "check/uncheck" instruction.
 * No Save/Apply button exists; the checkbox state commits immediately.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, Text, Checkbox, Group, Box, ThemeIcon } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
      <Text fw={600} size="lg" mb="md">
        Security prompt
      </Text>
      <Group justify="space-between" align="flex-start">
        <Checkbox
          checked={checked}
          onChange={handleChange}
          label="Require security prompt"
          data-testid="cb-require-security-prompt"
        />
        <Box
          p="md"
          style={{ background: '#f8f9fa', borderRadius: 8, textAlign: 'center' }}
          data-ref="security-prompt-enabled"
        >
          <Text size="xs" c="dimmed" mb={6}>
            Example
          </Text>
          <ThemeIcon size="lg" variant="light" color="green">
            <IconLock size={18} />
          </ThemeIcon>
          <Text size="xs" c="dimmed" mt={6}>
            Prompt enabled
          </Text>
        </Box>
      </Group>
    </Card>
  );
}
