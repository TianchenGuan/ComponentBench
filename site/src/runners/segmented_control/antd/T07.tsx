'use client';

/**
 * segmented_control-antd-T07: Reporting cadence → Quarterly (confirm pop-up)
 *
 * Layout: isolated card titled "Reports".
 * The card contains one Ant Design Segmented control labeled "Reporting cadence" with options:
 * "Weekly", "Monthly", "Quarterly".
 *
 * Initial state: "Monthly" is selected.
 *
 * Feedback/confirmation behavior:
 * - When the user clicks a different segment, a small Popconfirm-style prompt appears anchored near the segmented control.
 * - Prompt text: "Apply this cadence?"
 * - Buttons: "Confirm" and "Cancel"
 * - The selection is considered committed only after clicking "Confirm".
 * - Clicking "Cancel" reverts the selection back to the previously committed value ("Monthly").
 *
 * No other interactables exist in the card.
 *
 * Success: The committed value of "Reporting cadence" is Quarterly.
 * The confirmation prompt has been accepted via the "Confirm" control.
 */

import React, { useState } from 'react';
import { Card, Typography, Popconfirm } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = ['Weekly', 'Monthly', 'Quarterly'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [committedValue, setCommittedValue] = useState<string>('Monthly');
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (value: string | number) => {
    const val = String(value);
    if (val !== committedValue) {
      setPendingValue(val);
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    if (pendingValue) {
      setCommittedValue(pendingValue);
      if (pendingValue === 'Quarterly') {
        onSuccess();
      }
    }
    setPendingValue(null);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setPendingValue(null);
    setShowConfirm(false);
  };

  const displayValue = pendingValue || committedValue;

  return (
    <Card title="Reports" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Reporting cadence</Text>
      <Popconfirm
        title="Apply this cadence?"
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Segmented
          data-testid="reporting-cadence"
          data-canonical-type="segmented_control"
          data-selected-value={displayValue}
          data-committed-value={committedValue}
          options={options}
          value={displayValue}
          onChange={handleChange}
        />
      </Popconfirm>
    </Card>
  );
}
