'use client';

/**
 * autocomplete_freeform-antd-T04: Add a single tag in tags mode (dark theme)
 *
 * setup_description:
 * The page uses a dark theme (dark background with light text). A single centered card titled "Issue Labels" contains an Ant Design Select configured with mode="tags".
 *
 * The Select is labeled "Labels" and shows an input area where new tags can be typed. The dropdown may show a few suggested tags (e.g., bug, feature, urgent), but the component accepts custom tags that are not in the list. Comma (,) is enabled as a token separator so typing "urgent," will submit the tag.
 *
 * Initial state: no tags are selected (empty). Distractors: none. Feedback: once added, the tag appears as a pill/chip inside the Select input.
 *
 * Success: The "Labels" tags Select contains exactly one selected tag: "urgent".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const suggestions = [
  { value: 'bug', label: 'bug' },
  { value: 'feature', label: 'feature' },
  { value: 'urgent', label: 'urgent' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>([]);
  const successFired = useRef(false);

  // Check for success: exactly one tag "urgent" (case-insensitive)
  useEffect(() => {
    if (!successFired.current) {
      const normalizedValues = values.map(v => v.trim().toLowerCase());
      if (normalizedValues.length === 1 && normalizedValues[0] === 'urgent') {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [values, onSuccess]);

  return (
    <Card title="Issue Labels" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Labels</Text>
      <Select
        data-testid="labels-tags"
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Add labels"
        value={values}
        onChange={(newValues) => setValues(newValues)}
        options={suggestions}
        tokenSeparators={[',']}
      />
    </Card>
  );
}
