'use client';

/**
 * segmented_control-antd-T10: Advanced modal: Rendering mode → GPU + Apply
 *
 * Layout: modal flow.
 * Initial page (centered card) shows a button labeled "Advanced rendering settings…".
 * Clicking it opens an Ant Design Modal titled "Rendering".
 *
 * Inside the modal are TWO Ant Design Segmented controls:
 * 1) "Rendering mode" options: "CPU", "GPU"
 *    Initial committed state: CPU
 * 2) "Quality" options: "Balanced", "High"
 *    Initial state: Balanced
 *
 * Modal footer buttons:
 * - "Cancel" (closes modal, discards pending changes)
 * - "Apply" (commits changes and closes modal)
 *
 * Clutter (low): the modal also contains a short warning text about higher GPU usage, but no other required interactables.
 *
 * Success: Within the modal's "Rendering mode" segmented control, the committed value is GPU.
 * The change is confirmed by clicking the "Apply" button.
 */

import React, { useState } from 'react';
import { Card, Button, Modal, Typography, Space, Alert } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const renderingModeOptions = ['CPU', 'GPU'];
const qualityOptions = ['Balanced', 'High'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [committedRenderingMode, setCommittedRenderingMode] = useState<string>('CPU');
  const [committedQuality, setCommittedQuality] = useState<string>('Balanced');
  
  // Pending values while modal is open
  const [pendingRenderingMode, setPendingRenderingMode] = useState<string>('CPU');
  const [pendingQuality, setPendingQuality] = useState<string>('Balanced');

  const openModal = () => {
    // Reset pending to committed values when opening
    setPendingRenderingMode(committedRenderingMode);
    setPendingQuality(committedQuality);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    // Discard pending changes
    setIsModalOpen(false);
  };

  const handleApply = () => {
    // Commit pending changes
    setCommittedRenderingMode(pendingRenderingMode);
    setCommittedQuality(pendingQuality);
    setIsModalOpen(false);
    
    if (pendingRenderingMode === 'GPU') {
      onSuccess();
    }
  };

  return (
    <>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Button type="primary" onClick={openModal}>
          Advanced rendering settings…
        </Button>
        <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
          Current: {committedRenderingMode} / {committedQuality}
        </Text>
      </Card>

      <Modal
        title="Rendering"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={handleApply}>
            Apply
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Rendering mode</Text>
            <Segmented
              data-testid="rendering-mode"
              data-canonical-type="segmented_control"
              data-selected-value={pendingRenderingMode}
              options={renderingModeOptions}
              value={pendingRenderingMode}
              onChange={(value) => setPendingRenderingMode(String(value))}
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Quality</Text>
            <Segmented
              data-testid="quality"
              data-canonical-type="segmented_control"
              data-selected-value={pendingQuality}
              options={qualityOptions}
              value={pendingQuality}
              onChange={(value) => setPendingQuality(String(value))}
            />
          </div>

          <Alert
            type="warning"
            message="GPU rendering may increase power consumption and system temperature."
            showIcon
          />
        </Space>
      </Modal>
    </>
  );
}
