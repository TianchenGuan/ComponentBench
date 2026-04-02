'use client';

/**
 * radio_group-antd-T04: Exports: restore default format using Reset
 *
 * A centered isolated card titled "Export settings" contains one Ant Design Radio.Group labeled "Export format".
 * Options are shown as a compact horizontal row of three radios with labels:
 * - CSV
 * - XLSX
 * - PDF
 * Initial state: "PDF" is selected.
 * Next to the group label is a small link-style button labeled "Reset to default". A helper text under the group reads "Default: CSV".
 * When "Reset to default" is clicked, the selection snaps to CSV and a non-blocking toast appears ("Reset to default").
 * No other radio groups are present and there is no separate Save button.
 *
 * Success: The "Export format" Radio.Group selected value equals "csv" (label "CSV").
 *          The "Reset to default" control was invoked at least once.
 */

import React, { useState, useRef } from 'react';
import { Card, Radio, Typography, Button, message } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'CSV', value: 'csv' },
  { label: 'XLSX', value: 'xlsx' },
  { label: 'PDF', value: 'pdf' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('pdf');
  const resetInvoked = useRef(false);

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setSelected(value);
    // Only trigger success if reset was invoked and value is csv
    if (resetInvoked.current && value === 'csv') {
      onSuccess();
    }
  };

  const handleReset = () => {
    resetInvoked.current = true;
    setSelected('csv');
    message.success('Reset to default');
    onSuccess();
  };

  return (
    <Card title="Export settings" style={{ width: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text strong>Export format</Text>
        <Button 
          type="link" 
          size="small" 
          onClick={handleReset}
          style={{ padding: 0 }}
        >
          Reset to default
        </Button>
      </div>
      <Radio.Group
        data-canonical-type="radio_group"
        data-selected-value={selected}
        data-last-action={resetInvoked.current ? 'reset' : undefined}
        value={selected}
        onChange={handleChange}
        optionType="default"
      >
        <Radio value="csv">CSV</Radio>
        <Radio value="xlsx">XLSX</Radio>
        <Radio value="pdf">PDF</Radio>
      </Radio.Group>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Default: CSV
      </div>
    </Card>
  );
}
