'use client';

/**
 * tooltip-mantine-T01: Show tooltip on Download report button
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A single Mantine Button labeled "Download report" is wrapped in Mantine Tooltip.
 * - Tooltip label: "Downloads a PDF report"
 * - Events: default (hover enabled)
 * Initial state: tooltip hidden. No other tooltips or clutter.
 */

import React, { useEffect, useRef } from 'react';
import { Button, Card, Text, Tooltip } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Downloads a PDF report')) {
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
        Reports
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Generate and download your data reports.
      </Text>
      <Tooltip label="Downloads a PDF report">
        <Button data-testid="tooltip-trigger-download">
          Download report
        </Button>
      </Tooltip>
    </Card>
  );
}
