'use client';

/**
 * radio_group-antd-T06: Notifications modal: set summary time to Evening and save
 *
 * The page shows an isolated card titled "Notifications". At the top-right of the card is a primary button labeled "Edit notification settings".
 * Clicking it opens an Ant Design Modal (modal_flow) centered on the screen.
 * Inside the modal is one Radio.Group labeled "Daily summary time" with three options:
 * - Morning (8 AM)
 * - Afternoon (1 PM)
 * - Evening (6 PM)
 * Initial state in the modal: Morning (8 AM) is selected.
 * The modal footer contains two buttons: "Cancel" and a primary "Save changes".
 * Selecting an option changes the selection immediately, but the main card's read-only summary ("Summary time: …") only updates after clicking "Save changes" (persisted state).
 *
 * Success: Persisted value for "Daily summary time" equals "evening_6" (label "Evening (6 PM)").
 *          Clicking "Save changes" is required.
 */

import React, { useState, useRef } from 'react';
import { Card, Radio, Typography, Button, Modal, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Morning (8 AM)', value: 'morning_8' },
  { label: 'Afternoon (1 PM)', value: 'afternoon_1' },
  { label: 'Evening (6 PM)', value: 'evening_6' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [persistedValue, setPersistedValue] = useState<string>('morning_8');
  const [tempValue, setTempValue] = useState<string>('morning_8');
  const hasSucceeded = useRef(false);

  const handleOpenModal = () => {
    setTempValue(persistedValue);
    setModalOpen(true);
  };

  const handleSave = () => {
    setPersistedValue(tempValue);
    setModalOpen(false);
    if (tempValue === 'evening_6' && !hasSucceeded.current) {
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
      <Card 
        title="Notifications" 
        style={{ width: 400 }}
        extra={
          <Button type="primary" onClick={handleOpenModal}>
            Edit notification settings
          </Button>
        }
      >
        <Text type="secondary">Summary time: {persistedLabel}</Text>
      </Card>

      <Modal
        title="Notification settings"
        open={modalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSave}>Save changes</Button>
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Daily summary time</Text>
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
      </Modal>
    </>
  );
}
