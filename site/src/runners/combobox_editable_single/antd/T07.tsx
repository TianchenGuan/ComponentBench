'use client';

/**
 * combobox_editable_single-antd-T07: Match the Environment field to the reference badge
 *
 * A settings panel is displayed in dark theme with a left sidebar and main content area.
 * The main panel contains one editable combobox labeled "Environment" implemented with Ant Design AutoComplete.
 * - Scene: settings_panel layout, center placement, dark theme, comfortable spacing, default scale.
 * - Guidance: A "Reference" badge shows the target environment. Agent must match it.
 * - Options: Development, Staging, Production, Sandbox.
 * - Initial state: Environment input is empty.
 * - Distractors: toggles ("Enable logs", "Verbose output") and a "Save" button (disabled).
 *
 * Success: The "Environment" combobox value matches the text shown in the Reference badge.
 */

import React, { useState, useMemo } from 'react';
import { Card, AutoComplete, Typography, Switch, Button, Badge, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

const environments = [
  { value: 'Development' },
  { value: 'Staging' },
  { value: 'Production' },
  { value: 'Sandbox' },
];

// Deterministic reference value based on task
const referenceEnvironment = 'Production';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    if (selectedValue === referenceEnvironment) {
      onSuccess();
    }
  };

  const handleBlur = () => {
    if (value === referenceEnvironment) {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', background: '#1f1f1f', borderRadius: 8, overflow: 'hidden', minWidth: 600 }}>
      {/* Sidebar */}
      <div style={{ width: 180, background: '#141414', padding: 16 }}>
        <Text style={{ color: '#888', fontSize: 12, textTransform: 'uppercase' }}>Navigation</Text>
        <div style={{ marginTop: 16 }}>
          <div style={{ color: '#fff', padding: '8px 0', cursor: 'default' }}>General</div>
          <div style={{ color: '#1890ff', padding: '8px 0', cursor: 'default' }}>Environment</div>
          <div style={{ color: '#fff', padding: '8px 0', cursor: 'default' }}>Security</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: 24 }}>
        <Title level={4} style={{ color: '#fff', marginBottom: 24 }}>Environment settings</Title>
        
        <div style={{ marginBottom: 16 }}>
          <Text style={{ color: '#888', marginRight: 8 }}>Reference:</Text>
          <Badge 
            id="env-reference"
            count={referenceEnvironment} 
            style={{ backgroundColor: '#52c41a' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>Environment</Text>
          <AutoComplete
            data-testid="environment-autocomplete"
            style={{ width: 300 }}
            options={environments}
            placeholder="Select environment"
            value={value}
            onChange={setValue}
            onSelect={handleSelect}
            onBlur={handleBlur}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </div>

        <Space direction="vertical" size="middle" style={{ marginBottom: 24 }}>
          <div>
            <Switch disabled /> <Text style={{ color: '#666', marginLeft: 8 }}>Enable logs</Text>
          </div>
          <div>
            <Switch disabled /> <Text style={{ color: '#666', marginLeft: 8 }}>Verbose output</Text>
          </div>
        </Space>

        <div>
          <Button type="primary" disabled>Save</Button>
        </div>
      </div>
    </div>
  );
}
