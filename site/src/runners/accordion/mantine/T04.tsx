'use client';

/**
 * accordion-mantine-T04: Multiple-open: expand Account and Billing
 * 
 * A centered isolated card titled "Settings" contains a Mantine Accordion configured with 
 * multiple=true so several items can be opened at once. Items are: "Account", "Billing", 
 * "Security", "Integrations", "Advanced". Initial state: all items collapsed. Each 
 * expanded panel shows placeholder text and a disabled "Edit" button as a distractor.
 * 
 * Success: expanded_item_ids equals exactly: [account, billing]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text, Button } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    const sortedValue = [...value].sort();
    if (sortedValue.length === 2 && sortedValue[0] === 'account' && sortedValue[1] === 'billing') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const items = [
    { value: 'account', label: 'Account', content: 'Manage your account information and profile.' },
    { value: 'billing', label: 'Billing', content: 'View invoices and update payment methods.' },
    { value: 'security', label: 'Security', content: 'Configure security settings and two-factor auth.' },
    { value: 'integrations', label: 'Integrations', content: 'Connect with third-party services.' },
    { value: 'advanced', label: 'Advanced', content: 'Advanced settings for power users.' },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Settings</Text>
      
      <Accordion multiple value={value} onChange={setValue} data-testid="accordion-root">
        {items.map(item => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Control>{item.label}</Accordion.Control>
            <Accordion.Panel>
              <Text mb="sm">{item.content}</Text>
              <Button variant="outline" size="xs" disabled>
                Edit
              </Button>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Card>
  );
}
