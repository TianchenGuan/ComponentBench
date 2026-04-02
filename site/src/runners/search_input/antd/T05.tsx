'use client';

/**
 * search_input-antd-T05: Disambiguate dashboard search vs table search (Orders search)
 *
 * Isolated card centered in the viewport titled "Search panel".
 * There are TWO Ant Design Input.Search components stacked vertically with clear labels:
 *   1) "Header search" with placeholder "Search the site…"
 *   2) "Orders search" with placeholder "Search orders…"
 * Both are default size and show only the search icon (no enterButton). Initial state: both empty.
 * Low clutter: a non-required "Export" button and a passive help link appear below the inputs, but they do not affect success.
 * Feedback: submitting in "Orders search" updates a caption line under that field: "Orders filtered by: wireless".
 * The "Header search" caption (if used) is separate and should be ignored.
 *
 * Success: The Input.Search instance labeled "Orders search" has submitted_query equal to "wireless".
 */

import React, { useState, useRef } from 'react';
import { Card, Input, Typography, Button, Space } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Search } = Input;
const { Text, Link } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [headerValue, setHeaderValue] = useState('');
  const [ordersValue, setOrdersValue] = useState('');
  const [headerSubmitted, setHeaderSubmitted] = useState<string | null>(null);
  const [ordersSubmitted, setOrdersSubmitted] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleHeaderSearch = (query: string) => {
    setHeaderSubmitted(query);
  };

  const handleOrdersSearch = (query: string) => {
    setOrdersSubmitted(query);
    if (query === 'wireless' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card title="Search panel" style={{ width: 450 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <label htmlFor="search-header" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Header search
          </label>
          <Search
            id="search-header"
            placeholder="Search the site…"
            value={headerValue}
            onChange={(e) => setHeaderValue(e.target.value)}
            onSearch={handleHeaderSearch}
            data-testid="search-header"
          />
          {headerSubmitted && (
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Site filtered by: {headerSubmitted}
            </Text>
          )}
        </div>

        <div>
          <label htmlFor="search-orders" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Orders search
          </label>
          <Search
            id="search-orders"
            placeholder="Search orders…"
            value={ordersValue}
            onChange={(e) => setOrdersValue(e.target.value)}
            onSearch={handleOrdersSearch}
            data-testid="search-orders"
          />
          {ordersSubmitted && (
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Orders filtered by: {ordersSubmitted}
            </Text>
          )}
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Button icon={<ExportOutlined />}>Export</Button>
          <Link href="#" style={{ fontSize: 12 }}>Need help?</Link>
        </div>
      </Space>
    </Card>
  );
}
