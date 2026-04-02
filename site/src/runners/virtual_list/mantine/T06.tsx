'use client';

/**
 * virtual_list-mantine-T06: Match text plus a visual badge
 *
 * Layout: isolated_card centered titled "Choose a Plan".
 * Visual guidance element: a small "Target badge" above the list shows a specific color (e.g., teal).
 * Target component: virtualized list (h≈320px) of ~200 plan variations.
 * Row content: plan name + a colored Mantine Badge on the right.
 *   - Multiple rows share the same plan name ("Starter") but have different badge colors.
 * Initial state: list at top; no selection.
 *
 * Success: Select row with key 'plan-starter-teal'
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, Badge, Group } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../types';

interface PlanItem {
  key: string;
  name: string;
  badgeColor: string;
  badgeLabel: string;
}

const colors = ['teal', 'blue', 'red', 'orange', 'grape', 'cyan', 'pink', 'lime'];
const names = ['Starter', 'Pro', 'Business', 'Enterprise'];

// Generate 200 plan variations
const generatePlans = (): PlanItem[] => {
  return Array.from({ length: 200 }, (_, i) => {
    const name = names[i % names.length];
    const color = colors[i % colors.length];
    return {
      key: `plan-${name.toLowerCase()}-${color}`,
      name,
      badgeColor: color,
      badgeLabel: color.charAt(0).toUpperCase() + color.slice(1),
    };
  });
};

const plans = generatePlans();
// Target is the first "Starter" with "teal" badge
const targetPlan = plans.find(p => p.key === 'plan-starter-teal')!;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: plans.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  // Check success condition
  useEffect(() => {
    if (selectedKey === 'plan-starter-teal') {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 400 }} data-testid="vl-primary">
      <Text fw={600} size="lg" mb="sm">Choose a Plan</Text>

      {/* Target badge reference */}
      <Paper withBorder p="sm" mb="md" bg="gray.0">
        <Group gap="sm">
          <Text size="sm" c="dimmed">Target badge:</Text>
          <Badge color={targetPlan.badgeColor}>{targetPlan.badgeLabel}</Badge>
        </Group>
      </Paper>

      <Box
        ref={parentRef}
        style={{
          height: 320,
          overflow: 'auto',
          border: '1px solid #e9ecef',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
            const item = plans[virtualRow.index];
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                data-selected={selectedKey === item.key}
                aria-selected={selectedKey === item.key}
                onClick={() => setSelectedKey(item.key)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: selectedKey === item.key ? '#e7f5ff' : 'transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text size="sm">{item.name}</Text>
                <Badge color={item.badgeColor}>{item.badgeLabel}</Badge>
              </div>
            );
          })}
        </div>
      </Box>

      <Text size="sm" c="dimmed" mt="sm">
        Selected: {selectedKey ? plans.find(p => p.key === selectedKey)?.name : 'none'}
      </Text>
    </Paper>
  );
}
