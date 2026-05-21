'use client';

/**
 * autocomplete_freeform-mantine-T03: Clear all tags with the clear button
 *
 * setup_description:
 * A centered isolated card titled "Tags" contains a Mantine TagsInput component labeled "Tags".
 *
 * The TagsInput is configured with clearable=true, so a clear button appears in the right section when at least one tag is present. Initial state: one tag pill "React" is already selected.
 *
 * No other interactive elements are present. Feedback: when cleared, all pills disappear and the input becomes empty.
 *
 * Success: The TagsInput has zero selected tag values (empty list).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>(['React']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && values.length === 0) {
      successFired.current = true;
      onSuccess();
    }
  }, [values, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tags</Text>
      <Text fw={500} size="sm" mb={8}>Tags</Text>
      <TagsInput
        data-testid="tags"
        placeholder="Add tags"
        value={values}
        onChange={setValues}
        clearable
      />
    </Card>
  );
}
