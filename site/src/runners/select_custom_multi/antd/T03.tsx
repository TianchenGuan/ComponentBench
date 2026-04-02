'use client';

/**
 * select_custom_multi-antd-T03: Clear all categories
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered titled "Filters".
 * A single Ant Design multi-select (tags display) labeled "Categories" is shown.
 * Options in dropdown: Books, Clothing, Electronics, Home, Toys.
 * Initial state: Books, Electronics, and Toys are already selected (three tags visible).
 * The control has an "x" clear-all icon on the right (allowClear enabled). Clicking it removes all selected tags at once.
 * No other inputs are present.
 *
 * Success: The selected values are exactly: (empty) (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Books', value: 'Books' },
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Home', value: 'Home' },
  { label: 'Toys', value: 'Toys' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Books', 'Electronics', 'Toys']);

  useEffect(() => {
    if (selected.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Filters" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Categories</Text>
      <Select
        mode="multiple"
        data-testid="categories-select"
        style={{ width: '100%' }}
        placeholder="Select categories"
        value={selected}
        onChange={setSelected}
        options={options}
        allowClear
      />
    </Card>
  );
}
