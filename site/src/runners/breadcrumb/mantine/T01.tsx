'use client';

/**
 * breadcrumb-mantine-T01: Navigate to Gallery (basic Mantine)
 * 
 * Centered isolated card titled "Photo Details".
 * Mantine Breadcrumbs: Home > Gallery > Photos > Photo
 * "Photo" is current page. Clicking "Gallery" shows navigation confirmation.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Gallery') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text size="lg" fw={600} mb="md">Photo Details</Text>
      
      <Breadcrumbs mb="md">
        <Anchor
          component="button"
          onClick={() => handleNavigate('Home')}
          data-testid="mantine-breadcrumb-home"
          style={{ cursor: 'pointer' }}
        >
          Home
        </Anchor>
        <Anchor
          component="button"
          onClick={() => handleNavigate('Gallery')}
          data-testid="mantine-breadcrumb-gallery"
          style={{ cursor: 'pointer' }}
        >
          Gallery
        </Anchor>
        <Anchor
          component="button"
          onClick={() => handleNavigate('Photos')}
          data-testid="mantine-breadcrumb-photos"
          style={{ cursor: 'pointer' }}
        >
          Photos
        </Anchor>
        <Text data-testid="mantine-breadcrumb-photo">Photo</Text>
      </Breadcrumbs>

      {navigated ? (
        <Text c="green" fw={500}>
          You navigated to: {navigated}
        </Text>
      ) : (
        <Text>
          Viewing photo details. Use the breadcrumb to navigate.
        </Text>
      )}
    </Card>
  );
}
