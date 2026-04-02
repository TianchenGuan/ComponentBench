'use client';

/**
 * accordion-mantine-T09: Modal + scroll: open Cancellation section
 * 
 * Scene uses a modal_flow layout. The base page shows a button labeled "View policies". 
 * Clicking it opens a Mantine Modal titled "Policies". The modal body is scrollable and 
 * contains a few paragraphs of text, followed by the target Mantine Accordion. The 
 * accordion has 8 items. Initial state: all items collapsed. The "Cancellation" item is 
 * near the bottom of the modal content, so the user must scroll inside the modal to reach it.
 * 
 * Success: expanded_item_ids equals exactly: [cancellation]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text, Button, Modal, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const items = [
  { value: 'overview', label: 'Overview' },
  { value: 'payments', label: 'Payments' },
  { value: 'refunds', label: 'Refunds' },
  { value: 'returns', label: 'Returns' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'cancellation', label: 'Cancellation' },
  { value: 'privacy', label: 'Privacy' },
  { value: 'contact', label: 'Contact' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value === 'cancellation') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleOpen = () => {
    setOpened(true);
    setValue(null); // Reset when modal opens
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">Policy Information</Text>
        <Text mb="md" c="dimmed">
          Review our policies before proceeding with your order.
        </Text>
        <Button onClick={handleOpen}>View policies</Button>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Policies"
        size="lg"
        data-testid="policies-modal"
      >
        <ScrollArea h={400}>
          {/* Introductory text to push accordion below the fold */}
          <Text mb="md">
            Welcome to our comprehensive policy documentation. Please read through each 
            section carefully to understand your rights and our commitments to you as 
            a valued customer.
          </Text>
          <Text mb="md">
            Our policies are designed to be transparent and fair. We believe in clear 
            communication and want you to feel confident when using our services.
          </Text>
          <Text mb="md">
            If you have any questions about our policies, please don&apos;t hesitate to 
            contact our support team. We&apos;re here to help you understand every aspect 
            of our terms and conditions.
          </Text>
          <Text mb="md">
            Below you will find detailed information about various aspects of our service, 
            including payment processing, refund procedures, shipping policies, and more.
          </Text>
          <Text mb="lg">
            Please scroll down to view all policy sections in the accordion below.
          </Text>

          <Accordion 
            value={value} 
            onChange={setValue} 
            data-testid="accordion-root"
          >
            {items.map(item => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.Control>{item.label}</Accordion.Control>
                <Accordion.Panel>
                  Detailed information about our {item.label.toLowerCase()} policy.
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </ScrollArea>
      </Modal>
    </>
  );
}
