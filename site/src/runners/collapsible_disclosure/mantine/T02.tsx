'use client';

/**
 * collapsible_disclosure-mantine-T02: Dark theme: close Returns (single item)
 * 
 * The page uses a dark theme and contains a single collapsible disclosure item.
 * 
 * - Theme: dark.
 * - Layout: isolated_card, centered.
 * - Component: Mantine Accordion with ONE item titled "Returns".
 * - Initial state: the item is expanded by default (defaultValue="Returns"); the policy text is visible.
 * - Interaction: clicking the control toggles it closed.
 * 
 * Success: expanded_panels equals [] (Returns collapsed)
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('returns');

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Returns policy</Text>
      
      <Accordion value={value} onChange={setValue} data-testid="accordion-root">
        <Accordion.Item value="returns">
          <Accordion.Control>Returns</Accordion.Control>
          <Accordion.Panel>
            Our returns policy allows you to return most items within 30 days 
            of delivery for a full refund. Items must be unused and in their 
            original packaging. Some exclusions apply for perishable goods, 
            custom orders, and clearance items. To initiate a return, please 
            contact our customer service team with your order number.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
