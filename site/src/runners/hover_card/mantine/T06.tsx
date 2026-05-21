'use client';

/**
 * hover_card-mantine-T06: Open delayed HoverCard near bottom-right (2 instances)
 *
 * Layout: dashboard widget placed near the bottom-right corner of the viewport (light theme).
 *
 * The widget is titled "Support" and contains two inline info labels:
 * - "SLA"
 * - "Support hours"
 *
 * Each label is wrapped in its own Mantine HoverCard (two instances).
 * - Both hover cards use a configured openDelay (requires a short dwell) and closeDelay (lingers briefly).
 * - Dropdown content is similar in structure (title + two bullet points), making the labels the main disambiguator.
 *
 * Initial state: both hover cards closed.
 * Clutter: low (a couple of unrelated buttons exist in the widget but are not required).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Group, Button, HoverCard, Stack, List } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const supportItems = [
  {
    label: 'SLA',
    title: 'Service Level Agreement',
    points: ['99.9% uptime guarantee', 'Response within 4 business hours']
  },
  {
    label: 'Support hours',
    title: 'Support Hours',
    points: ['Monday - Friday: 9 AM - 6 PM EST', 'Weekend: Emergency support only']
  }
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeItem === 'Support hours' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeItem, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 320 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Support</Text>
        <Button variant="subtle" size="xs">Contact</Button>
      </Group>
      <Group gap="lg">
        {supportItems.map((item) => (
          <HoverCard 
            key={item.label}
            width={260} 
            shadow="md"
            openDelay={300}
            closeDelay={150}
            onOpen={() => setActiveItem(item.label)}
            onClose={() => setActiveItem(null)}
          >
            <HoverCard.Target>
              <Text 
                c="blue" 
                td="underline"
                style={{ cursor: 'pointer' }}
                data-testid={`${item.label.toLowerCase().replace(' ', '-')}-trigger`}
                data-cb-instance={item.label}
              >
                {item.label}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown 
              data-testid={`hover-card-${item.label.toLowerCase().replace(' ', '-')}`}
              data-cb-instance={item.label}
            >
              <Stack gap="sm">
                <Text size="sm" fw={600}>{item.title}</Text>
                <List size="xs" spacing="xs">
                  {item.points.map((point, idx) => (
                    <List.Item key={idx}>{point}</List.Item>
                  ))}
                </List>
              </Stack>
            </HoverCard.Dropdown>
          </HoverCard>
        ))}
      </Group>
      <Button variant="light" fullWidth mt="md" size="xs">
        View documentation
      </Button>
    </Card>
  );
}
