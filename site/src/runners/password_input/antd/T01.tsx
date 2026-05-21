'use client';

/**
 * password_input-antd-T01: Set account password (single field)
 * 
 * A single centered card titled "Account security" contains one Ant Design Input.Password
 * labeled "Account password" with placeholder text "Enter a new password". The input starts
 * empty and shows the standard eye icon visibility toggle on the right.
 * No other inputs are required; there are no modals, drawers, or confirmation buttons in this task.
 * 
 * Success: The Input.Password labeled "Account password" equals exactly "Blueberry-2026!".
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === 'Blueberry-2026!') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Account security" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="account-password" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Account password
        </label>
        <Input.Password
          id="account-password"
          placeholder="Enter a new password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="account-password-input"
        />
      </div>
    </Card>
  );
}
