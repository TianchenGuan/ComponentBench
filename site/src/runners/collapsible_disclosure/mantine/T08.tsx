'use client';

/**
 * collapsible_disclosure-mantine-T08: Exact set: keep only Shipping and Billing open
 * 
 * An order form card uses a multi-open accordion to organize sections.
 * 
 * - Layout: isolated_card, centered.
 * - Component: Mantine Accordion with multiple=true and 6 items:
 *   - "Customer"
 *   - "Shipping"
 *   - "Billing"
 *   - "Payment"
 *   - "Discounts"
 *   - "Review"
 * - Initial state: "Shipping", "Billing", and "Review" are expanded.
 * - Success requires an exact final expanded set: only "Shipping" and "Billing" open.
 * 
 * Success: expanded_panels equals exactly ["Shipping", "Billing"]
 */

import React, { useState, useEffect, useRef } from 'react';
import { Accordion, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['shipping', 'billing', 'review']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when exactly Shipping and Billing are expanded
    const sortedValue = [...value].sort();
    if (
      sortedValue.length === 2 &&
      sortedValue[0] === 'billing' &&
      sortedValue[1] === 'shipping' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Order form</Text>
      
      <Accordion 
        multiple 
        value={value} 
        onChange={setValue} 
        data-testid="accordion-root"
      >
        <Accordion.Item value="customer">
          <Accordion.Control>Customer</Accordion.Control>
          <Accordion.Panel>
            Customer name, email, and phone number.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="shipping">
          <Accordion.Control>Shipping</Accordion.Control>
          <Accordion.Panel>
            Shipping address and delivery options.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="billing">
          <Accordion.Control>Billing</Accordion.Control>
          <Accordion.Panel>
            Billing address and contact information.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="payment">
          <Accordion.Control>Payment</Accordion.Control>
          <Accordion.Panel>
            Payment method and card details.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="discounts">
          <Accordion.Control>Discounts</Accordion.Control>
          <Accordion.Panel>
            Apply coupon codes and discounts.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="review">
          <Accordion.Control>Review</Accordion.Control>
          <Accordion.Panel>
            Review your order before submitting.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
