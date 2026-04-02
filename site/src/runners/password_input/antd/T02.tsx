'use client';

/**
 * password_input-antd-T02: Reveal an existing password
 * 
 * A centered card titled "API access" contains a single Ant Design Input.Password labeled
 * "API token password". The field is pre-filled with a value and is initially masked (dots/bullets).
 * An eye icon toggle is shown inside the input on the right. Toggling it switches the underlying
 * input between masked and visible text.
 * There are no other password fields and no Save/OK buttons.
 * 
 * Success: The Input.Password labeled "API token password" is in the revealed state (text is visible, not masked).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [visible, setVisible] = useState(false);
  const prefilledValue = 'SecretToken123!';

  useEffect(() => {
    if (visible) {
      onSuccess();
    }
  }, [visible, onSuccess]);

  return (
    <Card title="API access" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="api-token-password" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          API token password
        </label>
        <Input.Password
          id="api-token-password"
          value={prefilledValue}
          readOnly
          visibilityToggle={{
            visible,
            onVisibleChange: setVisible,
          }}
          data-testid="api-token-password-input"
        />
      </div>
    </Card>
  );
}
