'use client';

/**
 * text_input-antd-T04: Enter filter keyword in a form section
 * 
 * Scene is a form_section layout centered in the viewport: a "Filters" panel with a few common controls.
 * The panel includes one Ant Design Input labeled "Keyword" and several non-text distractors (e.g., a Status
 * dropdown, a checkbox 'Include archived', and a Search button). The Keyword field is the only text_input
 * instance on the page (instances=1). Initial Keyword value is empty. No overlays are used; spacing is
 * comfortable and scale is default.
 * 
 * Success: The input labeled "Keyword" has value "refundable" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Checkbox, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (keyword.trim() === 'refundable') {
      onSuccess();
    }
  }, [keyword, onSuccess]);

  return (
    <Card title="Filters" style={{ width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <label htmlFor="keyword" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Keyword
          </label>
          <Input
            id="keyword"
            placeholder="Enter keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            data-testid="keyword-input"
          />
        </div>
        
        <div>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Status
          </label>
          <Select
            style={{ width: '100%' }}
            placeholder="Select status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'closed', label: 'Closed' },
            ]}
          />
        </div>
        
        <Checkbox>Include archived</Checkbox>
        
        <Button type="primary" icon={<SearchOutlined />}>
          Search
        </Button>
      </Space>
    </Card>
  );
}
