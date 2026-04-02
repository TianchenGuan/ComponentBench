'use client';

/**
 * breadcrumb-mantine-T07: Navigate in compact bottom-left (Mantine)
 * 
 * Dashboard with compact breadcrumb in bottom-left.
 * Mantine Breadcrumbs: Library > Archive > 2024 > January
 * Small scale, compact spacing. Click "Archive".
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Archive') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 320 }}>
      <Text size="sm" fw={600} mb="xs">January Files</Text>
      
      <Breadcrumbs mb="xs" separator="›" style={{ fontSize: 12 }}>
        <Anchor
          component="button"
          onClick={() => handleNavigate('Library')}
          data-testid="mantine-breadcrumb-library"
          size="xs"
          style={{ cursor: 'pointer' }}
        >
          Library
        </Anchor>
        <Anchor
          component="button"
          onClick={() => handleNavigate('Archive')}
          data-testid="mantine-breadcrumb-archive"
          size="xs"
          style={{ cursor: 'pointer' }}
        >
          Archive
        </Anchor>
        <Anchor
          component="button"
          onClick={() => handleNavigate('2024')}
          data-testid="mantine-breadcrumb-2024"
          size="xs"
          style={{ cursor: 'pointer' }}
        >
          2024
        </Anchor>
        <Text size="xs" data-testid="mantine-breadcrumb-january">
          January
        </Text>
      </Breadcrumbs>

      {navigated ? (
        <Text c="green" fw={500} size="sm">
          Navigated to: {navigated}
        </Text>
      ) : (
        <Text size="sm">
          Viewing January files. Navigate using breadcrumb.
        </Text>
      )}
    </Card>
  );
}
