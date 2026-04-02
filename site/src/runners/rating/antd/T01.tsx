'use client';

/**
 * rating-antd-T01: Set product quality to 4 stars (AntD)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered in the viewport with a simple "Product review" header.
 * A single Ant Design Rate component is shown inline under the label "Product quality".
 * Configuration: count=5 stars, allowHalf=false (whole stars only), allowClear=true (default), tooltips enabled on hover.
 * Initial state: no stars selected (value = 0). No other Rate components are present.
 * No extra buttons are required; the rating commits immediately when clicked.
 * 
 * Success: Target rating value equals 4 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Rate, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const tooltips = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (value === 4) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Product review" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Product quality</Text>
        <Rate
          value={value}
          onChange={setValue}
          tooltips={tooltips}
          allowClear
          data-testid="rating-product-quality"
        />
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>Goal: 4 out of 5</Text>
    </Card>
  );
}
