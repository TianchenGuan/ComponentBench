'use client';

/**
 * search_input-mantine-T05: Visual reference: submit the issue token in Issue search
 *
 * Form section titled "Bug triage".
 * Guidance is visual: at the top of the section there is a "Reference" card that shows the target token in large monospace text (no redundant plaintext copy elsewhere). The token displayed is "#bug-431".
 * Below the card is one Mantine TextInput labeled "Issue search" with a left search icon and helper text "Press Enter to search".
 * Initial state: empty.
 * Feedback: pressing Enter updates an inline line "Last searched: #bug-431".
 * Other visible elements (low clutter) include a disabled priority dropdown and a read-only note, but they do not affect success.
 *
 * Success: The "Issue search" input has submitted_query equal to "#bug-431" (submitted via Enter).
 */

import React, { useState, useRef } from 'react';
import { Card, TextInput, Text, Select, Textarea, Stack, Paper } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSubmittedQuery(value);
      if (value === '#bug-431' && !hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Bug triage</Text>
      
      <Stack gap="md">
        {/* Reference card with visual token */}
        <Paper withBorder p="md" radius="sm" bg="gray.1">
          <Text size="sm" c="dimmed" mb="xs">Reference</Text>
          <Text size="xl" fw={700} ff="monospace" style={{ letterSpacing: 1 }}>
            #bug-431
          </Text>
        </Paper>

        {/* Issue search */}
        <TextInput
          label="Issue search"
          placeholder="Search issues…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          leftSection={<IconSearch size={16} />}
          description="Press Enter to search"
          data-testid="search-issue"
        />
        {submittedQuery && (
          <Text size="sm" c="dimmed">
            Last searched: {submittedQuery}
          </Text>
        )}

        {/* Distractors */}
        <Select
          label="Priority"
          placeholder="Select priority"
          data={['High', 'Medium', 'Low']}
          disabled
        />

        <Textarea
          label="Notes"
          placeholder="Read-only notes…"
          readOnly
          value="This is a read-only note field."
        />
      </Stack>
    </Card>
  );
}
