'use client';

/**
 * split_button-mantine-T01: Send: run primary action on Mantine split button
 *
 * Layout: isolated card titled "Message" centered in the viewport.
 * Target component: Mantine split button pattern (Group + Button + Menu).
 *
 * Initial state:
 * - Current selected action: "Send now" (left button label).
 * - Status text: "Last action: —".
 *
 * Success: lastInvokedAction equals "send_now"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('send_now');
  const [lastInvokedAction, setLastInvokedAction] = useState<string | null>(null);

  const getActionLabel = (key: string) => {
    const labels: Record<string, string> = {
      'send_now': 'Send now',
      'schedule_send': 'Schedule send',
      'send_test': 'Send test',
      'save_draft': 'Save draft',
    };
    return labels[key] || key;
  };

  const handlePrimaryClick = () => {
    if (lastInvokedAction) return; // Prevent double-click
    setLastInvokedAction(selectedAction);
    if (selectedAction === 'send_now') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Message</Text>

      {/* Non-interactive message preview (distractor) */}
      <div style={{ 
        marginBottom: 16, 
        padding: 12, 
        background: '#f8f9fa', 
        borderRadius: 4,
        fontSize: 14,
        color: '#666'
      }}>
        <div style={{ marginBottom: 4 }}>To: team@example.com</div>
        <div>Subject: Weekly update</div>
      </div>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
        data-last-invoked-action={lastInvokedAction}
      >
        <Group gap={0}>
          <Button 
            onClick={handlePrimaryClick}
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          >
            {getActionLabel(selectedAction)}
          </Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <Button 
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 8, paddingRight: 8 }}
              >
                <IconChevronDown size={16} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setSelectedAction('send_now')}>Send now</Menu.Item>
              <Menu.Item onClick={() => setSelectedAction('schedule_send')}>Schedule send…</Menu.Item>
              <Menu.Item onClick={() => setSelectedAction('send_test')}>Send test</Menu.Item>
              <Menu.Item onClick={() => setSelectedAction('save_draft')}>Save draft</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* Status line */}
        <Text size="sm" c="dimmed" mt="xs">
          Last action: {lastInvokedAction ? getActionLabel(lastInvokedAction) : '—'}
        </Text>
      </div>
    </Card>
  );
}
