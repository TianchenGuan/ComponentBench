'use client';

/**
 * tooltip-mantine-T02: Show an inline tooltip on a highlighted word
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A short paragraph explains billing. One inline highlighted word "prorated" (rendered as an inline Mark element) is wrapped with Mantine Tooltip configured with inline=true.
 * - Tooltip label: "Charged proportionally for remaining days"
 * - Inline target: the word sits within a sentence, not as a separate button
 * Initial state: tooltip hidden. No other tooltips. The inline target is smaller than a standard button.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tooltip, Mark } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Charged proportionally for remaining days')) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Billing Information
      </Text>
      <Text size="sm">
        When you upgrade mid-cycle, charges are{' '}
        <Tooltip label="Charged proportionally for remaining days" inline>
          <Mark data-testid="tooltip-trigger-prorated" style={{ cursor: 'pointer' }}>
            prorated
          </Mark>
        </Tooltip>{' '}
        based on your current billing period. You will only pay for the remaining days.
      </Text>
    </Card>
  );
}
