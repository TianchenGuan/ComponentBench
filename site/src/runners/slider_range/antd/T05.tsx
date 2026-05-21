'use client';

/**
 * slider_range-antd-T05: Set Price range in a busy filter form
 * 
 * Layout: form_section centered on the page, titled "Search filters".
 * The section contains several distractor controls above the sliders (a Keyword text input and a Category dropdown).
 * Below, there are TWO Ant Design range Sliders (instances=2):
 * 1) "Price range ($)" with min=0, max=200, step=5, default/current shown as "Selected: $0 – $200".
 * 2) "Rating range (★)" with min=1, max=5, step=1, shown as "Selected: 1 – 5".
 * Both sliders update immediately when changed. Only the "Price range ($)" slider should be modified for this task.
 * 
 * Success: Target range is set to 40–120 USD on the Price range slider (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Input, Select, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (priceRange[0] === 40 && priceRange[1] === 120) {
      onSuccess();
    }
  }, [priceRange, onSuccess]);

  return (
    <Card title="Search filters" style={{ width: 450 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Keyword</Text>
          <Input
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Category</Text>
          <Select
            placeholder="Select category"
            value={category}
            onChange={setCategory}
            style={{ width: '100%' }}
            options={[
              { value: 'electronics', label: 'Electronics' },
              { value: 'clothing', label: 'Clothing' },
              { value: 'books', label: 'Books' },
              { value: 'home', label: 'Home & Garden' },
            ]}
          />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 16 }}>Price range ($)</Text>
          <Slider
            range
            min={0}
            max={200}
            step={5}
            value={priceRange}
            onChange={(val) => setPriceRange(val as [number, number])}
            data-testid="price-range"
          />
          <Text type="secondary">Selected: ${priceRange[0]} – ${priceRange[1]}</Text>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 16 }}>Rating range (★)</Text>
          <Slider
            range
            min={1}
            max={5}
            step={1}
            value={ratingRange}
            onChange={(val) => setRatingRange(val as [number, number])}
            data-testid="rating-range"
          />
          <Text type="secondary">Selected: {ratingRange[0]} – {ratingRange[1]}</Text>
        </div>
      </Space>
    </Card>
  );
}
