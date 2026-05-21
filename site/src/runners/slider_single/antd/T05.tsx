'use client';

/**
 * slider_single-antd-T05: Open Advanced popover and set Alert sensitivity to 3
 * 
 * Layout: settings panel anchored near the top-right of the viewport (not centered).
 * The panel header is "Notifications" and includes several non-required controls (a couple of toggles and a dropdown), plus an "Advanced…" link.
 * The target Ant Design Slider is NOT visible initially. Clicking "Advanced…" opens a Popover overlay attached to the link.
 * Inside the popover is one slider labeled "Alert sensitivity" with range 1–5, step=1, and marks labeled 1, 2, 3, 4, 5.
 * Initial state: Alert sensitivity is set to 2 when the popover opens.
 * Feedback: the value is shown as a small number badge next to the label inside the popover and updates immediately; closing the popover is optional and there is no Apply button.
 * 
 * Success: The 'Alert sensitivity' slider value equals 3.
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Popover, Button, Switch, Select, Space, Badge } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const marks: Record<number, string> = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
};

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(2);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    if (value === 3) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const popoverContent = (
    <div style={{ width: 250 }}>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text strong>Alert sensitivity</Text>
        <Badge count={value} style={{ backgroundColor: '#1677ff' }} />
      </Space>
      <Slider
        min={1}
        max={5}
        step={1}
        marks={marks}
        value={value}
        onChange={setValue}
        data-testid="slider-alert-sensitivity"
      />
    </div>
  );

  return (
    <Card title="Notifications" style={{ width: 350 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Email notifications</Text>
          <Switch checked={emailNotifications} onChange={setEmailNotifications} />
        </Space>

        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Push notifications</Text>
          <Switch checked={pushNotifications} onChange={setPushNotifications} />
        </Space>

        <div>
          <Text style={{ display: 'block', marginBottom: 8 }}>Notification frequency</Text>
          <Select
            value={frequency}
            onChange={setFrequency}
            style={{ width: '100%' }}
            options={[
              { value: 'realtime', label: 'Real-time' },
              { value: 'hourly', label: 'Hourly digest' },
              { value: 'daily', label: 'Daily digest' },
              { value: 'weekly', label: 'Weekly digest' },
            ]}
          />
        </div>

        <Popover
          content={popoverContent}
          title={null}
          trigger="click"
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          placement="bottomLeft"
        >
          <Button type="link" data-testid="link-advanced" style={{ padding: 0 }}>
            Advanced…
          </Button>
        </Popover>
      </Space>
    </Card>
  );
}
