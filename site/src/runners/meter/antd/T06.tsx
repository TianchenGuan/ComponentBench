'use client';

/**
 * meter-antd-T06: Set Quota Usage meter and Apply in modal
 *
 * Setup Description:
 * A modal_flow scene starts with a single button on an isolated card: "Edit quota".
 * - Layout: modal_flow; the meter is inside a modal dialog.
 * - Placement: center (modal overlays the page).
 * - Component: AntD Modal containing one AntD Progress meter (type='line').
 * - Spacing/scale: default size; comfortable spacing inside modal.
 * - Instances: 1 meter labeled "Quota Usage".
 * - Interaction:
 *   * Click "Edit quota" to open the modal.
 *   * Inside the modal, click on the meter bar to set the value.
 *   * The meter updates immediately but is considered "pending" until you click "Apply".
 * - Initial state: pending value starts at 50%; committed value (shown in small text under the bar) is also 50%.
 * - Feedback: after clicking Apply, the modal closes and a small toast "Quota updated" appears; 
 *   committed value updates to the chosen value.
 *
 * Success: The Quota Usage meter committed value is 85% (±2 percentage points). Apply has been clicked to commit.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography, Button, Modal, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(50);
  const [committedValue, setCommittedValue] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(committedValue - 85) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpenModal = () => {
    setPendingValue(committedValue);
    setIsModalOpen(true);
  };

  const handleApply = () => {
    setCommittedValue(pendingValue);
    setIsModalOpen(false);
    message.success('Quota updated');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setPendingValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <>
      <Card style={{ width: 350, textAlign: 'center' }}>
        <Button type="primary" onClick={handleOpenModal}>
          Edit quota
        </Button>
      </Card>

      <Modal
        title="Edit Quota"
        open={isModalOpen}
        onOk={handleApply}
        onCancel={handleCancel}
        okText="Apply"
        cancelText="Cancel"
        okButtonProps={{ 'data-testid': 'quota-apply' } as React.ComponentProps<typeof Button>}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Quota Usage</Text>
          <div
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            data-testid="meter-quota"
            data-meter-value={pendingValue}
            data-meter-committed={committedValue === pendingValue && isModalOpen ? 'false' : undefined}
            role="meter"
            aria-valuenow={pendingValue}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Quota Usage"
          >
            <Progress
              percent={pendingValue}
              showInfo
              status="normal"
            />
          </div>
          <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
            Committed: {committedValue}%
          </Text>
        </div>
      </Modal>
    </>
  );
}
