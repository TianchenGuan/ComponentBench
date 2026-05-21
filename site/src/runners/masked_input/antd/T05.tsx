'use client';

/**
 * masked_input-antd-T05: Fill backup phone (two fields)
 * 
 * Isolated card positioned in the top-right area of the viewport titled "Contact numbers".
 * Two masked Ant Design Inputs are shown, both using the same US phone mask "(###) ###-####":
 * - "Primary phone" is prefilled with "(212) 555-0147".
 * - "Backup phone" starts empty.
 * The two fields look similar and are vertically stacked with normal spacing; there is no submit button. The task targets the "Backup phone" instance.
 * 
 * Success: The "Backup phone" masked input value equals "(646) 555-0110".
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryPhone] = useState('(212) 555-0147');
  const [backupPhone, setBackupPhone] = useState('');

  useEffect(() => {
    if (backupPhone === '(646) 555-0110') {
      onSuccess();
    }
  }, [backupPhone, onSuccess]);

  return (
    <Card title="Contact numbers" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="phone-primary" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Primary phone
        </label>
        <IMaskInput
          id="phone-primary"
          mask="(000) 000-0000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="(###) ###-####"
          value={primaryPhone}
          readOnly
          data-testid="phone-primary"
          style={{
            width: '100%',
            padding: '4px 11px',
            fontSize: 14,
            lineHeight: '1.5714285714285714',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            outline: 'none',
            backgroundColor: '#f5f5f5',
          }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="phone-backup" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Backup phone
        </label>
        <IMaskInput
          id="phone-backup"
          mask="(000) 000-0000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="(###) ###-####"
          value={backupPhone}
          onAccept={(val: string) => setBackupPhone(val)}
          data-testid="phone-backup"
          style={{
            width: '100%',
            padding: '4px 11px',
            fontSize: 14,
            lineHeight: '1.5714285714285714',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            outline: 'none',
          }}
        />
      </div>
    </Card>
  );
}
