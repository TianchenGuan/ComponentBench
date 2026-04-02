'use client';

/**
 * select_with_search-mantine-T10: Match a reference avatar to select the reviewer
 *
 * Layout: isolated_card anchored near the bottom-left of the viewport (placement bottom_left) titled "Review settings".
 * Guidance: visual. A "Reference" box shows only a small avatar (circle with initials) and no name text. In this instance, the avatar corresponds to Alex Chen.
 * Component: one Mantine searchable Select labeled "Reviewer". Dropdown items render with avatar + full name:
 *  - Alex Chen ← target (avatar matches reference)
 *  - Brianna Lee
 *  - Carlos Diaz
 *  - Divya Patel
 * Initial state: "Brianna Lee" is selected.
 * Interaction: open dropdown, visually match the avatar in the option list to the reference avatar, then select the matching person. Search is available but not necessary for visual matching.
 *
 * Success: The selected value of the "Reviewer" Select equals "Alex Chen".
 */

import React, { useState, forwardRef } from 'react';
import { Card, Text, Select, Avatar, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface ReviewerOption {
  value: string;
  label: string;
  initials: string;
  color: string;
}

const reviewerOptions: ReviewerOption[] = [
  { value: 'Alex Chen', label: 'Alex Chen', initials: 'AC', color: 'blue' },
  { value: 'Brianna Lee', label: 'Brianna Lee', initials: 'BL', color: 'pink' },
  { value: 'Carlos Diaz', label: 'Carlos Diaz', initials: 'CD', color: 'green' },
  { value: 'Divya Patel', label: 'Divya Patel', initials: 'DP', color: 'orange' },
];

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  initials: string;
  color: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, initials, color, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group gap="sm">
        <Avatar size="sm" color={color}>{initials}</Avatar>
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);

SelectItem.displayName = 'SelectItem';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Brianna Lee');

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Alex Chen') {
      onSuccess();
    }
  };

  // Get the selected reviewer's info for display
  const selectedReviewer = reviewerOptions.find(r => r.value === value);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Review settings</Text>
      
      {/* Reference panel - shows Alex Chen's avatar */}
      <Box 
        mb="md" 
        p="md" 
        style={{ 
          background: 'var(--mantine-color-gray-1)', 
          borderRadius: 8,
          textAlign: 'center'
        }}
      >
        <Text size="xs" c="dimmed" mb="xs">Reference</Text>
        <Avatar size="lg" color="blue">AC</Avatar>
      </Box>

      <Select
        data-testid="reviewer-select"
        label="Reviewer"
        searchable
        data={reviewerOptions}
        value={value}
        onChange={handleChange}
        leftSection={
          selectedReviewer ? (
            <Avatar size="xs" color={selectedReviewer.color}>
              {selectedReviewer.initials}
            </Avatar>
          ) : null
        }
        renderOption={({ option }) => {
          const opt = option as unknown as ReviewerOption;
          return (
            <Group gap="sm">
              <Avatar size="sm" color={opt.color}>{opt.initials}</Avatar>
              <Text size="sm">{opt.label}</Text>
            </Group>
          );
        }}
      />
    </Card>
  );
}
