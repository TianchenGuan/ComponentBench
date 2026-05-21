'use client';

/**
 * rating-antd-T02: Clear an existing rating back to zero (AntD)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered with a "Quick feedback" header.
 * One Ant Design Rate component labeled "Overall".
 * Configuration: count=5, allowHalf=false, allowClear=true (clicking the currently selected value clears to 0).
 * Initial state: pre-selected value = 3 (three filled stars). A small helper text below reads "Hint: Click again to clear".
 * No other interactive components affect success.
 * 
 * Success: Target rating value equals 0 out of 5 (cleared state).
 */

import React, { useState, useEffect } from 'react';
import { Card, Rate, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(3);

  useEffect(() => {
    if (value === 0) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Quick feedback" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Overall</Text>
        <Rate
          value={value}
          onChange={setValue}
          allowClear
          data-testid="rating-overall"
        />
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
        Hint: Click again to clear
      </Text>
    </Card>
  );
}
