'use client';

/**
 * rating-mantine-T09: Cluttered dashboard: set Support to 2.5 (Mantine)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: dashboard with high clutter.
 * Three separate cards each contain an editable Mantine Rating component:
 *   • "Documentation" rating (fractions=1)
 *   • "Support" rating (fractions=2, half-step)
 *   • "Pricing" rating (fractions=1)
 * Additional clutter includes a search box, filter chips, and a notifications icon row.
 * Initial state: Documentation = 4, Support = 4.0, Pricing = 3.
 * Only the "Support" rating should be changed, and it supports half-stars.
 * No confirm button; changes commit immediately.
 * 
 * Success: Target rating value equals 2.5 out of 5 on "Support" AND others remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Rating, Stack, Grid, TextInput, Badge, Group, ActionIcon } from '@mantine/core';
import { IconSearch, IconBell, IconFilter } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [documentation, setDocumentation] = useState<number>(4);
  const [support, setSupport] = useState<number>(4);
  const [pricing, setPricing] = useState<number>(3);
  
  const initialDocumentation = useRef(4);
  const initialPricing = useRef(3);

  useEffect(() => {
    // Success requires Support = 2.5 AND others unchanged
    if (
      support === 2.5 && 
      documentation === initialDocumentation.current && 
      pricing === initialPricing.current
    ) {
      onSuccess();
    }
  }, [support, documentation, pricing, onSuccess]);

  return (
    <Stack gap="md" style={{ maxWidth: 700 }}>
      <Text fw={600} size="xl">Customer dashboard</Text>
      
      {/* Clutter elements */}
      <Group justify="space-between">
        <TextInput
          placeholder="Search..."
          leftSection={<IconSearch size={16} />}
          style={{ width: 250 }}
        />
        <Group gap="xs">
          <Badge variant="light">All</Badge>
          <Badge variant="outline">Active</Badge>
          <Badge variant="outline">Archived</Badge>
          <ActionIcon variant="subtle">
            <IconFilter size={18} />
          </ActionIcon>
          <ActionIcon variant="subtle">
            <IconBell size={18} />
          </ActionIcon>
        </Group>
      </Group>
      
      {/* Rating cards */}
      <Grid>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Stack gap="sm">
              <Text fw={500}>Documentation</Text>
              <Rating
                value={documentation}
                onChange={setDocumentation}
                fractions={1}
                data-testid="rating-documentation"
              />
            </Stack>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Stack gap="sm">
              <Text fw={500}>Support</Text>
              <Rating
                value={support}
                onChange={setSupport}
                fractions={2}
                data-testid="rating-support"
              />
            </Stack>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Stack gap="sm">
              <Text fw={500}>Pricing</Text>
              <Rating
                value={pricing}
                onChange={setPricing}
                fractions={1}
                data-testid="rating-pricing"
              />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
