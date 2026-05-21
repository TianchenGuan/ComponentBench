'use client';

/**
 * accordion-mantine-T02: Support accordion: switch from Contact to Billing
 * 
 * A centered isolated card titled "Support" contains a Mantine Accordion with 4 items: 
 * "Getting started", "Billing", "Technical", "Contact". Initial state: "Contact" is 
 * expanded by default (defaultValue='contact') and its panel content is visible. 
 * Other items are collapsed. Accordion uses the default single-open behavior.
 * 
 * Success: expanded_item_ids equals exactly: [billing]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('contact');

  useEffect(() => {
    if (value === 'billing') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Support</Text>
      
      <Accordion value={value} onChange={setValue} data-testid="accordion-root">
        <Accordion.Item value="getting_started">
          <Accordion.Control>Getting started</Accordion.Control>
          <Accordion.Panel>
            New to our platform? Check out our getting started guide to learn the basics.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="billing">
          <Accordion.Control>Billing</Accordion.Control>
          <Accordion.Panel>
            Manage your subscription, view invoices, and update payment methods.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="technical">
          <Accordion.Control>Technical</Accordion.Control>
          <Accordion.Panel>
            Technical documentation and API references for developers.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="contact">
          <Accordion.Control>Contact</Accordion.Control>
          <Accordion.Panel>
            Need help? Our support team is available 24/7 at support@example.com.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
