'use client';

/**
 * collapsible_disclosure-mantine-T01: FAQ: expand Payment
 * 
 * A single centered FAQ card contains a Mantine Accordion (single-open by default).
 * 
 * - Layout: isolated_card, centered.
 * - Component: Mantine Accordion with 4 items:
 *   - "Payment"
 *   - "Shipping"
 *   - "Returns"
 *   - "Contact"
 * - Initial state: all items are collapsed (no panels open).
 * - Clicking an item control expands its panel content below.
 * - No other interactive elements are present.
 * 
 * Success: "Payment" is expanded
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value === 'payment') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">FAQ</Text>
      
      <Accordion value={value} onChange={setValue} data-testid="accordion-root">
        <Accordion.Item value="payment">
          <Accordion.Control>Payment</Accordion.Control>
          <Accordion.Panel>
            We accept all major credit cards, PayPal, and bank transfers. 
            Payment is processed securely at checkout.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="shipping">
          <Accordion.Control>Shipping</Accordion.Control>
          <Accordion.Panel>
            We offer free standard shipping on orders over $50. 
            Express shipping is available for an additional fee.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="returns">
          <Accordion.Control>Returns</Accordion.Control>
          <Accordion.Panel>
            Returns are accepted within 30 days of purchase. 
            Items must be in original condition with tags attached.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="contact">
          <Accordion.Control>Contact</Accordion.Control>
          <Accordion.Panel>
            Reach out to us via email at support@example.com 
            or call 1-800-EXAMPLE during business hours.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
