'use client';

/**
 * rating-antd-T09: Dark settings panel: set Value to 1.5 and save (AntD)
 * 
 * Scene details: theme=dark, spacing=comfortable, scale=default, placement=bottom_right.
 * Layout: settings_panel in dark theme, anchored near the bottom-right of the viewport.
 * The panel shows two editable Ant Design Rate controls:
 *   • "Overall" (count=5, allowHalf=false)
 *   • "Value for money" (count=5, allowHalf=true)
 * A compact footer bar at the bottom of the panel contains "Cancel" and "Save changes" buttons.
 * Initial state: Overall = 4, Value for money = 3.0.
 * Feedback dynamics: changing stars updates the preview immediately, but the state is only considered saved after clicking "Save changes".
 * Clutter: a non-target toggle ("Email me receipts") appears above the footer but does not affect success.
 * Success requires the saved rating value for "Value for money" to be 1.5.
 * 
 * Success: Target rating value equals 1.5 out of 5 on "Value for money" AND "Save changes" is clicked.
 */

import React, { useState } from 'react';
import { Card, Rate, Button, Switch, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [overallValue, setOverallValue] = useState<number>(4);
  const [valueForMoney, setValueForMoney] = useState<number>(3.0);
  const [emailReceipts, setEmailReceipts] = useState<boolean>(true);
  const [savedValue, setSavedValue] = useState<number | null>(null);

  const handleCancel = () => {
    // Reset to initial values
    setOverallValue(4);
    setValueForMoney(3.0);
  };

  const handleSave = () => {
    setSavedValue(valueForMoney);
    if (valueForMoney === 1.5) {
      onSuccess();
    }
  };

  return (
    <Card 
      title="Preferences" 
      style={{ width: 350 }}
      data-saved-value={savedValue}
    >
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Overall</Text>
        <Rate
          value={overallValue}
          onChange={setOverallValue}
          allowClear
          data-testid="rating-overall"
        />
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Value for money</Text>
        <Rate
          value={valueForMoney}
          onChange={setValueForMoney}
          allowHalf
          allowClear
          data-testid="rating-value-for-money"
        />
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Switch 
            checked={emailReceipts} 
            onChange={setEmailReceipts}
            data-testid="toggle-email-receipts"
          />
          <Text>Email me receipts</Text>
        </Space>
      </div>
      
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSave} data-testid="save-changes">
          Save changes
        </Button>
      </div>
    </Card>
  );
}
