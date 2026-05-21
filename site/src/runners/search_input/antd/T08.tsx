'use client';

/**
 * search_input-antd-T08: Dark mode: submit query in the Secondary search field (3 instances)
 *
 * Isolated card centered in the viewport rendered in dark theme titled "Saved filters".
 * The card contains THREE Ant Design Input.Search components stacked vertically:
 *   • "Primary"
 *   • "Secondary"
 *   • "Archived"
 * All three have the same placeholder "Search saved filters…" and the same icon-only submit affordance.
 * Initial state: Primary is prefilled with "camera" (distractor), Secondary and Archived are empty.
 * Feedback: submitting in Secondary shows an inline line under that field: "Last searched: camera lens".
 * No other interactive elements are present (clutter: none).
 *
 * Success: Among the three Input.Search fields, the instance labeled "Secondary" has submitted_query "camera lens".
 */

import React, { useState, useRef } from 'react';
import { Card, Input, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Search } = Input;
const { Text } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState('camera');
  const [secondaryValue, setSecondaryValue] = useState('');
  const [archivedValue, setArchivedValue] = useState('');
  const [secondarySubmitted, setSecondarySubmitted] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleSecondarySearch = (query: string) => {
    setSecondarySubmitted(query);
    if (query === 'camera lens' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card 
      title="Saved filters" 
      style={{ width: 400, background: '#1f1f1f', borderColor: '#303030' }}
      headStyle={{ color: '#fff', borderColor: '#303030' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <label htmlFor="search-primary" style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: '#fff' }}>
            Primary
          </label>
          <Search
            id="search-primary"
            placeholder="Search saved filters…"
            value={primaryValue}
            onChange={(e) => setPrimaryValue(e.target.value)}
            onSearch={() => {}}
            data-testid="search-primary"
          />
        </div>

        <div>
          <label htmlFor="search-secondary" style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: '#fff' }}>
            Secondary
          </label>
          <Search
            id="search-secondary"
            placeholder="Search saved filters…"
            value={secondaryValue}
            onChange={(e) => setSecondaryValue(e.target.value)}
            onSearch={handleSecondarySearch}
            data-testid="search-secondary"
          />
          {secondarySubmitted && (
            <Text style={{ fontSize: 12, marginTop: 4, display: 'block', color: '#aaa' }}>
              Last searched: {secondarySubmitted}
            </Text>
          )}
        </div>

        <div>
          <label htmlFor="search-archived" style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: '#fff' }}>
            Archived
          </label>
          <Search
            id="search-archived"
            placeholder="Search saved filters…"
            value={archivedValue}
            onChange={(e) => setArchivedValue(e.target.value)}
            onSearch={() => {}}
            data-testid="search-archived"
          />
        </div>
      </Space>
    </Card>
  );
}
