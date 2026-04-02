'use client';

/**
 * search_input-antd-T02: Search with the explicit Search button (enterButton)
 *
 * Baseline isolated card centered in the viewport titled "Catalog".
 * One Ant Design Input.Search is shown with label "Catalog search", placeholder "Search products…", and an enterButton labeled "Search".
 * Initial state: empty. A helper text under the input says "Click Search to apply".
 * Feedback: after clicking Search, a results chip row appears under the input showing "Filter: mountain bike".
 * No other interactive elements are present.
 *
 * Success: The Input.Search labeled "Catalog search" has submitted_query equal to "mountain bike".
 */

import React, { useState, useRef } from 'react';
import { Card, Input, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Search } = Input;
const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleSearch = (query: string) => {
    setSubmittedQuery(query);
    if (query === 'mountain bike' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card title="Catalog" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="search-catalog" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Catalog search
        </label>
        <Search
          id="search-catalog"
          placeholder="Search products…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={handleSearch}
          enterButton="Search"
          data-testid="search-catalog"
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          Click Search to apply
        </Text>
        {submittedQuery && (
          <div style={{ marginTop: 8 }}>
            <Tag color="blue">Filter: {submittedQuery}</Tag>
          </div>
        )}
      </div>
    </Card>
  );
}
