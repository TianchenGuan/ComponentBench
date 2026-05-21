'use client';

/**
 * password_input-antd-T04: Set a password and click Save
 * 
 * A centered card titled "Set new password" contains one Ant Design Input.Password labeled
 * "New password" (initially empty) and a primary button labeled "Save password" directly beneath it.
 * When the button is clicked after a non-empty password is entered, a small success toast appears
 * reading "Saved".
 * No other fields influence saving; the page does not require any additional form inputs.
 * 
 * Success: The Input.Password labeled "New password" equals exactly "Cedar$42" AND the
 * "Save password" button has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, message } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);
  const successTriggeredRef = useRef(false);

  useEffect(() => {
    if (saved && value === 'Cedar$42' && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [saved, value, onSuccess]);

  const handleSave = () => {
    if (value.length > 0) {
      setSaved(true);
      message.success('Saved');
    }
  };

  return (
    <Card title="Set new password" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="new-password" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          New password
        </label>
        <Input.Password
          id="new-password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="new-password-input"
        />
      </div>
      <Button 
        type="primary" 
        onClick={handleSave}
        data-testid="save-password-btn"
      >
        Save password
      </Button>
    </Card>
  );
}
