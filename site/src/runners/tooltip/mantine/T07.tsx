'use client';

/**
 * tooltip-mantine-T07: Show tooltip triggered by focus events only
 *
 * Light theme, comfortable spacing, isolated card anchored near the top-right of the viewport.
 * A single labeled row "Webhook secret" appears with a small info icon button.
 * The icon is wrapped with Mantine Tooltip configured to trigger ONLY on focus:
 * - label: "Keep this value private"
 * - events: { hover: false, focus: true, touch: false }
 * Initial state: tooltip hidden. No other tooltip instances. The intended interaction is Tab focus (hover will not work).
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tooltip, ActionIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Keep this value private')) {
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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={500} size="lg" mb="md">
        Security Settings
      </Text>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text size="sm">Webhook secret</Text>
        <Tooltip
          label="Keep this value private"
          events={{ hover: false, focus: true, touch: false }}
        >
          <ActionIcon variant="subtle" size="sm" data-testid="tooltip-trigger-webhook">
            <IconInfoCircle size={16} />
          </ActionIcon>
        </Tooltip>
      </div>

      <Text size="xs" c="dimmed" mt="md">
        Use Tab to focus the icon and show the tooltip.
      </Text>
    </Card>
  );
}
