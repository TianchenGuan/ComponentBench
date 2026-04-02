'use client';

/**
 * password_input-antd-T07: Match the password shown in a reference badge (dark theme)
 * 
 * The page uses a dark theme and shows a centered card titled "Shared access". At the top of the
 * card, a highlighted badge labeled "Target password" displays the string "PLUM-LEAF-09".
 * Below the badge is one Ant Design Input.Password labeled "Shared secret" (initially empty)
 * with the standard eye icon visibility toggle. No Save button is present.
 * The badge is the only place where the target password is displayed unmasked.
 * 
 * Success: The Input.Password labeled "Shared secret" equals exactly the reference badge value "PLUM-LEAF-09".
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const REFERENCE_PASSWORD = 'PLUM-LEAF-09';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === REFERENCE_PASSWORD) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      title="Shared access" 
      style={{ width: 400, background: '#1f1f1f', borderColor: '#303030' }}
      headStyle={{ color: '#fff', borderColor: '#303030' }}
      bodyStyle={{ background: '#1f1f1f' }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>Target password</div>
        <Tag 
          color="blue" 
          style={{ fontSize: 14, padding: '4px 12px' }}
          data-testid="target-password-badge"
        >
          {REFERENCE_PASSWORD}
        </Tag>
      </div>
      
      <div>
        <label htmlFor="shared-secret" style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: '#fff' }}>
          Shared secret
        </label>
        <Input.Password
          id="shared-secret"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="shared-secret-input"
          style={{ background: '#141414', borderColor: '#434343' }}
        />
      </div>
    </Card>
  );
}
