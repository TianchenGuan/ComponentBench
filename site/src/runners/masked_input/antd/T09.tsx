'use client';

/**
 * masked_input-antd-T09: Apply EIN using inline confirm
 * 
 * Isolated card centered in the viewport titled "Business tax details".
 * One masked Ant Design Input is labeled "Employer ID (EIN)" with the pattern "##-#######" and placeholder "__/_______".
 * Inside the input on the right are two small icon buttons:
 * - A checkmark button with aria-label "Apply" (commits the current value).
 * - A cross button with aria-label "Cancel" (reverts to the last applied value; initially empty).
 * The field starts empty and shows a small status text below it: "Not applied". After clicking Apply, the status changes to "Applied".
 * 
 * Success: The "Employer ID (EIN)" masked input value equals "58-3947201" AND committed by clicking Apply.
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [committedValue, setCommittedValue] = useState('');
  const [isCommitted, setIsCommitted] = useState(false);

  useEffect(() => {
    if (isCommitted && committedValue === '58-3947201') {
      onSuccess();
    }
  }, [isCommitted, committedValue, onSuccess]);

  const handleApply = () => {
    if (value.length === 10) {
      setCommittedValue(value);
      setIsCommitted(true);
    }
  };

  const handleCancel = () => {
    setValue(committedValue);
    setIsCommitted(committedValue !== '');
  };

  return (
    <Card title="Business tax details" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="ein-field" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Employer ID (EIN)
        </label>
        <div style={{ position: 'relative' }}>
          <IMaskInput
            id="ein-field"
            mask="00-0000000"
            definitions={{
              '0': /[0-9]/
            }}
            placeholder="__-_______"
            value={value}
            onAccept={(val: string) => setValue(val)}
            data-testid="ein-field"
            data-committed={isCommitted}
            style={{
              width: '100%',
              padding: '4px 70px 4px 11px',
              fontSize: 14,
              lineHeight: '1.5714285714285714',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              outline: 'none',
            }}
          />
          <div style={{ 
            position: 'absolute', 
            right: 8, 
            top: '50%', 
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: 4,
          }}>
            <button
              onClick={handleApply}
              aria-label="Apply"
              style={{
                width: 24,
                height: 24,
                border: '1px solid #52c41a',
                borderRadius: 4,
                background: '#f6ffed',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckOutlined style={{ color: '#52c41a', fontSize: 12 }} />
            </button>
            <button
              onClick={handleCancel}
              aria-label="Cancel"
              style={{
                width: 24,
                height: 24,
                border: '1px solid #ff4d4f',
                borderRadius: 4,
                background: '#fff2f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloseOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
            </button>
          </div>
        </div>
        <Text 
          type={isCommitted ? 'success' : 'secondary'} 
          style={{ fontSize: 12, marginTop: 4, display: 'block' }}
          data-testid="ein-status"
        >
          {isCommitted ? 'Applied' : 'Not applied'}
        </Text>
      </div>
    </Card>
  );
}
