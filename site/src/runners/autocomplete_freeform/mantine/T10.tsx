'use client';

/**
 * autocomplete_freeform-mantine-T10: Set exact tags in the Primary labels field (two instances, maxTags)
 *
 * setup_description:
 * A centered isolated card titled "Repository labels" contains two Mantine TagsInput components in a vertical stack.
 *
 * Instance 1: "Primary labels" (maxTags=3) with initial tags: api.
 * Instance 2: "Secondary labels" (maxTags=3) with initial tags: docs.
 *
 * Both fields have suggestion lists that include api, ui, agent, docs, infra. They look very similar, so label-based disambiguation is required. Because maxTags=3, the Primary labels field cannot have more than three tags at any time.
 *
 * A small non-interactive hint text between the fields says "Primary labels are used for reporting". Feedback: tags appear as pills; extra additions are blocked once three tags are present.
 *
 * Success: The TagsInput labeled "Primary labels" contains exactly the tags {api, ui, agent} (order-insensitive; trim whitespace). Case-insensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TagsInput, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const labelSuggestions = ['api', 'ui', 'agent', 'docs', 'infra'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [primaryLabels, setPrimaryLabels] = useState<string[]>(['api']);
  const [secondaryLabels, setSecondaryLabels] = useState<string[]>(['docs']);
  const successFired = useRef(false);

  // Check for success: Primary labels = exactly {api, ui, agent} (case-insensitive)
  useEffect(() => {
    if (!successFired.current) {
      const normalizedValues = primaryLabels.map(v => v.trim().toLowerCase());
      const targetValues = ['api', 'ui', 'agent'];
      
      const isMatch = normalizedValues.length === targetValues.length &&
        normalizedValues.every(v => targetValues.includes(v)) &&
        targetValues.every(v => normalizedValues.includes(v));
      
      if (isMatch) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [primaryLabels, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Repository labels</Text>
      <Stack>
        <div>
          <Text fw={500} size="sm" mb={8}>Primary labels</Text>
          <TagsInput
            data-testid="primary-labels"
            placeholder="Add labels"
            data={labelSuggestions}
            value={primaryLabels}
            onChange={setPrimaryLabels}
            maxTags={3}
          />
        </div>
        
        <Text size="xs" c="dimmed">Primary labels are used for reporting</Text>
        
        <div>
          <Text fw={500} size="sm" mb={8}>Secondary labels</Text>
          <TagsInput
            data-testid="secondary-labels"
            placeholder="Add labels"
            data={labelSuggestions}
            value={secondaryLabels}
            onChange={setSecondaryLabels}
            maxTags={3}
          />
        </div>
      </Stack>
    </Card>
  );
}
