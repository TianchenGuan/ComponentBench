'use client';

/**
 * search_input-antd-T03: Clear a prefilled search input using the clear icon
 *
 * Baseline isolated card centered in the viewport titled "Filters".
 * One Ant Design Input.Search labeled "Product keyword" is shown with allowClear enabled, so a small ✕ clear icon appears when there is text.
 * Initial state: the input is prefilled with "red shoes".
 * Feedback: clearing the input removes the ✕ icon and the status text below changes from "Filtering by: red shoes" to "No keyword filter".
 * No other fields are present.
 *
 * Success: The Input.Search labeled "Product keyword" has an empty value (cleared).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Search } = Input;
const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('red shoes');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (value === '' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Filters" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="search-keyword" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Product keyword
        </label>
        <Search
          id="search-keyword"
          placeholder="Enter keyword…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          allowClear
          data-testid="search-keyword"
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          {value ? `Filtering by: ${value}` : 'No keyword filter'}
        </Text>
      </div>
    </Card>
  );
}
