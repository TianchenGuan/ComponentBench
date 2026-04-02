'use client';

/**
 * listbox_multi-antd-v2-T04: Available columns nested-scroll search list
 *
 * Settings rail with two searchable checkbox lists: Available columns (TARGET, 40+ items)
 * and Pinned columns. Search filters only the focused list. Internal scroll region.
 * Available columns initial: none. Pinned columns initial: Name, Status (must remain unchanged).
 * Target Available: Last seen, Plan, MRR. Confirm via "Apply columns". Dark theme.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Card, Checkbox, Input, Space, Typography, Divider, ConfigProvider, theme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const availableColumns = [
  'Account ID', 'Account name', 'ARR', 'Billing address', 'City',
  'Company size', 'Contract end', 'Contract start', 'Country', 'Created at',
  'Currency', 'Domain', 'Email', 'First name', 'Industry',
  'Last active', 'Last login', 'Last name', 'Last seen', 'Lead source',
  'Lifecycle stage', 'MRR', 'Notes', 'Owner', 'Phone',
  'Plan', 'Plan change', 'Region', 'Renewal date', 'Revenue',
  'Seats', 'Segment', 'Source', 'State', 'Status',
  'Subscription type', 'Tags', 'Tax ID', 'Team', 'Timezone',
  'Trial end', 'Updated at', 'Website', 'Zip code',
];

const pinnedColumns = ['Name', 'Status', 'Email', 'Created at', 'Last login'];

const targetAvailable = ['Last seen', 'Plan', 'MRR'];
const pinnedInitial = ['Name', 'Status'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [availableSelected, setAvailableSelected] = useState<string[]>([]);
  const [pinnedSelected, setPinnedSelected] = useState<string[]>(['Name', 'Status']);
  const [availableSearch, setAvailableSearch] = useState('');
  const [pinnedSearch, setPinnedSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const filteredAvailable = useMemo(
    () => availableColumns.filter(c => c.toLowerCase().includes(availableSearch.toLowerCase())),
    [availableSearch],
  );

  const filteredPinned = useMemo(
    () => pinnedColumns.filter(c => c.toLowerCase().includes(pinnedSearch.toLowerCase())),
    [pinnedSearch],
  );

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      setsEqual(availableSelected, targetAvailable) &&
      setsEqual(pinnedSelected, pinnedInitial)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, availableSelected, pinnedSelected, onSuccess]);

  const handleApply = () => setSaved(true);
  const resetSaved = () => setSaved(false);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ padding: 24, background: '#141414', minHeight: '100vh', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
        <Card style={{ width: 320 }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Column Settings</Title>

          <Text strong style={{ display: 'block', marginBottom: 8 }}>Available columns</Text>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search available columns…"
            value={availableSearch}
            onChange={e => setAvailableSearch(e.target.value)}
            allowClear
            style={{ marginBottom: 8 }}
          />
          <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #424242', borderRadius: 6, padding: 8 }}>
            <Checkbox.Group
              value={availableSelected}
              onChange={(vals) => { setAvailableSelected(vals as string[]); resetSaved(); }}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {filteredAvailable.map(opt => (
                  <Checkbox key={opt} value={opt}>{opt}</Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          <Text strong style={{ display: 'block', marginBottom: 8 }}>Pinned columns</Text>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search pinned columns…"
            value={pinnedSearch}
            onChange={e => setPinnedSearch(e.target.value)}
            allowClear
            style={{ marginBottom: 8 }}
          />
          <div style={{ maxHeight: 160, overflow: 'auto', border: '1px solid #424242', borderRadius: 6, padding: 8 }}>
            <Checkbox.Group
              value={pinnedSelected}
              onChange={(vals) => { setPinnedSelected(vals as string[]); resetSaved(); }}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {filteredPinned.map(opt => (
                  <Checkbox key={opt} value={opt}>{opt}</Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>

          <div style={{ marginTop: 16 }}>
            <Button type="primary" block onClick={handleApply}>Apply columns</Button>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}
