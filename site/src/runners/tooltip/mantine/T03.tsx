'use client';

/**
 * tooltip-mantine-T03: Show tooltip on small ActionIcon with arrow
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A single Mantine ActionIcon (small circular icon button) labeled "More info" is wrapped with Mantine Tooltip.
 * - Tooltip label: "More details"
 * - withArrow: true
 * Initial state: tooltip hidden. No other tooltip instances.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tooltip, ActionIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('More details')) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
      <Text fw={500} size="lg" mb="md">
        Information
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text size="sm">More info</Text>
        <Tooltip label="More details" withArrow>
          <ActionIcon variant="subtle" size="sm" data-testid="tooltip-trigger-more-info">
            <IconInfoCircle size={16} />
          </ActionIcon>
        </Tooltip>
      </div>
    </Card>
  );
}
