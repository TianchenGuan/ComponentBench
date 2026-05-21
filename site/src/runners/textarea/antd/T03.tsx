'use client';

/**
 * textarea-antd-T03: Clear the meeting memo
 *
 * A centered card titled "1:1 Prep" contains one Ant Design Input.TextArea labeled "Meeting memo".
 * - Light theme, comfortable spacing, default scale.
 * - The textarea is prefilled with three short lines of text:
 *   "Discuss roadmap"
 *   "Review hiring plan"
 *   "Next steps"
 * - The TextArea is configured with AntD's clear affordance (allowClear), but user may also clear manually.
 * - No other textareas are present.
 *
 * Success: Value equals "" (empty string after trim)
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;

const INITIAL_VALUE = `Discuss roadmap
Review hiring plan
Next steps`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(INITIAL_VALUE);

  useEffect(() => {
    if (value.trim() === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="1:1 Prep" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="meeting-memo" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Meeting memo
        </label>
        <TextArea
          id="meeting-memo"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          allowClear
          data-testid="textarea-meeting-memo"
          rows={4}
        />
      </div>
    </Card>
  );
}
