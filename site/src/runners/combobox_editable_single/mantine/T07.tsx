'use client';

/**
 * combobox_editable_single-mantine-T07: Set CC recipient to alex.kim@acme.com (two fields)
 *
 * A compact "Compose message" form section contains two Mantine Autocomplete inputs
 * with identical styling.
 * - Scene: form_section layout, center placement, light theme, COMPACT spacing, default scale.
 * - Instances: 2 Autocomplete fields:
 *   - "To" (distractor, prefilled with "hannah.lee@acme.com")
 *   - "CC" (target, empty)
 * - Suggestion dataset (~12) with confusable variants: alex.kim@acme.com, alex.kim2@acme.com, etc.
 * - Distractors: Subject text input and a large Message textarea.
 *
 * Success: The Autocomplete instance labeled "CC" has value exactly "alex.kim@acme.com".
 */

import React, { useState } from 'react';
import { Card, Text, Autocomplete, TextInput, Textarea, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const emails = [
  'alex.kim@acme.com',
  'alex.kim2@acme.com',
  'alex.king@acme.com',
  'alice.kim@acme.com',
  'ben.wong@acme.com',
  'dana.patel@acme.com',
  'emily.nguyen@acme.com',
  'george.kim@acme.com',
  'hannah.lee@acme.com',
  'priya.singh@acme.com',
  'carlos.diaz@acme.com',
  'fatima.hassan@acme.com',
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [toValue, setToValue] = useState('hannah.lee@acme.com');
  const [ccValue, setCcValue] = useState('');

  const handleCcChange = (newValue: string) => {
    setCcValue(newValue);
    if (newValue === 'alex.kim@acme.com') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Compose message</Text>
      
      <Stack gap="sm">
        <div>
          <Text fw={500} size="sm" mb={4}>To</Text>
          <Autocomplete
            data-testid="to-autocomplete"
            placeholder="Enter email"
            data={emails}
            value={toValue}
            onChange={setToValue}
            size="sm"
          />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>CC</Text>
          <Autocomplete
            data-testid="cc-autocomplete"
            placeholder="Enter email"
            data={emails}
            value={ccValue}
            onChange={handleCcChange}
            size="sm"
          />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>Subject</Text>
          <TextInput placeholder="Subject" size="sm" />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>Message</Text>
          <Textarea placeholder="Write your message..." rows={4} size="sm" />
        </div>
      </Stack>
    </Card>
  );
}
