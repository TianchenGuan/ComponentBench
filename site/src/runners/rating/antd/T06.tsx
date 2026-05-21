'use client';

/**
 * rating-antd-T06: Two ratings: update only Service to 4 stars (AntD)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * Two Ant Design Rate components are stacked vertically with clear labels:
 *   1) "Food" (top)
 *   2) "Service" (bottom)
 * Configuration: both have count=5, allowHalf=false, allowClear=true.
 * Initial state: Food = 5 (pre-filled), Service = 0 (empty).
 * Only the Service rating should be changed.
 * 
 * Success: Target rating value equals 4 out of 5 on "Service" AND "Food" remains at 5.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Rate, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [foodValue, setFoodValue] = useState<number>(5);
  const [serviceValue, setServiceValue] = useState<number>(0);
  const initialFoodValue = useRef(5);

  useEffect(() => {
    // Success requires Service = 4 AND Food unchanged from initial value (5)
    if (serviceValue === 4 && foodValue === initialFoodValue.current) {
      onSuccess();
    }
  }, [serviceValue, foodValue, onSuccess]);

  return (
    <Card title="Meal review" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Food</Text>
        <Rate
          value={foodValue}
          onChange={setFoodValue}
          allowClear
          data-testid="rating-food"
        />
      </div>
      
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Service</Text>
        <Rate
          value={serviceValue}
          onChange={setServiceValue}
          allowClear
          data-testid="rating-service"
        />
      </div>
    </Card>
  );
}
