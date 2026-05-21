'use client';

/**
 * time_picker-mantine-T06: Match the invite preview time
 *
 * A centered isolated card contains two sections: (1) a non-interactive "Invite preview" panel showing
 * a compact meeting card with a stylized time badge reading "15:45", and (2) a Mantine TimeInput labeled "Meeting time".
 * The numeric target is shown only in the invite preview.
 *
 * Scene: guidance=mixed, clutter=low
 *
 * Success: The "Meeting time" TimeInput value equals the time shown in the Invite preview badge (15:45).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Box, Badge, Paper } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '15:45') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
      <Text fw={600} size="lg" mb="md">Schedule Meeting</Text>
      
      {/* Invite preview */}
      <Paper
        data-testid="invite-preview-time"
        p="md"
        mb="lg"
        style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 8 }}
      >
        <Text size="xs" c="dimmed" mb={4}>Invite preview</Text>
        <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Text fw={500}>"Team sync"</Text>
          <Badge
            size="lg"
            variant="light"
            color="blue"
            style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }}
          >
            15:45
          </Badge>
        </Box>
      </Paper>

      {/* Target picker */}
      <div>
        <Text component="label" htmlFor="tp-meeting" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Meeting time
        </Text>
        <TimeInput
          id="tp-meeting"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          data-testid="tp-meeting"
        />
        <Text size="xs" c="dimmed" mt={8}>
          (Match the preview)
        </Text>
      </div>
    </Card>
  );
}
