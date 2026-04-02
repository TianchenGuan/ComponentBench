'use client';

/**
 * password_input-antd-T03: Clear a temporary password
 * 
 * A centered card titled "Temporary access" contains one Ant Design Input.Password labeled
 * "Temporary password". It starts pre-filled and shows a clear (×) icon when hovered/focused
 * (allowClear behavior). Clicking the clear icon removes the entire value.
 * The eye icon toggle is also present, but not required.
 * 
 * Success: The Input.Password labeled "Temporary password" has an empty string value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('TempPass@2026');

  useEffect(() => {
    if (value === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Temporary access" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="temp-password" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Temporary password
        </label>
        <Input.Password
          id="temp-password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          allowClear
          data-testid="temp-password-input"
        />
      </div>
    </Card>
  );
}
