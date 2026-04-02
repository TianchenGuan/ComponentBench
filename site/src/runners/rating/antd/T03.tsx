'use client';

/**
 * rating-antd-T03: Match a reference star pattern (AntD)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * At the top of the card, a non-interactive reference row shows: "Example: ★★★☆☆" (3 out of 5).
 * Below it, one Ant Design Rate component labeled "Your rating".
 * Configuration: count=5, allowHalf=false, allowClear=true, tooltips enabled.
 * Initial state: Your rating value = 0 (empty).
 * No confirm button; success is based only on the committed value of "Your rating".
 * 
 * Success: Target rating value equals 3 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Rate, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const tooltips = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (value === 3) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Match the example" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Example: </Text>
        <Text style={{ fontSize: 18, letterSpacing: 2 }}>★★★☆☆</Text>
      </div>
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Your rating</Text>
        <Rate
          value={value}
          onChange={setValue}
          tooltips={tooltips}
          allowClear
          data-testid="rating-your-rating"
        />
      </div>
    </Card>
  );
}
