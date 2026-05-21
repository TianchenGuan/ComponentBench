'use client';

/**
 * toggle_button_group_multi-mantine-T28: Scroll to summary topics and select in compact mode
 *
 * Layout: settings_panel with the target section positioned toward the bottom-right 
 * of the viewport (placement=bottom_right). The form uses compact spacing and small chip sizing.
 *
 * The page is a long "Email preferences" form with multiple sections stacked vertically 
 * (the main content area scrolls).
 *
 * The target component:
 * - Section heading: "Weekly summary topics" (below the fold; requires scrolling).
 * - Contains a Mantine Chip.Group with multiple selection enabled.
 * - Chips (8 total): Product, Security, Billing, Releases, Tips, Events, Outages, Maintenance.
 * - Initial state: Product is selected.
 *
 * Compact/small presentation:
 * - Reduced vertical spacing between form rows.
 * - Chips use smaller font/padding, making targets tighter.
 *
 * Clutter (medium):
 * - Other unrelated fields: text inputs (Name, Email), switches, and help text between sections.
 * - A non-interactive "Preview email" panel near the bottom.
 *
 * No Apply/Save; chip selections apply immediately.
 *
 * Success: Selected options equal exactly: Security, Billing, Releases, Outages
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Chip, Group, TextInput, Switch, Divider, Box, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TOPICS = ['Product', 'Security', 'Billing', 'Releases', 'Tips', 'Events', 'Outages', 'Maintenance'];
const TARGET_SET = new Set(['Security', 'Billing', 'Releases', 'Outages']);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Product']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marketingEmails, setMarketingEmails] = useState(true);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="sm">Email preferences</Text>

      <Box 
        style={{ maxHeight: 350, overflowY: 'auto', paddingRight: 8 }}
        data-testid="settings-scroll-area"
      >
        <Stack gap="sm">
          {/* Basic info section */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Basic info</Text>
            <TextInput
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="xs"
              mb="xs"
            />
            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="xs"
            />
          </Box>

          <Divider />

          {/* Preferences section */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Preferences</Text>
            <Switch
              label="Receive marketing emails"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              size="xs"
              mb="xs"
            />
            <Switch
              label="HTML emails (vs plain text)"
              defaultChecked
              size="xs"
            />
          </Box>

          <Divider />

          {/* Filler content */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Frequency</Text>
            <Text size="xs" c="dimmed">
              Emails will be sent based on your subscription settings. 
              You can change this at any time.
            </Text>
          </Box>

          <Divider />

          {/* More filler to require scrolling */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Digest format</Text>
            <Text size="xs" c="dimmed">
              Choose between summary or detailed digest format for your weekly updates.
            </Text>
          </Box>

          <Divider />

          {/* Weekly summary topics (TARGET) */}
          <Box data-testid="weekly-summary-topics-section">
            <Text size="sm" fw={500} mb="xs">Weekly summary topics</Text>
            <Text size="xs" c="blue" mb="xs">
              Select: Security, Billing, Releases, Outages
            </Text>

            <Chip.Group multiple value={selected} onChange={setSelected} data-testid="topics-group">
              <Group gap={4}>
                {TOPICS.map(topic => (
                  <Chip 
                    key={topic} 
                    value={topic} 
                    size="xs"
                    data-testid={`topic-${topic.toLowerCase()}`}
                  >
                    {topic}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Box>

          <Divider />

          {/* Preview panel */}
          <Box style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            <Text size="sm" fw={500} mb="xs">Preview email</Text>
            <Box style={{ 
              background: '#e8e8e8', 
              height: 60, 
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text size="xs" c="dimmed">Email preview placeholder</Text>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}
