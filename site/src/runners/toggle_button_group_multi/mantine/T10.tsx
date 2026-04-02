'use client';

/**
 * toggle_button_group_multi-mantine-T30: Dashboard: match active badges to visual reference
 *
 * Layout: dashboard with the control cluster anchored near the top-left of the viewport 
 * (placement=top_left).
 *
 * The page looks like a product merchandising dashboard with multiple cards, charts, 
 * and controls. Three Chip.Group (multiple) components are present with similar styling:
 *
 * 1) "Quick filters"
 *    - Chips: In stock, On sale, Featured, New arrivals
 *    - Initial state: In stock and Featured selected
 * 2) "Highlights"
 *    - Chips: Top rated, Bestseller, Staff pick, Free shipping
 *    - Initial state: Top rated selected only
 * 3) "Active badges" (TARGET)
 *    - Chips: New, Sale, Verified, Trending, Limited, Eco, Exclusive
 *    - Initial state: New and Sale selected
 *
 * A non-interactive card titled "Reference" shows a mock product tile with the intended 
 * badges visually highlighted (Verified, Trending, Limited, Eco).
 *
 * Clutter (high):
 * - Multiple other buttons (Publish, Preview, Refresh), a search field, and chart cards.
 * - The three chip groups are visually similar and located near each other.
 *
 * No Apply/Save step; chip selections apply immediately. Only "Active badges" should 
 * be changed; other chip groups must remain at their initial states.
 *
 * Success: Active badges → Verified, Trending, Limited, Eco (require_correct_instance: true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, Text, Chip, Group, Button, TextInput, SimpleGrid, Badge, Box, Flex 
} from '@mantine/core';
import { IconSearch, IconRefresh, IconEye, IconUpload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const QUICK_FILTER_OPTIONS = ['In stock', 'On sale', 'Featured', 'New arrivals'];
const HIGHLIGHT_OPTIONS = ['Top rated', 'Bestseller', 'Staff pick', 'Free shipping'];
const BADGE_OPTIONS = ['New', 'Sale', 'Verified', 'Trending', 'Limited', 'Eco', 'Exclusive'];

const TARGET_SET = new Set(['Verified', 'Trending', 'Limited', 'Eco']);
const REFERENCE_SET = new Set(['Verified', 'Trending', 'Limited', 'Eco']);

export default function T10({ onSuccess }: TaskComponentProps) {
  const [quickFilters, setQuickFilters] = useState<string[]>(['In stock', 'Featured']);
  const [highlights, setHighlights] = useState<string[]>(['Top rated']);
  const [activeBadges, setActiveBadges] = useState<string[]>(['New', 'Sale']);
  const successFiredRef = useRef(false);

  // Initial states for non-target groups
  const quickFiltersInitial = useRef(['In stock', 'Featured']);
  const highlightsInitial = useRef(['Top rated']);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check if active badges has the target set
    const badgesSet = new Set(activeBadges);
    const badgesMatch = badgesSet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => badgesSet.has(v));

    // Check if non-target groups are unchanged
    const quickUnchanged = JSON.stringify([...quickFilters].sort()) === 
      JSON.stringify([...quickFiltersInitial.current].sort());
    const highlightsUnchanged = JSON.stringify([...highlights].sort()) === 
      JSON.stringify([...highlightsInitial.current].sort());

    if (badgesMatch && quickUnchanged && highlightsUnchanged) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [activeBadges, quickFilters, highlights, onSuccess]);

  return (
    <Box style={{ width: 900 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb="md">
        <Text fw={600} size="xl">Product Dashboard</Text>
        <Group gap="xs">
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={14} />}
            size="xs"
            style={{ width: 150 }}
          />
          <Button variant="outline" size="xs" leftSection={<IconRefresh size={14} />}>
            Refresh
          </Button>
          <Button variant="outline" size="xs" leftSection={<IconEye size={14} />}>
            Preview
          </Button>
          <Button size="xs" leftSection={<IconUpload size={14} />}>
            Publish
          </Button>
        </Group>
      </Flex>

      <SimpleGrid cols={3} spacing="md">
        {/* Left column - filters */}
        <Box>
          {/* Quick filters */}
          <Card shadow="sm" padding="sm" radius="md" withBorder mb="md" data-testid="quick-filters-card">
            <Text size="sm" fw={500} mb="xs">Quick filters</Text>
            <Chip.Group 
              multiple 
              value={quickFilters} 
              onChange={setQuickFilters}
              data-testid="quick-filters-group"
            >
              <Group gap={4}>
                {QUICK_FILTER_OPTIONS.map(opt => (
                  <Chip key={opt} value={opt} size="xs" data-testid={`quick-${opt.toLowerCase().replace(/\s+/g, '-')}`}>
                    {opt}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Card>

          {/* Highlights */}
          <Card shadow="sm" padding="sm" radius="md" withBorder data-testid="highlights-card">
            <Text size="sm" fw={500} mb="xs">Highlights</Text>
            <Chip.Group 
              multiple 
              value={highlights} 
              onChange={setHighlights}
              data-testid="highlights-group"
            >
              <Group gap={4}>
                {HIGHLIGHT_OPTIONS.map(opt => (
                  <Chip key={opt} value={opt} size="xs" data-testid={`highlight-${opt.toLowerCase().replace(/\s+/g, '-')}`}>
                    {opt}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Card>
        </Box>

        {/* Middle column - Active badges (TARGET) */}
        <Box>
          <Card shadow="sm" padding="sm" radius="md" withBorder data-testid="active-badges-card">
            <Text size="sm" fw={500} mb="xs">Active badges</Text>
            <Text size="xs" c="blue" mb="xs">
              Match Reference: Verified, Trending, Limited, Eco
            </Text>
            <Chip.Group 
              multiple 
              value={activeBadges} 
              onChange={setActiveBadges}
              data-testid="active-badges-group"
            >
              <Group gap={4}>
                {BADGE_OPTIONS.map(opt => (
                  <Chip key={opt} value={opt} size="xs" data-testid={`badge-${opt.toLowerCase()}`}>
                    {opt}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Card>

          {/* Chart placeholder */}
          <Card shadow="sm" padding="sm" radius="md" withBorder mt="md">
            <Text size="sm" fw={500} mb="xs">Sales chart</Text>
            <Box style={{ 
              height: 100, 
              background: '#f5f5f5', 
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text size="xs" c="dimmed">[Chart placeholder]</Text>
            </Box>
          </Card>
        </Box>

        {/* Right column - Reference */}
        <Card shadow="sm" padding="sm" radius="md" withBorder data-testid="reference-card">
          <Text size="sm" fw={500} mb="xs">Reference</Text>
          <Text size="xs" c="dimmed" mb="sm">
            Target badge configuration:
          </Text>

          <Box style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: 8, 
            padding: 12,
            background: '#fafafa',
          }}>
            <Group gap={4} mb="sm">
              {BADGE_OPTIONS.map(badge => (
                <Badge 
                  key={badge} 
                  size="xs"
                  color={REFERENCE_SET.has(badge) ? 'green' : 'gray'}
                  variant={REFERENCE_SET.has(badge) ? 'filled' : 'outline'}
                >
                  {badge}
                </Badge>
              ))}
            </Group>
            <Text size="xs" c="dimmed">Mock Product</Text>
          </Box>

          <Text size="xs" c="dimmed" mt="sm">
            (Reference - not interactive)
          </Text>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
