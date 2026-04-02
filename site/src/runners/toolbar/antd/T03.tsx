'use client';

/**
 * toolbar-antd-T03: Set text alignment to Center
 *
 * A centered isolated card contains a toolbar labeled "Alignment". The toolbar contains 
 * one Ant Design Segmented control with three segments: "Left", "Center", and "Right". 
 * Only one option can be selected at a time.
 * A status line below the toolbar reads "Current alignment: …" and initially shows "Left".
 */

import React, { useState } from 'react';
import { Card, Segmented, Typography } from 'antd';
import { AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

type Alignment = 'left' | 'center' | 'right';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [alignment, setAlignment] = useState<Alignment>('left');

  const handleChange = (value: Alignment) => {
    setAlignment(value);
    if (value === 'center') {
      onSuccess();
    }
  };

  return (
    <Card title="Alignment" style={{ width: 400 }} data-testid="toolbar-alignment">
      <div style={{ marginBottom: 16 }}>
        <Segmented
          options={[
            { value: 'left', icon: <AlignLeftOutlined />, label: 'Left' },
            { value: 'center', icon: <AlignCenterOutlined />, label: 'Center' },
            { value: 'right', icon: <AlignRightOutlined />, label: 'Right' },
          ]}
          value={alignment}
          onChange={(value) => handleChange(value as Alignment)}
          data-testid="toolbar-alignment-segmented"
        />
      </div>
      <Text type="secondary">
        Current alignment: {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
      </Text>
    </Card>
  );
}
