'use client';

/**
 * autocomplete_freeform-mantine-T06: Match employee name from a reference card
 *
 * setup_description:
 * A centered isolated card titled "Employee of the month" contains a small reference panel and a Mantine Autocomplete.
 *
 * The reference panel (non-interactive) displays the target employee name "Olivia Chen" in large text. Below it, the Autocomplete labeled "Employee" offers suggestions of employee names and is configured with a custom renderOption that shows an avatar and an email under each name.
 *
 * Suggestions include similar names (Olivia Chen, Olivia Cheng, Oliver Chen, Emily Johnson). Values are not enforced; the user can type anything, but the intended action is to set the exact name shown in the reference.
 *
 * Initial state: Employee input is empty. Feedback: the selected/typed name appears in the input.
 *
 * Success: The Employee Autocomplete input's displayed value equals "Olivia Chen" (trim whitespace). Case-sensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Autocomplete, Box, Group, Avatar } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface EmployeeOption {
  value: string;
  email: string;
}

const employees: EmployeeOption[] = [
  { value: 'Olivia Chen', email: 'olivia.chen@company.com' },
  { value: 'Olivia Cheng', email: 'olivia.cheng@company.com' },
  { value: 'Oliver Chen', email: 'oliver.chen@company.com' },
  { value: 'Emily Johnson', email: 'emily.j@company.com' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = value.trim();
  const targetValue = 'Olivia Chen';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Employee of the month</Text>
      
      <Box mb="md" p="sm" style={{ background: '#f5f5f5', borderRadius: 8 }}>
        <Text size="xs" c="dimmed" mb={4}>Reference</Text>
        <Text data-testid="employee-reference" fw={700} size="xl">Olivia Chen</Text>
      </Box>
      
      <Text fw={500} size="sm" mb={8}>Employee</Text>
      <Autocomplete
        data-testid="employee"
        placeholder="Select employee"
        data={employees.map(e => e.value)}
        value={value}
        onChange={setValue}
        renderOption={({ option }) => {
          const emp = employees.find(e => e.value === option.value);
          return (
            <Group gap="sm">
              <Avatar size="sm" radius="xl">{option.value[0]}</Avatar>
              <div>
                <Text size="sm">{option.value}</Text>
                <Text size="xs" c="dimmed">{emp?.email}</Text>
              </div>
            </Group>
          );
        }}
      />
    </Card>
  );
}
