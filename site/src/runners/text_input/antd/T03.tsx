'use client';

/**
 * text_input-antd-T03: Enter contact email (top-right placement)
 * 
 * Scene is a small isolated card anchored near the top-right of the viewport (not centered). The card is
 * titled "Support contact". It contains one Ant Design Input labeled "Contact email", with a mail icon shown
 * inside the input as a prefix. Spacing is comfortable and the component scale is default. Initial value is
 * empty. No other text inputs or overlays are present.
 * 
 * Success: The "Contact email" input value equals "support@acme.co" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === 'support@acme.co') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Support contact" style={{ width: 350 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="contact-email" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Contact email
        </label>
        <Input
          id="contact-email"
          prefix={<MailOutlined />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="contact-email-input"
        />
      </div>
    </Card>
  );
}
