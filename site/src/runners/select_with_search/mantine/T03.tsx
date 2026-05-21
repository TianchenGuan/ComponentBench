'use client';

/**
 * select_with_search-mantine-T03: Open the Team member dropdown
 *
 * Layout: isolated_card centered titled "Assignment".
 * Component: one Mantine Select labeled "Team member" with searchable enabled.
 * Options: Unassigned, Alex, Brianna, Chen, Dev.
 * Initial state: "Unassigned" is selected.
 * The dropdown list is closed initially. When opened, a popover-like dropdown appears with the searchable input and the list of people.
 * No other interactive elements are present; success is purely about opening the dropdown overlay while keeping the selection unchanged.
 *
 * Success: The dropdown overlay for the "Team member" Select is open (options visible).
 *          The selected value remains "Unassigned".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'Unassigned', label: 'Unassigned' },
  { value: 'Alex', label: 'Alex' },
  { value: 'Brianna', label: 'Brianna' },
  { value: 'Chen', label: 'Chen' },
  { value: 'Dev', label: 'Dev' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Unassigned');
  const [isOpen, setIsOpen] = useState(false);
  const hasTriggeredSuccess = useRef(false);

  useEffect(() => {
    // Trigger success when dropdown is opened and value is still Unassigned
    if (isOpen && value === 'Unassigned' && !hasTriggeredSuccess.current) {
      hasTriggeredSuccess.current = true;
      onSuccess();
    }
  }, [isOpen, value, onSuccess]);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Assignment</Text>
      <Select
        data-testid="team-member-select"
        label="Team member"
        searchable
        data={options}
        value={value}
        onChange={handleChange}
        onDropdownOpen={() => setIsOpen(true)}
        onDropdownClose={() => setIsOpen(false)}
      />
    </Card>
  );
}
