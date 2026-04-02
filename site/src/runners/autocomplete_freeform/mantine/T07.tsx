'use client';

/**
 * autocomplete_freeform-mantine-T07: Enter multiple tags using split characters (compact, small)
 *
 * setup_description:
 * A centered card titled "Color tags" contains one Mantine TagsInput labeled "Color tags". The UI is rendered in compact spacing and small size.
 *
 * The TagsInput is configured with splitChars set to [',', ' ', '|'] so typing a separator splits entries into separate tags. It is also configured with acceptValueOnBlur=false, meaning that simply blurring the field does not commit the current text; tags are committed by pressing Enter or by selecting a suggestion.
 *
 * Initial state: no tags selected. A helper text under the label says "Use comma, space, or | to separate tags". Suggestions include the same three colors plus a few distractors (red, green, blue, black, gray).
 *
 * Feedback: committed tags appear as pills. Because of small size, pills and the input caret are tighter than default.
 *
 * Success: The Color tags TagsInput contains exactly the tags {red, green, blue} (order-insensitive; trimmed). Case-insensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const colorSuggestions = ['red', 'green', 'blue', 'black', 'gray'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>([]);
  const successFired = useRef(false);

  // Check for success: exactly {red, green, blue} (case-insensitive)
  useEffect(() => {
    if (!successFired.current) {
      const normalizedValues = values.map(v => v.trim().toLowerCase());
      const targetValues = ['red', 'green', 'blue'];
      
      const isMatch = normalizedValues.length === targetValues.length &&
        normalizedValues.every(v => targetValues.includes(v)) &&
        targetValues.every(v => normalizedValues.includes(v));
      
      if (isMatch) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [values, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="md" mb="sm">Color tags</Text>
      <Text fw={500} size="xs" mb={4}>Color tags</Text>
      <TagsInput
        data-testid="color-tags"
        placeholder="Enter colors"
        data={colorSuggestions}
        value={values}
        onChange={setValues}
        splitChars={[',', ' ', '|']}
        acceptValueOnBlur={false}
        size="sm"
      />
      <Text size="xs" c="dimmed" mt={4}>Use comma, space, or | to separate tags</Text>
    </Card>
  );
}
