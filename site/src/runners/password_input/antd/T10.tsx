'use client';

/**
 * password_input-antd-T10: Type, reveal to verify, then hide again (compact dark)
 * 
 * A dark-themed card uses compact spacing (reduced padding and tighter line height). It contains
 * a single Ant Design Input.Password labeled "Access password". The input starts empty and includes
 * a small eye icon toggle on the right.
 * A hint text below reads: "Reveal once to verify, then hide again." There are no other fields
 * and no Save button.
 * 
 * Success: The Input.Password labeled "Access password" equals exactly "NightOwl#5" AND the
 * final visibility state is masked (hidden) AND the visibility toggle was turned on at least once.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [wasRevealed, setWasRevealed] = useState(false);
  const successTriggeredRef = useRef(false);

  const handleVisibilityChange = (newVisible: boolean) => {
    if (newVisible) {
      setWasRevealed(true);
    }
    setVisible(newVisible);
  };

  useEffect(() => {
    // Success: correct value, was revealed at least once, now hidden
    if (
      value === 'NightOwl#5' &&
      wasRevealed &&
      !visible &&
      !successTriggeredRef.current
    ) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [value, visible, wasRevealed, onSuccess]);

  return (
    <Card 
      title="Access control" 
      style={{ width: 350, background: '#1f1f1f', borderColor: '#303030' }}
      headStyle={{ color: '#fff', borderColor: '#303030', padding: '8px 16px' }}
      bodyStyle={{ background: '#1f1f1f', padding: '12px 16px' }}
    >
      <div style={{ marginBottom: 4 }}>
        <label htmlFor="access-password" style={{ fontWeight: 500, marginBottom: 2, display: 'block', color: '#fff', fontSize: 13 }}>
          Access password
        </label>
        <Input.Password
          id="access-password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          visibilityToggle={{
            visible,
            onVisibleChange: handleVisibilityChange,
          }}
          data-testid="access-password-input"
          size="small"
          style={{ background: '#141414', borderColor: '#434343' }}
        />
        <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block', color: '#888' }}>
          Reveal once to verify, then hide again.
        </Text>
      </div>
    </Card>
  );
}
