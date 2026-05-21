'use client';

/**
 * textarea-antd-T01: Support note: add a short sentence
 *
 * A single centered card titled "Ticket details" contains one Ant Design Input.TextArea labeled "Support note".
 * - Theme is light with comfortable spacing and default component scale.
 * - The textarea is inline (no modal), shows a placeholder "Add a short note…", and starts empty.
 * - No other interactive components are required; there are no distractor textareas on the page.
 * - A small helper text under the field shows "Visible to support staff only" (non-interactive).
 *
 * Success: Value equals "Please call after 5pm." (normalize_newlines=true, whitespace=trim)
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === 'Please call after 5pm.') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Ticket details" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="support-note" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Support note
        </label>
        <TextArea
          id="support-note"
          placeholder="Add a short note…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="textarea-support-note"
          rows={3}
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          Visible to support staff only
        </Text>
      </div>
    </Card>
  );
}
