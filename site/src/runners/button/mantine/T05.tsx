'use client';

/**
 * button-mantine-T05: Apply changes at end of settings panel (scroll find)
 * 
 * Settings panel with scrollable content containing multiple settings.
 * "Apply changes" button at bottom (not visible initially).
 */

import React, { useState } from 'react';
import { Button, Card, Text, Switch, Slider, Stack, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (applying || applied) return;
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setApplied(true);
      onSuccess();
    }, 500);
  };

  const settings = [
    { key: 'notifications', label: 'Enable notifications' },
    { key: 'sounds', label: 'Sound effects' },
    { key: 'autoplay', label: 'Autoplay media' },
    { key: 'darkmode', label: 'Dark mode' },
    { key: 'analytics', label: 'Share analytics' },
    { key: 'location', label: 'Location services' },
    { key: 'sync', label: 'Auto-sync' },
    { key: 'backup', label: 'Auto-backup' },
  ];

  return (
    <Card shadow="sm" radius="md" withBorder style={{ width: 400, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Text fw={500} size="lg" p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
        Settings
      </Text>
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
        }}
      >
        <Stack gap="lg">
          {settings.map((setting) => (
            <Box key={setting.key}>
              <Switch
                label={setting.label}
                defaultChecked={Math.random() > 0.5}
              />
            </Box>
          ))}
          <Box>
            <Text size="sm" mb="xs">Volume</Text>
            <Slider defaultValue={50} />
          </Box>
          <Box>
            <Text size="sm" mb="xs">Brightness</Text>
            <Slider defaultValue={70} />
          </Box>
          <Button
            onClick={handleApply}
            loading={applying}
            disabled={applied}
            fullWidth
            data-testid="mantine-btn-apply-changes"
          >
            {applied ? 'Applied' : 'Apply changes'}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
