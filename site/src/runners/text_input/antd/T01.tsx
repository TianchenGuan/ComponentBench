'use client';

/**
 * text_input-antd-T01: Set display name
 * 
 * Scene uses an isolated profile card centered in the viewport. The card contains a single Ant Design Input
 * labeled "Display name" with a placeholder like "e.g., Ava Chen". There are no other text inputs on the page,
 * and no modal/popover is involved. Spacing is comfortable and the input is default size. Initial value is
 * empty (no text entered). A small non-interactive helper line below the input says "This name is shown on
 * your public profile."
 * 
 * Success: The AntD "Display name" input's current value equals "Ava Chen" (after trimming leading/trailing whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === 'Ava Chen') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Profile" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="display-name" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Display name
        </label>
        <Input
          id="display-name"
          placeholder="e.g., Ava Chen"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="display-name-input"
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          This name is shown on your public profile.
        </Text>
      </div>
    </Card>
  );
}
