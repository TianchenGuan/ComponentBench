'use client';

/**
 * segmented_control-antd-T04: Primary view → Grid (2 segmented controls)
 *
 * Layout: form section in the center of the page titled "View settings".
 * The section contains two Ant Design Segmented controls stacked vertically:
 * 1) "Primary view" segmented control with options "List" and "Grid".
 *    Initial state: "List" is selected.
 * 2) "Secondary preview" segmented control with options "List" and "Grid".
 *    Initial state: "Grid" is selected.
 *
 * Clutter (low): above the segmented controls is a non-required text input labeled "Section title".
 * There is also a "Save" button at the bottom of the section, but it is informational only;
 * changing the segmented control updates immediately.
 *
 * Success: The segmented control labeled "Primary view" has selected value = Grid.
 * The correct instance must be modified (do not count changes to "Secondary preview").
 */

import React, { useState } from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const viewOptions = ['List', 'Grid'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryView, setPrimaryView] = useState<string>('List');
  const [secondaryPreview, setSecondaryPreview] = useState<string>('Grid');

  const handlePrimaryChange = (value: string | number) => {
    const val = String(value);
    setPrimaryView(val);
    if (val === 'Grid') {
      onSuccess();
    }
  };

  const handleSecondaryChange = (value: string | number) => {
    setSecondaryPreview(String(value));
    // No success for secondary
  };

  return (
    <Card title="View settings" style={{ width: 400 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Section title</Text>
          <Input placeholder="Enter section title..." />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary view</Text>
          <Segmented
            data-testid="segmented-primary-view"
            data-canonical-type="segmented_control"
            data-selected-value={primaryView}
            options={viewOptions}
            value={primaryView}
            onChange={handlePrimaryChange}
          />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Secondary preview</Text>
          <Segmented
            data-testid="segmented-secondary-preview"
            data-canonical-type="segmented_control"
            data-selected-value={secondaryPreview}
            options={viewOptions}
            value={secondaryPreview}
            onChange={handleSecondaryChange}
          />
        </div>

        <Button type="primary" style={{ marginTop: 8 }}>Save</Button>
      </Space>
    </Card>
  );
}
