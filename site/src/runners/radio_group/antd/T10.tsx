'use client';

/**
 * radio_group-antd-T10: Retention policy: select 90 days and confirm in Popconfirm
 *
 * An isolated card titled "Data retention" is centered in the viewport. It shows the current policy as a read-only line: "Retention policy: Keep forever".
 * A button labeled "Change retention policy" opens an Ant Design Modal.
 * Inside the modal is one Radio.Group labeled "Retention policy" with options:
 * - Keep forever
 * - Delete after 30 days
 * - Delete after 90 days
 * Initial state: Keep forever is selected.
 * At the bottom of the modal is an "Apply" button. Clicking "Apply" triggers an Ant Design Popconfirm anchored to the button with text like "Apply retention change?" and two actions: "Cancel" and "Confirm".
 * The main card's read-only line updates only after clicking "Confirm" (persisted state). Clicking "Cancel" leaves the policy unchanged.
 *
 * Success: Persisted retention policy value equals "delete_90" (label "Delete after 90 days").
 *          An explicit confirmation click is required: the Popconfirm action "Confirm" must be taken after Apply.
 */

import React, { useState, useRef } from 'react';
import { Card, Radio, Typography, Button, Modal, Popconfirm, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Keep forever', value: 'keep_forever' },
  { label: 'Delete after 30 days', value: 'delete_30' },
  { label: 'Delete after 90 days', value: 'delete_90' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [persistedValue, setPersistedValue] = useState<string>('keep_forever');
  const [tempValue, setTempValue] = useState<string>('keep_forever');
  const hasSucceeded = useRef(false);

  const handleOpenModal = () => {
    setTempValue(persistedValue);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setPersistedValue(tempValue);
    setModalOpen(false);
    if (tempValue === 'delete_90' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleCancel = () => {
    setTempValue(persistedValue);
    setModalOpen(false);
  };

  const persistedLabel = options.find(o => o.value === persistedValue)?.label || '';

  return (
    <>
      <Card title="Data retention" style={{ width: 400 }}>
        <Text type="secondary">Retention policy: {persistedLabel}</Text>
        <div style={{ marginTop: 16 }}>
          <Button onClick={handleOpenModal}>Change retention policy</Button>
        </div>
      </Card>

      <Modal
        title="Change retention policy"
        open={modalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ padding: '16px 0' }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Retention policy</Text>
          <Radio.Group
            data-canonical-type="radio_group"
            data-selected-value={tempValue}
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
          >
            <Space direction="vertical">
              {options.map(option => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Popconfirm
            title="Apply retention change?"
            onConfirm={handleConfirm}
            onCancel={() => {}}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button type="primary">Apply</Button>
          </Popconfirm>
        </div>
      </Modal>
    </>
  );
}
