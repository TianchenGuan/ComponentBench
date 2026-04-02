'use client';

/**
 * tooltip-mantine-T05: Open Billing cycle tooltip in a form
 *
 * Light theme, comfortable spacing, form_section layout centered.
 * A small Billing form contains two labeled inputs: "Billing cycle" and "VAT ID".
 * Each label has a small info icon wrapped with Mantine Tooltip:
 * - Billing cycle tooltip: "Monthly or yearly billing" (TARGET)
 * - VAT ID tooltip: "Required for EU businesses"
 * Clutter: low (two inputs and a Save button not required for success). Instances: 2 tooltips. Initial state: none visible.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tooltip, TextInput, Button, ActionIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Monthly or yearly billing')) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Billing
      </Text>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <Text size="sm" fw={500}>Billing cycle</Text>
          <Tooltip label="Monthly or yearly billing">
            <ActionIcon variant="subtle" size="xs" data-testid="tooltip-trigger-billing-cycle">
              <IconInfoCircle size={14} />
            </ActionIcon>
          </Tooltip>
        </div>
        <TextInput placeholder="Monthly" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <Text size="sm" fw={500}>VAT ID</Text>
          <Tooltip label="Required for EU businesses">
            <ActionIcon variant="subtle" size="xs" data-testid="tooltip-trigger-vat">
              <IconInfoCircle size={14} />
            </ActionIcon>
          </Tooltip>
        </div>
        <TextInput placeholder="EU123456789" />
      </div>

      <Button fullWidth>Save</Button>
    </Card>
  );
}
