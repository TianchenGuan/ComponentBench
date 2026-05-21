'use client';

/**
 * accordion-mantine-T07: Dark + compact: open Security logs in long list
 * 
 * A centered isolated card is rendered in dark theme with compact spacing (tight padding 
 * on each Accordion control row). It contains a single Mantine Accordion with 10 items.
 * Initial state: all items collapsed. The compact dark styling makes the clickable rows 
 * smaller and increases the likelihood of selecting an adjacent topic by mistake.
 * 
 * Success: expanded_item_ids equals exactly: [security_logs]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const items = [
  { value: 'overview', label: 'Overview' },
  { value: 'users', label: 'Users' },
  { value: 'roles', label: 'Roles' },
  { value: 'api_keys', label: 'API keys' },
  { value: 'webhooks', label: 'Webhooks' },
  { value: 'security_logs', label: 'Security logs' },
  { value: 'sso', label: 'SSO' },
  { value: 'billing', label: 'Billing' },
  { value: 'usage', label: 'Usage' },
  { value: 'advanced', label: 'Advanced' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value === 'security_logs') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      shadow="sm" 
      padding="sm" 
      radius="md" 
      withBorder 
      style={{ width: 400 }}
    >
      <Text fw={600} size="md" mb="sm">Admin topics</Text>
      
      <Accordion 
        value={value} 
        onChange={setValue} 
        data-testid="accordion-root"
        styles={{
          control: {
            padding: '8px 12px',
          },
          label: {
            fontSize: '14px',
          },
          panel: {
            padding: '8px 12px',
            fontSize: '13px',
          },
        }}
      >
        {items.map(item => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Control>{item.label}</Accordion.Control>
            <Accordion.Panel>
              Settings for {item.label.toLowerCase()}.
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Card>
  );
}
