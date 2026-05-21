'use client';

/**
 * button-mantine-T03: Reset profile form (single reset button)
 * 
 * Form section titled "Profile" with inputs (Name, Title, Department Select).
 * Single "Reset form" button at the bottom.
 */

import React, { useState } from 'react';
import { Button, Card, Text, TextInput, Select, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [name, setName] = useState('John Doe');
  const [title, setTitle] = useState('Senior Developer');
  const [department, setDepartment] = useState<string | null>('engineering');
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = () => {
    setName('');
    setTitle('');
    setDepartment(null);
    setMessage('Form reset');
    onSuccess();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Profile
      </Text>
      <Stack gap="md">
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select
          label="Department"
          value={department}
          onChange={setDepartment}
          data={[
            { value: 'engineering', label: 'Engineering' },
            { value: 'design', label: 'Design' },
            { value: 'marketing', label: 'Marketing' },
          ]}
        />
        <Button onClick={handleReset} data-testid="mantine-btn-reset-form">
          Reset form
        </Button>
        {message && (
          <Text size="sm" c="green">{message}</Text>
        )}
      </Stack>
    </Card>
  );
}
