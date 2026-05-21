'use client';

/**
 * tooltip-mantine-T08: Scroll to find a tooltip trigger in a long settings panel
 *
 * Light theme, comfortable spacing, settings_panel layout centered.
 * The settings panel is vertically scrollable and contains many rows (e.g., Time zone, Locale, Data export, Audit log). These are clutter and do not affect success.
 * Near the bottom of the scrollable area there is a row labeled "Webhook URL" with a small info icon. That icon is wrapped in Mantine Tooltip:
 * - label: "Where we send event notifications"
 * Instances: 1 tooltip total on the page. Initial state: tooltip hidden; the target row is initially off-screen, requiring scrolling.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tooltip, ActionIcon, ScrollArea } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Where we send event notifications')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const settingsRows = [
    { label: 'Time zone', value: 'UTC-5' },
    { label: 'Locale', value: 'English (US)' },
    { label: 'Date format', value: 'MM/DD/YYYY' },
    { label: 'Currency', value: 'USD' },
    { label: 'Data export', value: 'CSV' },
    { label: 'Audit log', value: 'Enabled' },
    { label: 'Session timeout', value: '30 minutes' },
    { label: 'Two-factor auth', value: 'Required' },
    { label: 'IP whitelist', value: 'Disabled' },
    { label: 'API rate limit', value: '1000/hour' },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Settings
      </Text>

      <ScrollArea h={250}>
        {settingsRows.map((row, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #e9ecef',
            }}
          >
            <Text size="sm">{row.label}</Text>
            <Text size="sm" c="dimmed">{row.value}</Text>
          </div>
        ))}

        {/* Target row with tooltip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #e9ecef',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Text size="sm">Webhook URL</Text>
            <Tooltip label="Where we send event notifications">
              <ActionIcon variant="subtle" size="xs" data-testid="tooltip-trigger-webhook-url">
                <IconInfoCircle size={14} />
              </ActionIcon>
            </Tooltip>
          </div>
          <Text size="sm" c="dimmed">Configured</Text>
        </div>

        {/* More rows after target */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
          <Text size="sm">Retry policy</Text>
          <Text size="sm" c="dimmed">3 attempts</Text>
        </div>
      </ScrollArea>
    </Card>
  );
}
