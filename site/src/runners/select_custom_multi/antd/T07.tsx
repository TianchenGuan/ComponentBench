'use client';

/**
 * select_custom_multi-antd-T07: Scroll the dropdown to pick countries
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=bottom_right, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card anchored near the bottom-right of the viewport titled "Shipping regions".
 * One Ant Design multi-select (tags display) labeled "Allowed countries".
 * The dropdown contains a scrollable list of 20 country options in alphabetical order:
 * Argentina, Australia, Brazil, Canada, Chile, China, Denmark, Egypt, France, Germany, Greece, India, Indonesia, Japan, Kenya, Mexico, Netherlands, Norway, Spain, Sweden.
 * The dropdown height shows ~6 items at a time, so scrolling is needed to reach items near the bottom.
 * Initial state: empty.
 * No other UI elements are present.
 *
 * Success: The selected values are exactly: Canada, Japan, Norway (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const countries = [
  'Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'China', 
  'Denmark', 'Egypt', 'France', 'Germany', 'Greece', 'India', 
  'Indonesia', 'Japan', 'Kenya', 'Mexico', 'Netherlands', 'Norway', 
  'Spain', 'Sweden'
];

const options = countries.map(c => ({ label: c, value: c }));

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Canada', 'Japan', 'Norway']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Shipping regions" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Allowed countries</Text>
      <Select
        mode="multiple"
        data-testid="countries-select"
        style={{ width: '100%' }}
        placeholder="Select countries"
        value={selected}
        onChange={setSelected}
        options={options}
        listHeight={200}
      />
    </Card>
  );
}
