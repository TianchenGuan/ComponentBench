'use client';

/**
 * toggle_button_group_multi-mantine-T29: Dark theme: choose push topics without touching email topics
 *
 * Layout: form_section centered in the viewport, rendered in dark theme.
 *
 * The page shows a form section titled "Notification topics" with two chip groups 
 * (same canonical type) stacked vertically:
 *
 * 1) "Email topics" (top)
 *    - Chips: Product, Security, Billing, Releases, Tips
 *    - Initial state: Product and Tips selected
 * 2) "Push topics" (bottom, TARGET)
 *    - Chips: Security, Billing, Outages, Maintenance, Incidents, Promotions
 *    - Initial state: Promotions selected only
 *
 * Each group is a Mantine Chip.Group with multiple selection enabled. Both groups 
 * look visually similar (same chip style), making it easy to accidentally edit the wrong one.
 *
 * Clutter=low:
 * - Each group has helper text.
 * - A single non-interactive divider between them.
 *
 * No Apply/Save button; chip selections apply immediately.
 *
 * Success: Push topics → Security, Outages, Incidents (require_correct_instance: true)
 * Theme: dark
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Chip, Group, Divider, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const EMAIL_TOPICS = ['Product', 'Security', 'Billing', 'Releases', 'Tips'];
const PUSH_TOPICS = ['Security', 'Billing', 'Outages', 'Maintenance', 'Incidents', 'Promotions'];
const TARGET_SET = new Set(['Security', 'Outages', 'Incidents']);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [emailTopics, setEmailTopics] = useState<string[]>(['Product', 'Tips']);
  const [pushTopics, setPushTopics] = useState<string[]>(['Promotions']);
  const successFiredRef = useRef(false);

  // Initial state for non-target group
  const emailInitial = useRef(['Product', 'Tips']);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check if push topics has the target set
    const pushSet = new Set(pushTopics);
    const pushMatches = pushSet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => pushSet.has(v));

    // Check if email topics is unchanged
    const emailUnchanged = JSON.stringify([...emailTopics].sort()) === 
      JSON.stringify([...emailInitial.current].sort());

    if (pushMatches && emailUnchanged) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [pushTopics, emailTopics, onSuccess]);

  const chipStyles = (isSelected: boolean) => ({
    label: {
      color: isSelected ? '#fff' : '#ccc',
      background: isSelected ? '#1971c2' : '#2a2a2a',
      borderColor: '#434343',
    },
  });

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ 
        width: 500,
        background: '#1f1f1f',
        borderColor: '#303030',
      }}
    >
      <Text fw={500} size="lg" mb="md" c="white">Notification topics</Text>

      {/* Email topics */}
      <Box mb="md" data-testid="email-topics-section">
        <Text size="sm" fw={500} c="white" mb="xs">Email topics</Text>
        <Text size="xs" c="dimmed" mb="sm">
          Topics for email notifications. (Do not change these)
        </Text>

        <Chip.Group 
          multiple 
          value={emailTopics} 
          onChange={setEmailTopics}
          data-testid="email-topics-group"
          data-section="Email topics"
        >
          <Group gap="xs">
            {EMAIL_TOPICS.map(topic => (
              <Chip 
                key={topic} 
                value={topic}
                styles={chipStyles(emailTopics.includes(topic))}
                data-testid={`email-${topic.toLowerCase()}`}
              >
                {topic}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </Box>

      <Divider my="md" color="#303030" />

      {/* Push topics (TARGET) */}
      <Box data-testid="push-topics-section">
        <Text size="sm" fw={500} c="white" mb="xs">Push topics</Text>
        <Text size="xs" c="blue" mb="sm">
          Select: Security, Outages, Incidents
        </Text>

        <Chip.Group 
          multiple 
          value={pushTopics} 
          onChange={setPushTopics}
          data-testid="push-topics-group"
          data-section="Push topics"
        >
          <Group gap="xs">
            {PUSH_TOPICS.map(topic => (
              <Chip 
                key={topic} 
                value={topic}
                styles={chipStyles(pushTopics.includes(topic))}
                data-testid={`push-${topic.toLowerCase()}`}
              >
                {topic}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </Box>
    </Card>
  );
}
