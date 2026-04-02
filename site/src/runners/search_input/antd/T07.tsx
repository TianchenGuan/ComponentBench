'use client';

/**
 * search_input-antd-T07: Match a reference phrase in a form section search
 *
 * Form section layout titled "Accounts Receivable" with several non-required fields (clutter: low): a disabled date range, a status dropdown, and a note textarea.
 * The target component is an Ant Design Input.Search labeled "Invoice search" with an enterButton labeled "Search".
 * Guidance: above the input is a visually prominent rounded chip labeled "Reference" that displays the exact target phrase: "invoice overdue".
 * Initial state: the search input is empty.
 * Feedback: clicking Search shows an inline result summary text under the input: "Showing invoices for: invoice overdue".
 * Other fields do not affect success and can be ignored.
 *
 * Success: The Input.Search labeled "Invoice search" has submitted_query equal to "invoice overdue".
 */

import React, { useState, useRef } from 'react';
import { Card, Input, Typography, Select, DatePicker, Space, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Search, TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleSearch = (query: string) => {
    setSubmittedQuery(query);
    if (query === 'invoice overdue' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card title="Accounts Receivable" style={{ width: 450 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Reference chip */}
        <div>
          <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 16 }}>
            Reference: invoice overdue
          </Tag>
        </div>

        {/* Invoice search */}
        <div>
          <label htmlFor="search-invoice" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Invoice search
          </label>
          <Search
            id="search-invoice"
            placeholder="Search invoices…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onSearch={handleSearch}
            enterButton="Search"
            data-testid="search-invoice"
          />
          {submittedQuery && (
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Showing invoices for: {submittedQuery}
            </Text>
          )}
        </div>

        {/* Other fields (distractors) */}
        <div>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Date range
          </label>
          <RangePicker disabled style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Status
          </label>
          <Select
            style={{ width: '100%' }}
            placeholder="Select status"
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'paid', label: 'Paid' },
            ]}
          />
        </div>

        <div>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Notes
          </label>
          <TextArea rows={2} placeholder="Add notes…" />
        </div>
      </Space>
    </Card>
  );
}
