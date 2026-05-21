'use client';

/**
 * breadcrumb-mantine-T10: Two-section disambiguation (Mantine)
 * 
 * Form section with two labeled breadcrumb areas.
 * 1. "Active Path": Root > Docs > Guides > Guide
 * 2. "Recent Path": History > Docs > API > Method
 * Click "Docs" in Active Path only.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<{ section: string; item: string } | null>(null);

  const handleNavigate = (section: string, item: string) => {
    if (navigated) return;
    setNavigated({ section, item });
    if (section === 'active_path' && item === 'Docs') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text size="lg" fw={600} mb="lg">Navigation</Text>

      {/* Active Path Section */}
      <Box mb="xl">
        <Text size="sm" fw={600} mb="xs" c="blue">
          Active Path
        </Text>
        <Breadcrumbs>
          <Anchor
            component="button"
            onClick={() => handleNavigate('active_path', 'Root')}
            data-testid="mantine-breadcrumb-active-root"
            style={{ cursor: 'pointer' }}
          >
            Root
          </Anchor>
          <Anchor
            component="button"
            onClick={() => handleNavigate('active_path', 'Docs')}
            data-testid="mantine-breadcrumb-active-docs"
            style={{ cursor: 'pointer' }}
          >
            Docs
          </Anchor>
          <Anchor
            component="button"
            onClick={() => handleNavigate('active_path', 'Guides')}
            data-testid="mantine-breadcrumb-active-guides"
            style={{ cursor: 'pointer' }}
          >
            Guides
          </Anchor>
          <Text>Guide</Text>
        </Breadcrumbs>
      </Box>

      {/* Recent Path Section */}
      <Box mb="md">
        <Text size="sm" fw={600} mb="xs" c="dimmed">
          Recent Path
        </Text>
        <Breadcrumbs>
          <Anchor
            component="button"
            onClick={() => handleNavigate('recent_path', 'History')}
            data-testid="mantine-breadcrumb-recent-history"
            style={{ cursor: 'pointer' }}
          >
            History
          </Anchor>
          <Anchor
            component="button"
            onClick={() => handleNavigate('recent_path', 'Docs')}
            data-testid="mantine-breadcrumb-recent-docs"
            style={{ cursor: 'pointer' }}
          >
            Docs
          </Anchor>
          <Anchor
            component="button"
            onClick={() => handleNavigate('recent_path', 'API')}
            data-testid="mantine-breadcrumb-recent-api"
            style={{ cursor: 'pointer' }}
          >
            API
          </Anchor>
          <Text>Method</Text>
        </Breadcrumbs>
      </Box>

      {navigated && (
        <Text
          c={navigated.section === 'active_path' && navigated.item === 'Docs' ? 'green' : 'red'}
          fw={500}
          mt="md"
        >
          {navigated.section === 'active_path' && navigated.item === 'Docs'
            ? `Correct! Navigated to ${navigated.item} in Active Path.`
            : `Wrong! You clicked ${navigated.item} in ${navigated.section === 'active_path' ? 'Active Path' : 'Recent Path'}.`}
        </Text>
      )}
    </Card>
  );
}
