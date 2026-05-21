'use client';

/**
 * slider_range-antd-T09: Set alert range in modal and click Apply
 * 
 * Layout: modal_flow. The page shows a single button "Advanced alerts".
 * Clicking it opens an Ant Design Modal titled "Advanced alerts" (overlay with dimmed backdrop).
 * Inside the modal there is one Ant Design range Slider labeled "CPU usage alert (%)":
 * - Slider configuration: min=0, max=100, step=1, range=true.
 * - Initial state: the modal shows "Pending: 30 - 70" (pending value).
 * Changing the slider updates ONLY the "Pending" readout until the user clicks "Apply".
 * The modal footer has two buttons: "Cancel" and primary "Apply". Apply commits the range and closes the modal.
 * Theme is dark within the modal.
 * 
 * Success: Target range is set to 55-85 % (both thumbs), require_confirm: true with Apply button.
 */

import React, { useState, useEffect } from 'react';
import { Button, Modal, Slider, Typography, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<[number, number]>([30, 70]);
  const [appliedValue, setAppliedValue] = useState<[number, number]>([40, 80]);

  useEffect(() => {
    if (appliedValue[0] === 55 && appliedValue[1] === 85) {
      onSuccess();
    }
  }, [appliedValue, onSuccess]);

  const handleApply = () => {
    setAppliedValue(pendingValue);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setPendingValue([30, 70]);
    setModalOpen(false);
  };

  const handleOpen = () => {
    setPendingValue([30, 70]);
    setModalOpen(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Applied: {appliedValue[0]} - {appliedValue[1]}</Text>
      </div>
      <Button type="primary" onClick={handleOpen}>
        Advanced alerts
      </Button>

      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Modal
          title="Advanced alerts"
          open={modalOpen}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="apply" type="primary" onClick={handleApply}>
              Apply
            </Button>,
          ]}
          styles={{
            content: { background: '#1f1f1f' },
            header: { background: '#1f1f1f', borderBottom: '1px solid #333' },
          }}
        >
          <div style={{ padding: '16px 0' }}>
            <Text strong style={{ display: 'block', marginBottom: 16, color: '#fff' }}>
              CPU usage alert (%)
            </Text>
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={pendingValue}
              onChange={(val) => setPendingValue(val as [number, number])}
              data-testid="cpu-alert-range"
            />
            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
              Pending: {pendingValue[0]} - {pendingValue[1]}
            </Text>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}
