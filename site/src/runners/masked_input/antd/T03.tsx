'use client';

/**
 * masked_input-antd-T03: Clear ZIP+4 field
 * 
 * Form section layout titled "Shipping address" (centered on the page).
 * The section contains several standard inputs (Name, Street, City) that are NOT masked and are already filled, plus one masked Ant Design Input labeled "ZIP+4".
 * The ZIP+4 field uses the mask "#####-####", is prefilled with "02139-1234", and shows AntD's allowClear (×) icon inside the input when hovered/focused.
 * Clearing the field should remove all characters (no underscores/dashes left behind). No submit button is required.
 * 
 * Success: The "ZIP+4" masked input value is empty (zero characters).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Input } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [zipValue, setZipValue] = useState('02139-1234');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (zipValue === '') {
      onSuccess();
    }
  }, [zipValue, onSuccess]);

  const handleClear = () => {
    setZipValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card title="Shipping address" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Name</label>
        <Input value="Jane Doe" disabled style={{ marginBottom: 8 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Street</label>
        <Input value="123 Main Street" disabled style={{ marginBottom: 8 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>City</label>
        <Input value="Cambridge" disabled style={{ marginBottom: 8 }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="zip-field" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          ZIP+4
        </label>
        <div style={{ position: 'relative' }}>
          <IMaskInput
            id="zip-field"
            inputRef={inputRef}
            mask="00000-0000"
            definitions={{
              '0': /[0-9]/
            }}
            placeholder="#####-####"
            value={zipValue}
            onAccept={(val: string) => setZipValue(val)}
            unmask={false}
            data-testid="zip-field"
            style={{
              width: '100%',
              padding: '4px 30px 4px 11px',
              fontSize: 14,
              lineHeight: '1.5714285714285714',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              outline: 'none',
            }}
          />
          {zipValue && (
            <CloseCircleFilled
              onClick={handleClear}
              aria-label="Clear ZIP+4"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#00000040',
                cursor: 'pointer',
                fontSize: 14,
              }}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
