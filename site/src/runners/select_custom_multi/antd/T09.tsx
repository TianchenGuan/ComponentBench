'use client';

/**
 * select_custom_multi-antd-T09: Edit Allowed teams in a modal and Save
 *
 * Scene context: theme=light, spacing=comfortable, layout=modal_flow, placement=center, scale=default, instances=1, guidance=text, clutter=low.
 * Layout: modal flow. On the base page (centered), there is a single button labeled "Edit policy".
 * Clicking "Edit policy" opens a modal dialog titled "Team policy".
 * Inside the modal is one Ant Design multi-select (tags display) labeled "Allowed teams" (TARGET component).
 * Dropdown options (12): Core, Payments, Search, Risk, Data, Infra, Growth, Support, Security, Legal, Marketing, Legacy.
 * Initial state in the modal: Allowed teams has Core and Legacy selected.
 * The modal footer has "Cancel" and a primary "Save" button.
 * Behavior: selecting/deselecting options updates the visible tags immediately, but the policy is only committed after clicking Save.
 * After clicking Save, a small toast "Policy saved" appears for ~2 seconds.
 *
 * Success: The selected values are exactly: Core, Payments, Search (order does not matter). Changes must be committed by clicking 'Save'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Typography, Button, Modal, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const teamOptions = [
  { label: 'Core', value: 'Core' },
  { label: 'Payments', value: 'Payments' },
  { label: 'Search', value: 'Search' },
  { label: 'Risk', value: 'Risk' },
  { label: 'Data', value: 'Data' },
  { label: 'Infra', value: 'Infra' },
  { label: 'Growth', value: 'Growth' },
  { label: 'Support', value: 'Support' },
  { label: 'Security', value: 'Security' },
  { label: 'Legal', value: 'Legal' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Legacy', value: 'Legacy' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Core', 'Legacy']);
  const [savedSelection, setSavedSelection] = useState<string[]>(['Core', 'Legacy']);
  const successTriggered = useRef(false);

  const handleSave = () => {
    setSavedSelection([...selected]);
    message.success('Policy saved');
    setIsModalOpen(false);

    // Check success after save
    const targetSet = new Set(['Core', 'Payments', 'Search']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!successTriggered.current) {
        successTriggered.current = true;
        onSuccess();
      }
    }
  };

  const handleCancel = () => {
    setSelected([...savedSelection]); // Reset to saved state
    setIsModalOpen(false);
  };

  const handleOpen = () => {
    setSelected([...savedSelection]); // Ensure we start with saved state
    setIsModalOpen(true);
  };

  return (
    <Card style={{ width: 400, textAlign: 'center' }}>
      <Button type="primary" onClick={handleOpen}>
        Edit policy
      </Button>

      <Modal
        title="Team policy"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Allowed teams</Text>
        <Select
          mode="multiple"
          data-testid="allowed-teams-select"
          style={{ width: '100%' }}
          placeholder="Select teams"
          value={selected}
          onChange={setSelected}
          options={teamOptions}
        />
      </Modal>
    </Card>
  );
}
