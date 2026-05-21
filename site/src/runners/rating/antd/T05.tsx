'use client';

/**
 * rating-antd-T05: Half-star selection: set taste to 2.5 (AntD)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered with a "Restaurant feedback" header.
 * One Ant Design Rate component labeled "Taste".
 * Configuration: count=5, allowHalf=true (supports half-star selection), allowClear=true.
 * A small text readout under the stars shows "Current value: X.X" updating live when the rating is committed.
 * Initial state: Taste value = 0.0.
 * No extra confirmation is required.
 * 
 * Success: Target rating value equals 2.5 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Rate, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (value === 2.5) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Restaurant feedback" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Taste</Text>
        <Rate
          value={value}
          onChange={setValue}
          allowHalf
          allowClear
          data-testid="rating-taste"
        />
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
        Current value: {value.toFixed(1)}
      </Text>
    </Card>
  );
}
