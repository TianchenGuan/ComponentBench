'use client';

/**
 * text_input-mantine-T09: Set CTA label with mixed guidance among three inputs
 * 
 * Scene is a dashboard layout centered in the viewport with medium clutter: a left panel titled "Copy" and
 * a right panel titled "Preview". The left panel contains three Mantine TextInput fields (instances=3):
 * "Headline", "Subheadline", and "CTA label". Each has an existing short value. The right Preview panel
 * shows a mock card with a button whose label reflects the current CTA label field in real time. Only the
 * "CTA label" field is the target; other inputs are distractors. No save/apply step is required.
 * 
 * Success: The TextInput labeled "CTA label" has value exactly "Get started" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Text, Button, Paper, Stack, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [headline, setHeadline] = useState('Welcome to our app');
  const [subheadline, setSubheadline] = useState('The best solution for teams');
  const [ctaLabel, setCtaLabel] = useState('Learn more');

  useEffect(() => {
    if (ctaLabel.trim() === 'Get started') {
      onSuccess();
    }
  }, [ctaLabel, onSuccess]);

  return (
    <Group gap="lg" align="flex-start">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 320 }}>
        <Text fw={600} size="lg" mb="md">Copy</Text>
        <Stack gap="md">
          <TextInput
            label="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            data-testid="headline-input"
          />
          <TextInput
            label="Subheadline"
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            data-testid="subheadline-input"
          />
          <TextInput
            label="CTA label"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            data-testid="cta-label-input"
          />
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 280 }}>
        <Text fw={600} size="lg" mb="md">Preview</Text>
        <Paper p="md" withBorder>
          <Text fw={600} size="lg" mb="xs">{headline}</Text>
          <Text c="dimmed" size="sm" mb="md">{subheadline}</Text>
          <Button data-testid="preview-button">{ctaLabel}</Button>
        </Paper>
      </Card>
    </Group>
  );
}
