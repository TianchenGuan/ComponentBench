'use client';

/**
 * collapsible_disclosure-mantine-T06: Visual match: expand the item that matches the Target chip
 * 
 * A single centered card contains an accordion and a visual reference.
 * 
 * - Layout: isolated_card, centered.
 * - At the top: a "Target" chip that shows an emoji + label exactly as it appears in an accordion control (e.g., "🔒 Security" or "📦 Shipping").
 * - Below: one Mantine Accordion with 6 items, each control includes an emoji icon and a label.
 * - Initial state: all items collapsed.
 * - Guidance is visual: match the Target chip to the correct accordion control.
 * 
 * Success: Exactly one item expanded, matching the Target chip
 */

import React, { useState, useEffect, useRef } from 'react';
import { Accordion, Card, Text, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

// Target is "🔒 Security"
const TARGET_KEY = 'security';
const TARGET_EMOJI = '🔒';
const TARGET_LABEL = 'Security';

const ACCORDION_ITEMS = [
  { key: 'account', emoji: '👤', label: 'Account', content: 'Account settings and preferences.' },
  { key: 'billing', emoji: '💳', label: 'Billing', content: 'Billing and payment information.' },
  { key: 'security', emoji: '🔒', label: 'Security', content: 'Security and authentication settings.' },
  { key: 'notifications', emoji: '🔔', label: 'Notifications', content: 'Notification preferences.' },
  { key: 'privacy', emoji: '🛡️', label: 'Privacy', content: 'Privacy and data sharing options.' },
  { key: 'support', emoji: '💬', label: 'Support', content: 'Get help and contact support.' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when only the target is expanded
    if (value === TARGET_KEY && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Match the target</Text>
      
      {/* Target chip preview */}
      <Box 
        data-testid="target-chip"
        style={{
          padding: '12px 16px',
          background: '#f1f3f5',
          borderRadius: 8,
          marginBottom: 16,
          border: '2px dashed #228be6',
        }}
      >
        <Text size="sm" c="dimmed" mb={8}>
          Target:
        </Text>
        <Badge size="lg" variant="light">
          {TARGET_EMOJI} {TARGET_LABEL}
        </Badge>
      </Box>
      
      <Accordion value={value} onChange={setValue} data-testid="accordion-root">
        {ACCORDION_ITEMS.map(item => (
          <Accordion.Item key={item.key} value={item.key}>
            <Accordion.Control>
              {item.emoji} {item.label}
            </Accordion.Control>
            <Accordion.Panel>
              {item.content}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Card>
  );
}
