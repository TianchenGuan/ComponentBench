'use client';

/**
 * link-mantine-T05: Pick the link that matches a reference color dot
 * 
 * setup_description:
 * A form_section titled "Quick Access" is centered on the page. At the top of the section
 * is a small reference swatch: a solid green circular dot with the label "Reference".
 * 
 * Below is a vertical list of four Mantine Anchor rows. Each row starts with a small
 * colored dot (visual indicator) followed by a text label:
 * - Red dot — "Billing"
 * - Blue dot — "Usage"
 * - Green dot — "Status" <- target
 * - Orange dot — "Changelog"
 * 
 * success_trigger:
 * - The link row whose dot color matches the reference swatch (green) was activated
 *   (data-testid="link-status-green").
 * - The current route pathname equals "/status".
 */

import React, { useState } from 'react';
import { Card, Text, Anchor, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface LinkRow {
  key: string;
  label: string;
  color: string;
  dotColor: string;
  path: string;
  testId: string;
}

const linkRows: LinkRow[] = [
  { key: 'billing', label: 'Billing', color: '#ff4d4f', dotColor: 'red', path: '/billing', testId: 'link-billing-red' },
  { key: 'usage', label: 'Usage', color: '#1890ff', dotColor: 'blue', path: '/usage', testId: 'link-usage-blue' },
  { key: 'status', label: 'Status', color: '#52c41a', dotColor: 'green', path: '/status', testId: 'link-status-green' },
  { key: 'changelog', label: 'Changelog', color: '#fa8c16', dotColor: 'orange', path: '/changelog', testId: 'link-changelog-orange' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/home');
  const [activated, setActivated] = useState(false);

  const handleClick = (link: LinkRow) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute(link.path);
    if (link.dotColor === 'green') {
      setActivated(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Quick Access
      </Text>
      
      {/* Reference Swatch */}
      <Box mb="lg">
        <Text size="sm" c="dimmed" mb="xs">Reference swatch:</Text>
        <Group gap="xs">
          <Box 
            data-reference-dot="green"
            style={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              backgroundColor: '#52c41a',
            }} 
          />
          <Text size="sm">(green dot)</Text>
        </Group>
      </Box>

      <Text size="sm" c="dimmed" mb="md">
        Select the link with the matching color dot:
      </Text>

      {/* Links List */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {linkRows.map((link) => (
          <Anchor
            key={link.key}
            href={link.path}
            onClick={handleClick(link)}
            data-testid={link.testId}
            data-dot={link.dotColor}
          >
            <Group gap="xs">
              <Box
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: link.color,
                }}
              />
              {link.label}
            </Group>
          </Anchor>
        ))}
      </Box>
    </Card>
  );
}
