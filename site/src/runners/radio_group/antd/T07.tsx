'use client';

/**
 * radio_group-antd-T07: Analytics settings: scroll to Report frequency and choose Weekly
 *
 * A settings_panel layout occupies a fixed card anchored near the bottom-right of the viewport. The panel itself is scrollable (internal scrollbar) and contains multiple sections (General, Notifications, Analytics).
 * Most sections contain distractor controls (toggles, a Select dropdown, and a couple of non-target checkboxes), none of which are required for success.
 * The target Ant Design Radio.Group labeled "Report frequency" appears inside the "Analytics" section near the bottom of the scrollable panel.
 * Options: Never, Weekly, Monthly. Initial state: Monthly.
 * When the selection changes, a small inline spinner appears for ~300ms and then a subtle "Saved" tag appears (auto-save feedback). No Apply button.
 *
 * Success: In the "Report frequency" Radio.Group, the selected value equals "weekly" (label "Weekly").
 */

import React, { useState } from 'react';
import { Card, Radio, Typography, Switch, Select, Checkbox, Tag, Spin, Space, Divider } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [reportFrequency, setReportFrequency] = useState<string>('monthly');
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setReportFrequency(value);
    setSaving(true);
    setShowSaved(false);
    
    setTimeout(() => {
      setSaving(false);
      setShowSaved(true);
      if (value === 'weekly') {
        onSuccess();
      }
      setTimeout(() => setShowSaved(false), 2000);
    }, 300);
  };

  return (
    <Card 
      title="Analytics settings" 
      style={{ width: 360, maxHeight: 400 }}
      styles={{ body: { padding: 0 } }}
    >
      <div 
        data-testid="settings-panel-scroll"
        style={{ 
          height: 340, 
          overflowY: 'auto', 
          padding: 16 
        }}
      >
        {/* General section */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 12 }}>General</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>Enable analytics</Text>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Anonymous data collection</Text>
            <Switch />
          </div>
        </div>

        <Divider />

        {/* Notifications section */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 12 }}>Notifications</Title>
          <div style={{ marginBottom: 12 }}>
            <Text style={{ display: 'block', marginBottom: 4 }}>Alert threshold</Text>
            <Select defaultValue="medium" style={{ width: '100%' }}>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </div>
          <Checkbox>Email alerts</Checkbox>
          <br />
          <Checkbox defaultChecked>Dashboard alerts</Checkbox>
        </div>

        <Divider />

        {/* Analytics section (target) */}
        <div>
          <Title level={5} style={{ marginBottom: 12 }}>Analytics</Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text strong>Report frequency</Text>
            {saving && <Spin size="small" />}
            {showSaved && <Tag color="green">Saved</Tag>}
          </div>
          <Radio.Group
            data-canonical-type="radio_group"
            data-selected-value={reportFrequency}
            value={reportFrequency}
            onChange={handleChange}
          >
            <Space direction="vertical">
              <Radio value="never">Never</Radio>
              <Radio value="weekly">Weekly</Radio>
              <Radio value="monthly">Monthly</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
    </Card>
  );
}
