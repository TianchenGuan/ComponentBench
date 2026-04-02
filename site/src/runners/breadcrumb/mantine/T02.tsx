'use client';

/**
 * breadcrumb-mantine-T02: Navigate Home with icon (Mantine)
 * 
 * Centered card titled "Article".
 * Mantine Breadcrumbs: [Home icon] > Posts > Article
 * First item is IconHome from Tabler icons.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card, ActionIcon } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Home') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text size="lg" fw={600} mb="md">Article</Text>
      
      <Breadcrumbs mb="md">
        <Anchor
          component="button"
          onClick={() => handleNavigate('Home')}
          data-testid="mantine-breadcrumb-home"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <IconHome size={18} />
        </Anchor>
        <Anchor
          component="button"
          onClick={() => handleNavigate('Posts')}
          data-testid="mantine-breadcrumb-posts"
          style={{ cursor: 'pointer' }}
        >
          Posts
        </Anchor>
        <Text data-testid="mantine-breadcrumb-article">Article</Text>
      </Breadcrumbs>

      {navigated ? (
        <Text c="green" fw={500}>
          You navigated to: {navigated}
        </Text>
      ) : (
        <Text>
          Reading an article. Click the home icon to navigate.
        </Text>
      )}
    </Card>
  );
}
