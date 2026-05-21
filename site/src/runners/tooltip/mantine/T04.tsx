'use client';

/**
 * tooltip-mantine-T04: Show tooltip with openDelay
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A single Mantine Button labeled "Generate token" is wrapped in Mantine Tooltip configured with a noticeable open delay:
 * - Tooltip label: "Token expires in 24 hours"
 * - openDelay: 700ms
 * Initial state: tooltip hidden. No other tooltips. The pointer must remain on the button until the delay elapses.
 */

import React, { useEffect, useRef } from 'react';
import { Button, Card, Text, Tooltip } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Token expires in 24 hours')) {
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
        API Tokens
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Generate a new access token for API authentication.
      </Text>
      <Tooltip label="Token expires in 24 hours" openDelay={700}>
        <Button data-testid="tooltip-trigger-generate">
          Generate token
        </Button>
      </Tooltip>
    </Card>
  );
}
