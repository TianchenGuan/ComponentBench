'use client';

/**
 * text_input-mantine-T06: Copy phrase from reference banner (dark)
 * 
 * Scene is an isolated card centered in the viewport using Mantine's dark theme styles. At the top of the
 * card, a high-contrast banner labeled "Reference phrase" shows the target text in large font (e.g., "Ship it
 * today"). A second banner labeled "Example phrase" shows a different sentence as a distractor. Below is one
 * Mantine TextInput labeled "Message", initially empty. No other text inputs or overlays are present.
 * 
 * Success: The "Message" TextInput value matches the reference banner text "Ship it today" exactly (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Text, Paper, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const REFERENCE_PHRASE = 'Ship it today';
const DISTRACTOR_PHRASE = 'Maybe tomorrow';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === REFERENCE_PHRASE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ width: 400, background: '#1a1b1e', borderColor: '#2c2e33' }}
    >
      <Text fw={600} size="lg" mb="md" c="white">Match the phrase</Text>
      
      <Stack gap="sm" mb="lg">
        <Paper p="md" style={{ background: '#25262b', border: '1px solid #3b5bdb' }}>
          <Text size="xs" c="dimmed" mb={4}>Reference phrase</Text>
          <Text size="lg" fw={600} c="white" data-testid="ref-phrase">
            {REFERENCE_PHRASE}
          </Text>
        </Paper>
        
        <Paper p="md" style={{ background: '#25262b' }}>
          <Text size="xs" c="dimmed" mb={4}>Example phrase</Text>
          <Text size="lg" c="gray" data-testid="example-phrase">
            {DISTRACTOR_PHRASE}
          </Text>
        </Paper>
      </Stack>
      
      <TextInput
        label="Message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-testid="message-input"
        styles={{
          label: { color: 'white' },
          input: { background: '#25262b', borderColor: '#373a40', color: 'white' }
        }}
      />
    </Card>
  );
}
