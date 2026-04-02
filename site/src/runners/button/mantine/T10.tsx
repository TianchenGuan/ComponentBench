'use client';

/**
 * button-mantine-T10: Match reference and section (Secondary actions in dark theme)
 * 
 * Dark theme form section titled "Actions" with two areas:
 * - Primary actions (2 buttons)
 * - Secondary actions (2 buttons)
 * All buttons labeled "Continue" with different variants.
 * Target sample shows outlined button with right icon.
 * Task: Click the matching button under "Secondary actions".
 */

import React, { useState } from 'react';
import { Button, Card, Text, Stack, Group, Box, Divider } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (buttonId: string) => {
    setSelected(buttonId);
    if (buttonId === 'secondary-outlined-right') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">Actions</Text>
        <Box>
          <Text size="xs" c="dimmed" mb={4}>Target sample:</Text>
          <Button
            variant="outline"
            size="xs"
            rightSection={<IconArrowRight size={14} />}
            data-reference-id="mantine-target-outlined-righticon"
          >
            Continue
          </Button>
        </Box>
      </Group>
      
      <Stack gap="lg">
        <Box>
          <Text size="sm" fw={500} mb="xs" c="dimmed">Primary actions</Text>
          <Group gap="sm">
            <Button
              variant="filled"
              onClick={() => handleClick('primary-filled')}
              data-testid="mantine-btn-primary-continue-filled"
            >
              Continue
            </Button>
            <Button
              variant="outline"
              rightSection={<IconArrowRight size={14} />}
              onClick={() => handleClick('primary-outlined-right')}
              data-testid="mantine-btn-primary-continue-outlined-right"
            >
              Continue
            </Button>
          </Group>
        </Box>
        
        <Divider />
        
        <Box>
          <Text size="sm" fw={500} mb="xs" c="dimmed">Secondary actions</Text>
          <Group gap="sm">
            <Button
              variant="light"
              onClick={() => handleClick('secondary-light')}
              data-testid="mantine-btn-secondary-continue-light"
            >
              Continue
            </Button>
            <Button
              variant="outline"
              rightSection={<IconArrowRight size={14} />}
              onClick={() => handleClick('secondary-outlined-right')}
              data-testid="mantine-btn-secondary-continue-outlined-right"
            >
              Continue
            </Button>
          </Group>
        </Box>
      </Stack>
      
      {selected && (
        <Text mt="md" c={selected === 'secondary-outlined-right' ? 'green' : 'red'}>
          Selection recorded
        </Text>
      )}
    </Card>
  );
}
