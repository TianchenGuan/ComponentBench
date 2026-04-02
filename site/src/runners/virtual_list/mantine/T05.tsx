'use client';

/**
 * virtual_list-mantine-T05: Select multiple tags from a virtualized list
 *
 * Layout: isolated_card centered titled "Tag Selector".
 * Target component: virtualized multi-select list within Mantine ScrollArea (h≈340px) with ~500 tags.
 * Row content: Checkbox · "Tag #### — <label>".
 * Initial state: no tags selected; list starts at top.
 *
 * Success: Exactly tags 0011, 0020, 0042, 0048 are checked
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, Checkbox } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../types';
import { selectionSetEquals } from '../types';

interface TagItem {
  key: string;
  id: string;
  label: string;
}

// Generate 500 tags
const generateTags = (): TagItem[] => {
  const labels = ['Urgent', 'Finance', 'Legal', 'Customer', 'FinOps', 'Financial', 'Marketing', 'Sales', 'Support', 'Engineering'];
  return Array.from({ length: 500 }, (_, i) => ({
    key: `tag-${String(i + 1).padStart(4, '0')}`,
    id: `Tag ${String(i + 1).padStart(4, '0')}`,
    label: labels[i % labels.length],
  }));
};

const tags = generateTags();
const TARGET_KEYS = ['tag-0011', 'tag-0020', 'tag-0042', 'tag-0048'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tags.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 5,
  });

  const handleToggleCheck = (key: string) => {
    setCheckedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Check success condition
  useEffect(() => {
    if (selectionSetEquals(checkedKeys, TARGET_KEYS)) {
      onSuccess();
    }
  }, [checkedKeys, onSuccess]);

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 400 }} data-testid="vl-primary">
      <Text fw={600} size="lg" mb="sm">Tag Selector</Text>
      <Text size="sm" c="dimmed" mb="sm">Selected tags: {checkedKeys.size}</Text>
      
      <Box
        ref={parentRef}
        style={{
          height: 340,
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
            const item = tags[virtualRow.index];
            const isChecked = checkedKeys.has(item.key);
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-checked={isChecked}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '8px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={() => handleToggleCheck(item.key)}
                />
                <Text size="sm">{item.id} — {item.label}</Text>
              </div>
            );
          })}
        </div>
      </Box>
    </Paper>
  );
}
