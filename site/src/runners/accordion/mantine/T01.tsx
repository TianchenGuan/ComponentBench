'use client';

/**
 * accordion-mantine-T01: FAQ: open Shipping & Returns (Mantine)
 * 
 * A centered isolated card titled "FAQ" contains a Mantine Accordion with 4 items: 
 * "Shipping & Returns", "Warranty", "Sizing", and "Contact". Accordion is in its 
 * default single-open mode (multiple=false). Initial state: all items collapsed. 
 * Clicking an item control row toggles its panel open/closed and rotates the chevron icon.
 * 
 * Success: expanded_item_ids equals exactly: [shipping_returns]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value === 'shipping_returns') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">FAQ</Text>
      
      <Accordion value={value} onChange={setValue} data-testid="accordion-root">
        <Accordion.Item value="shipping_returns">
          <Accordion.Control>Shipping &amp; Returns</Accordion.Control>
          <Accordion.Panel>
            We offer free shipping on orders over $50. Returns are accepted within 30 days 
            of purchase with original receipt.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="warranty">
          <Accordion.Control>Warranty</Accordion.Control>
          <Accordion.Panel>
            All products come with a 1-year manufacturer warranty covering defects in 
            materials and workmanship.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="sizing">
          <Accordion.Control>Sizing</Accordion.Control>
          <Accordion.Panel>
            Please refer to our sizing guide for accurate measurements. Contact us if you 
            need assistance finding your size.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="contact">
          <Accordion.Control>Contact</Accordion.Control>
          <Accordion.Panel>
            Reach out to us via email at support@example.com or call 1-800-EXAMPLE.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
