'use client';

/**
 * collapsible_disclosure-mantine-T03: Multiple-open: collapse all items
 * 
 * A centered card titled "Help topics" contains a Mantine Accordion configured to allow multiple open items.
 * 
 * - Layout: isolated_card, centered.
 * - Component: Mantine Accordion with multiple=true and 4 items:
 *   - "Getting started"
 *   - "Billing"
 *   - "Security"
 *   - "Troubleshooting"
 * - Initial state: "Billing" and "Security" are expanded by default (defaultValue is an array of two items).
 * - There is no separate reset button; collapse the open items by toggling their controls.
 * 
 * Success: expanded_panels equals [] (all collapsed)
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['billing', 'security']);

  useEffect(() => {
    if (value.length === 0) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Help topics</Text>
      
      <Accordion 
        multiple 
        value={value} 
        onChange={setValue} 
        data-testid="accordion-root"
      >
        <Accordion.Item value="getting_started">
          <Accordion.Control>Getting started</Accordion.Control>
          <Accordion.Panel>
            Learn how to set up your account and get started with our platform.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="billing">
          <Accordion.Control>Billing</Accordion.Control>
          <Accordion.Panel>
            Information about billing, invoices, and payment methods.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="security">
          <Accordion.Control>Security</Accordion.Control>
          <Accordion.Panel>
            Learn about our security practices and how to protect your account.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="troubleshooting">
          <Accordion.Control>Troubleshooting</Accordion.Control>
          <Accordion.Panel>
            Common issues and their solutions.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
