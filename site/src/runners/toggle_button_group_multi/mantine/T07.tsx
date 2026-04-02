'use client';

/**
 * toggle_button_group_multi-mantine-T27: Confirm privacy visibility changes
 *
 * Layout: isolated_card centered in the viewport, using a dark theme.
 *
 * A card titled "Privacy" contains:
 * - A Chip.Group (multiple selection) labeled "Visibility" with chips:
 *   Profile, Email, Activity, Online status
 * - A primary button below the chips labeled "Apply".
 *
 * Initial state:
 * - Profile and Activity are selected.
 * - Email and Online status are unselected.
 *
 * Confirmation behavior:
 * - Clicking "Apply" opens a small confirmation popover anchored to the Apply button.
 * - Popover text: "Apply visibility changes?"
 * - Actions: "Cancel" and "Confirm".
 * - The new selection is committed only after clicking "Confirm".
 *
 * Clutter=low: only the Apply button and confirmation popover are additional UI.
 *
 * Success: Selected options equal exactly: Profile, Online status (require_confirm: true, confirm_control: Confirm)
 * Theme: dark
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Chip, Group, Button, Popover, Flex, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const VISIBILITY_OPTIONS = ['Profile', 'Email', 'Activity', 'Online status'];
const TARGET_SET = new Set(['Profile', 'Online status']);

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Profile', 'Activity']);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const successFiredRef = useRef(false);

  const handleConfirm = () => {
    if (successFiredRef.current) return;
    
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      successFiredRef.current = true;
      setPopoverOpen(false);
      onSuccess();
    } else {
      setPopoverOpen(false);
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ 
        width: 420,
        background: '#1f1f1f',
        borderColor: '#303030',
      }}
      data-testid="privacy-card"
    >
      <Text fw={500} size="lg" mb="sm" c="white">Privacy</Text>
      
      <Box mb="md">
        <Text size="sm" fw={500} c="white" mb="xs">Visibility</Text>
        <Text size="xs" c="dimmed" mb="sm">
          Select Profile and Online status, then Apply → Confirm.
        </Text>

        <Chip.Group multiple value={selected} onChange={setSelected} data-testid="visibility-group">
          <Group gap="sm">
            {VISIBILITY_OPTIONS.map(opt => (
              <Chip 
                key={opt} 
                value={opt}
                styles={{
                  label: {
                    color: selected.includes(opt) ? '#fff' : '#ccc',
                    background: selected.includes(opt) ? '#1971c2' : '#2a2a2a',
                    borderColor: '#434343',
                  },
                }}
                data-testid={`visibility-${opt.toLowerCase().replace(' ', '-')}`}
              >
                {opt}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </Box>

      <Popover 
        opened={popoverOpen} 
        onChange={setPopoverOpen}
        position="top"
        withArrow
      >
        <Popover.Target>
          <Button onClick={() => setPopoverOpen(true)} data-testid="apply-button">
            Apply
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm" mb="sm">Apply visibility changes?</Text>
          <Flex gap="sm">
            <Button variant="outline" size="xs" onClick={() => setPopoverOpen(false)}>
              Cancel
            </Button>
            <Button size="xs" onClick={handleConfirm} data-testid="confirm-button">
              Confirm
            </Button>
          </Flex>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
