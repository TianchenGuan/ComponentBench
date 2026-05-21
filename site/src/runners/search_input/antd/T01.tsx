'use client';

/**
 * search_input-antd-T01: Submit a simple query with Input.Search (Enter)
 *
 * Baseline isolated card centered in the viewport. The card title is "Site search".
 * It contains a single Ant Design Input.Search with the label "Site search" and placeholder "Search…".
 * The component uses the default size and spacing and shows the magnifying-glass search icon (no separate Search button).
 * Initial state: empty value; below the input a read-only status line reads "Last searched: —".
 * Feedback: when a search is submitted (Enter key or clicking the search icon), the status line updates to "Last searched: <query>" and a small inline spinner flashes for ~300ms.
 * No other inputs are present (clutter: none).
 *
 * Success: The single Input.Search labeled "Site search" has submitted_query equal to "sushi".
 */

import React, { useState, useRef } from 'react';
import { Card, Input, Typography, Spin } from 'antd';
import type { TaskComponentProps } from '../types';

const { Search } = Input;
const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [lastSearched, setLastSearched] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasSucceeded = useRef(false);

  const handleSearch = (query: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastSearched(query);
      if (query === 'sushi' && !hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }, 300);
  };

  return (
    <Card title="Site search" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="search-site" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Site search
        </label>
        <Search
          id="search-site"
          placeholder="Search…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={handleSearch}
          data-testid="search-site"
          enterButton={false}
        />
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading && <Spin size="small" />}
          <Text type="secondary" style={{ fontSize: 12 }}>
            Last searched: {lastSearched ?? '—'}
          </Text>
        </div>
      </div>
    </Card>
  );
}
