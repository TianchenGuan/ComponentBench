'use client';

/**
 * hover_card-mantine-T07: Scroll long list and open topic HoverCard (dark, compact)
 *
 * Layout: settings_panel with a left "Docs topics" sidebar and main content area. Dark theme, compact spacing, small scale.
 *
 * The left sidebar is a tall scrollable list of many topic links (e.g., Authentication, Webhooks, Pagination, Errors, …).
 * - Hovering any topic opens a single Mantine HoverCard dropdown (controlled instance) with a short description.
 * - The target topic "Rate limits" is not visible at first; the sidebar must be scrolled to reveal it.
 * - The link row height is small due to compact spacing, increasing hover precision demands.
 *
 * Instances: 1 hover card instance (shared).
 * Clutter: medium (main content has headings and buttons, but not required).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Stack, HoverCard, Box, ScrollArea, Group, Button } from '@mantine/core';
import { MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const topics = [
  { name: 'Getting Started', description: 'Quick start guide for new users.' },
  { name: 'Authentication', description: 'Learn about API keys and OAuth.' },
  { name: 'Webhooks', description: 'Set up real-time event notifications.' },
  { name: 'Pagination', description: 'Handle large data sets efficiently.' },
  { name: 'Errors', description: 'Understand error codes and handling.' },
  { name: 'Versioning', description: 'API version management and migration.' },
  { name: 'SDKs', description: 'Official client libraries and SDKs.' },
  { name: 'Testing', description: 'Test mode and sandbox environments.' },
  { name: 'Security', description: 'Best practices for secure integration.' },
  { name: 'Billing', description: 'Subscription and payment management.' },
  { name: 'Rate limits', description: 'API rate limiting and quotas explained.' },
  { name: 'Changelog', description: 'Recent updates and release notes.' },
];

const TARGET_TOPIC = 'Rate limits';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeTopic === TARGET_TOPIC && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeTopic, onSuccess]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Card shadow="sm" padding={0} radius="md" withBorder style={{ width: 500, background: '#1a1a1a' }}>
        <Group gap={0} align="stretch" style={{ minHeight: 350 }}>
          {/* Sidebar */}
          <Box style={{ width: 180, borderRight: '1px solid #333', background: '#1f1f1f' }}>
            <Text size="xs" fw={600} p="sm" style={{ borderBottom: '1px solid #333', color: '#999' }}>
              Docs topics
            </Text>
            <ScrollArea h={280} data-testid="docs-sidebar-scroll">
              <Stack gap={0}>
                {topics.map((topic) => (
                  <HoverCard 
                    key={topic.name}
                    width={220} 
                    shadow="md"
                    position="right"
                    onOpen={() => setActiveTopic(topic.name)}
                    onClose={() => setActiveTopic(null)}
                  >
                    <HoverCard.Target>
                      <Text 
                        size="xs"
                        p="xs"
                        style={{ 
                          cursor: 'pointer',
                          color: activeTopic === topic.name ? '#228be6' : '#ccc',
                          background: activeTopic === topic.name ? '#333' : 'transparent'
                        }}
                        data-testid={`topic-${topic.name.toLowerCase().replace(' ', '-')}`}
                        data-topic-id={topic.name.toLowerCase().replace(' ', '-')}
                        data-cb-instance={`Topic: ${topic.name}`}
                      >
                        {topic.name}
                      </Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown 
                      style={{ background: '#2a2a2a', border: '1px solid #444' }}
                      data-testid={`hover-card-${topic.name.toLowerCase().replace(' ', '-')}`}
                      data-cb-instance={`Topic: ${topic.name}`}
                    >
                      <Text size="sm" fw={600} c="white" mb={4}>{topic.name}</Text>
                      <Text size="xs" c="dimmed">{topic.description}</Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                ))}
              </Stack>
            </ScrollArea>
          </Box>

          {/* Main content (clutter) */}
          <Box style={{ flex: 1, padding: 16 }}>
            <Text size="lg" fw={600} c="white" mb="md">Documentation</Text>
            <Text size="sm" c="dimmed" mb="md">
              Welcome to our API documentation. Select a topic from the sidebar to learn more.
            </Text>
            <Group gap="xs">
              <Button size="xs" variant="outline">Quick Start</Button>
              <Button size="xs" variant="outline">API Reference</Button>
            </Group>
          </Box>
        </Group>
      </Card>
    </MantineProvider>
  );
}
