'use client';

/**
 * collapsible_disclosure-mantine-T07: Compact scroll: find and expand Rate limits
 * 
 * A developer documentation card uses compact spacing and an inner scroll area.
 * 
 * - Layout: isolated_card, centered.
 * - Spacing: compact (tight padding on controls).
 * - Component: Mantine Accordion with 15 items placed inside a Mantine ScrollArea (fixed height ~320px).
 * - Items include: "Getting started", "Authentication", "Errors", "Limits", "Usage", "Rate limits", "Webhooks", etc.
 * - Initial state: all items collapsed.
 * - "Rate limits" is not initially visible; must scroll inside the ScrollArea.
 * 
 * Success: "Rate limits" is expanded
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const ACCORDION_ITEMS = [
  { key: 'getting_started', label: 'Getting started', content: 'Introduction to the API.' },
  { key: 'authentication', label: 'Authentication', content: 'How to authenticate API requests.' },
  { key: 'endpoints', label: 'Endpoints', content: 'Available API endpoints.' },
  { key: 'requests', label: 'Requests', content: 'How to format requests.' },
  { key: 'responses', label: 'Responses', content: 'Understanding API responses.' },
  { key: 'errors', label: 'Errors', content: 'Error codes and handling.' },
  { key: 'limits', label: 'Limits', content: 'General API limits.' },
  { key: 'usage', label: 'Usage', content: 'Tracking API usage.' },
  { key: 'rate_limits', label: 'Rate limits', content: 'Rate limiting policies and quotas.' },
  { key: 'webhooks', label: 'Webhooks', content: 'Setting up webhooks.' },
  { key: 'pagination', label: 'Pagination', content: 'Paginating through results.' },
  { key: 'filtering', label: 'Filtering', content: 'Filtering API results.' },
  { key: 'sorting', label: 'Sorting', content: 'Sorting API results.' },
  { key: 'versioning', label: 'Versioning', content: 'API versioning.' },
  { key: 'sdks', label: 'SDKs', content: 'Official client libraries.' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value === 'rate_limits') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="md" mb="sm">Developer docs</Text>
      
      <ScrollArea h={320} data-testid="scroll-container">
        <Accordion 
          value={value} 
          onChange={setValue} 
          data-testid="accordion-root"
          styles={{
            control: { padding: '8px 12px' },
            panel: { padding: '8px 12px' },
          }}
        >
          {ACCORDION_ITEMS.map(item => (
            <Accordion.Item key={item.key} value={item.key}>
              <Accordion.Control>
                <Text size="sm">{item.label}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">{item.content}</Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </ScrollArea>
    </Card>
  );
}
