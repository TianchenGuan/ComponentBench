'use client';

/**
 * masked_input-antd-T07: Enter card expiry in modal
 * 
 * Modal flow: the main page shows a single button labeled "Edit billing".
 * Clicking it opens an Ant Design Modal dialog containing one masked Input labeled "Card expiry (MM/YY)".
 * The input uses a fixed MM/YY mask with placeholder "__/__" and rejects non-digits; the slash is inserted automatically.
 * The field starts empty. The modal also has a standard close (×) control, but there is no Save/Apply requirement for task completion.
 * 
 * Success: The "Card expiry (MM/YY)" masked input value equals "11/29".
 */

import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '11/29') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Edit billing
      </Button>
      
      <Modal
        title="Billing details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={360}
      >
        <div style={{ marginBottom: 8, paddingTop: 16 }}>
          <label htmlFor="card-expiry" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Card expiry (MM/YY)
          </label>
          <IMaskInput
            id="card-expiry"
            mask="00/00"
            definitions={{
              '0': /[0-9]/
            }}
            placeholder="__/__"
            value={value}
            onAccept={(val: string) => setValue(val)}
            data-testid="card-expiry"
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
      </Modal>
    </div>
  );
}
