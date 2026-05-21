'use client';

/**
 * breadcrumb-mantine-T09: Select from dark dropdown (Mantine)
 * 
 * Dark theme card titled "Article".
 * Mantine Breadcrumbs: Blog > Topics (menu) > Articles > Article
 * Topics menu: Technology, Science, Arts. Select "Science".
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card, Menu } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleSelectTopic = (topic: string) => {
    if (selectedTopic) return;
    setSelectedTopic(topic);
    if (topic === 'Science') {
      onSuccess();
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      style={{
        width: 450,
        background: '#1a1b1e',
        border: '1px solid #2c2e33',
      }}
    >
      <Text size="lg" fw={600} mb="md" c="white">
        Article
      </Text>
      
      <Breadcrumbs mb="md" separator="›">
        <Text c="#74c0fc">Blog</Text>
        <Menu shadow="md" width={130} data-testid="mantine-breadcrumb-topics-menu">
          <Menu.Target>
            <Anchor
              component="button"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, color: '#74c0fc' }}
            >
              Topics <IconChevronDown size={14} />
            </Anchor>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => handleSelectTopic('Technology')}>
              Technology
            </Menu.Item>
            <Menu.Item onClick={() => handleSelectTopic('Science')}>
              Science
            </Menu.Item>
            <Menu.Item onClick={() => handleSelectTopic('Arts')}>
              Arts
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Text c="#74c0fc">Articles</Text>
        <Text c="dimmed">Article</Text>
      </Breadcrumbs>

      {selectedTopic ? (
        <Text c="green" fw={500}>
          Selected topic: {selectedTopic}
        </Text>
      ) : (
        <Text c="dimmed">
          Click "Topics" to select a topic.
        </Text>
      )}
    </Card>
  );
}
