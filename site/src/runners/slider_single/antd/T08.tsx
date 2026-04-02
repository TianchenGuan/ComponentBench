'use client';

/**
 * slider_single-antd-T08: Set Secondary volume to 30 and Apply (modal)
 * 
 * Layout: modal_flow with a centered trigger card ("Audio mixer") on the page.
 * On the card, a button labeled "Edit volumes" opens an Ant Design Modal dialog (centered).
 * The modal contains TWO horizontal Ant Design Sliders stacked vertically:
 *   - "Primary volume" (range 0–100, step=1)
 *   - "Secondary volume" (range 0–100, step=1)
 * Spacing and sizing are the library defaults (comfortable spacing, default slider size), but the two sliders are visually similar.
 * Initial state when modal opens: Primary=40, Secondary=20 (values are not persistently shown; a tooltip appears only while dragging).
 * The modal footer has two buttons: "Apply" (primary) and "Cancel" (secondary). Changes are NOT committed until Apply is clicked.
 * After Apply, the modal closes and the card summary updates to show saved volumes.
 * 
 * Success: The 'Secondary volume' slider value equals 30. The user must click the modal footer button labeled 'Apply' to commit the change. The correct instance is required: only the 'Secondary volume' slider counts.
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Button, Modal, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [primaryVolume, setPrimaryVolume] = useState(40);
  const [secondaryVolume, setSecondaryVolume] = useState(20);
  const [appliedPrimary, setAppliedPrimary] = useState(40);
  const [appliedSecondary, setAppliedSecondary] = useState(20);

  useEffect(() => {
    if (appliedSecondary === 30) {
      onSuccess();
    }
  }, [appliedSecondary, onSuccess]);

  const handleOpen = () => {
    setPrimaryVolume(40);
    setSecondaryVolume(20);
    setModalOpen(true);
  };

  const handleApply = () => {
    setAppliedPrimary(primaryVolume);
    setAppliedSecondary(secondaryVolume);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setPrimaryVolume(appliedPrimary);
    setSecondaryVolume(appliedSecondary);
    setModalOpen(false);
  };

  return (
    <>
      <Card title="Audio mixer" style={{ width: 350 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Primary: {appliedPrimary} | Secondary: {appliedSecondary}
        </Text>
        <Button type="primary" onClick={handleOpen} data-testid="btn-edit-volumes">
          Edit volumes
        </Button>
      </Card>

      <Modal
        title="Edit volumes"
        open={modalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={handleApply} data-testid="btn-apply-volumes">
            Apply
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong style={{ display: 'block', marginBottom: 16 }}>Primary volume</Text>
            <Slider
              min={0}
              max={100}
              step={1}
              value={primaryVolume}
              onChange={setPrimaryVolume}
              data-testid="slider-volume-primary"
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 16 }}>Secondary volume</Text>
            <Slider
              min={0}
              max={100}
              step={1}
              value={secondaryVolume}
              onChange={setSecondaryVolume}
              data-testid="slider-volume-secondary"
            />
          </div>
        </Space>
      </Modal>
    </>
  );
}
