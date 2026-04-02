'use client';

/**
 * select_with_search-antd-T10: Match the reference icon to a visibility level
 *
 * Layout: isolated_card anchored near the bottom-right of the viewport (placement bottom_right) titled "Document sharing".
 * Guidance: visual. A small "Reference" panel above the Select shows only an icon: 🔒 (no text label).
 * Component: one Ant Design Select labeled "Visibility" with showSearch enabled. Options are rendered with an icon + label:
 *  - 🌐 Public
 *  - 🏢 Internal
 *  - 🔒 Confidential ← target corresponds to the reference icon
 *  - 🕵️ Secret
 * Initial state: "Public" is selected.
 * The dropdown opens in a popover; typing in the search box filters by the option text labels.
 * No additional page controls affect success.
 *
 * Success: The selected value of the "Visibility" Select equals "Confidential" (the option with the 🔒 icon).
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Public', label: 'Public', icon: '🌐' },
  { value: 'Internal', label: 'Internal', icon: '🏢' },
  { value: 'Confidential', label: 'Confidential', icon: '🔒' },
  { value: 'Secret', label: 'Secret', icon: '🕵️' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('Public');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Confidential') {
      onSuccess();
    }
  };

  return (
    <Card title="Document sharing" style={{ width: 350 }}>
      {/* Reference panel */}
      <div style={{ 
        marginBottom: 16, 
        padding: 12, 
        background: '#f5f5f5', 
        borderRadius: 4,
        textAlign: 'center'
      }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>
          Reference
        </Text>
        <span style={{ fontSize: 32 }}>🔒</span>
      </div>

      <Text strong style={{ display: 'block', marginBottom: 8 }}>Visibility</Text>
      <Select
        data-testid="visibility-select"
        showSearch
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        filterOption={(input, option) =>
          (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={options.map(opt => ({
          value: opt.value,
          label: (
            <Space>
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </Space>
          ),
        }))}
      />
    </Card>
  );
}
