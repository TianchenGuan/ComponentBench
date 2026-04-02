'use client';

/**
 * virtual_list-mantine-T10: Clear all selections in compact mode and save
 *
 * Spacing mode: compact (tight vertical spacing and smaller checkboxes).
 * Layout: isolated_card centered titled "Notification Rules".
 * Target component: a virtualized checkbox list ("Triggers") inside Mantine ScrollArea (h≈320px).
 * Initial state: 5 triggers are pre-checked; at least 2 of them are below the fold.
 * Controls:
 *   - a small "Reset selections" button in the list header (clears all checks at once)
 *   - a footer bar with a primary "Save" button (must be clicked to commit)
 *
 * Success: All items cleared AND "Save" is clicked
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, Button, Checkbox, Group, Notification } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../types';
import { selectionSetEquals } from '../types';

interface TriggerItem {
  key: string;
  name: string;
  description: string;
}

// Generate 100 triggers
const generateTriggers = (): TriggerItem[] => {
  const names = ['Email alert', 'SMS notification', 'Push message', 'Slack ping', 'Webhook call', 'Log entry', 'Dashboard update', 'Report generation'];
  return Array.from({ length: 100 }, (_, i) => ({
    key: `trigger-${String(i + 1).padStart(3, '0')}`,
    name: `${names[i % names.length]} ${i + 1}`,
    description: `Trigger ${i + 1} configuration`,
  }));
};

const triggers = generateTriggers();
// Pre-checked items: some visible, some offscreen
const INITIAL_CHECKED = ['trigger-001', 'trigger-003', 'trigger-020', 'trigger-035', 'trigger-050'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set(INITIAL_CHECKED));
  const [hasSaved, setHasSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: triggers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // Compact row height
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

  const handleResetSelections = () => {
    setCheckedKeys(new Set());
  };

  const handleSave = () => {
    setHasSaved(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Check success condition
  useEffect(() => {
    if (hasSaved && selectionSetEquals(checkedKeys, [])) {
      onSuccess();
    }
  }, [hasSaved, checkedKeys, onSuccess]);

  return (
    <>
      <Paper shadow="sm" p="md" withBorder style={{ width: 420 }} data-testid="vl-primary">
        <Text fw={600} size="lg" mb="sm">Notification Rules</Text>

        {/* Header with controls */}
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">Selected: {checkedKeys.size}</Text>
          <Button 
            variant="subtle" 
            size="xs" 
            onClick={handleResetSelections}
            disabled={checkedKeys.size === 0}
          >
            Reset selections
          </Button>
        </Group>

        <Box
          ref={parentRef}
          style={{
            height: 320,
            overflow: 'auto',
            border: '1px solid #e9ecef',
            borderRadius: 4,
            marginBottom: 12,
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
              const item = triggers[virtualRow.index];
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
                    padding: '6px 12px', // Compact padding
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Checkbox
                    size="xs"
                    checked={isChecked}
                    onChange={() => handleToggleCheck(item.key)}
                  />
                  <Text size="xs">{item.name}</Text>
                </div>
              );
            })}
          </div>
        </Box>

        {/* Footer with Save button */}
        <Group justify="flex-end" pt="sm" style={{ borderTop: '1px solid #e9ecef' }}>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Paper>

      {showToast && (
        <Notification 
          title="Success" 
          color="teal" 
          onClose={() => setShowToast(false)}
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        >
          Rules updated
        </Notification>
      )}
    </>
  );
}
