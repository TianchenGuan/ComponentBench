'use client';

/**
 * button-antd-T04: Reset filters (form section button)
 * 
 * Form section labeled "Filters" with controls (text input, Select, Checkboxes).
 * Two buttons: "Reset filters" (default) and "Apply filters" (primary).
 * Task: Click "Reset filters" to clear the form.
 */

import React, { useState } from 'react';
import { Button, Card, Input, Select, Checkbox, Space, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [keyword, setKeyword] = useState('dashboard');
  const [status, setStatus] = useState('open');
  const [urgent, setUrgent] = useState(true);
  const [archived, setArchived] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = () => {
    setKeyword('');
    setStatus(undefined as any);
    setUrgent(false);
    setArchived(false);
    setMessage('Filters reset');
    onSuccess();
  };

  const handleApply = () => {
    setMessage('Filters applied');
  };

  return (
    <Card title="Filters" style={{ width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>
            Keyword
          </label>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword..."
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>
            Status
          </label>
          <Select
            value={status}
            onChange={setStatus}
            style={{ width: '100%' }}
            options={[
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Closed' },
              { value: 'pending', label: 'Pending' },
            ]}
          />
        </div>
        
        <div>
          <Checkbox checked={urgent} onChange={(e) => setUrgent(e.target.checked)}>
            Urgent only
          </Checkbox>
        </div>
        
        <div>
          <Checkbox checked={archived} onChange={(e) => setArchived(e.target.checked)}>
            Include archived
          </Checkbox>
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <Space>
          <Button onClick={handleReset} data-testid="antd-btn-reset-filters">
            Reset filters
          </Button>
          <Button type="primary" onClick={handleApply} data-testid="antd-btn-apply-filters">
            Apply filters
          </Button>
        </Space>
        
        {message && (
          <div style={{ color: '#52c41a', fontSize: 12 }}>{message}</div>
        )}
      </Space>
    </Card>
  );
}
