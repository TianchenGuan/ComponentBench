'use client';

/**
 * combobox_editable_multi-antd-v2-T04
 *
 * Dense policy table with two editable rows: Rule A (Regions: US) and Rule B (Regions: US).
 * Each row has tags-mode Select and row-local Save. Suggestions: US, EU, APAC, LATAM, MEA.
 * Success: Rule B Regions = {US, EU, APAC}, Rule A remains {US}, Save for Rule B clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Table, Select, Button, Card, Typography, Tag, Space } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text } = Typography;

const regionOptions = [
  { value: 'US', label: 'US' },
  { value: 'EU', label: 'EU' },
  { value: 'APAC', label: 'APAC' },
  { value: 'LATAM', label: 'LATAM' },
  { value: 'MEA', label: 'MEA' },
];

const TARGET_SET = ['US', 'EU', 'APAC'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [ruleARegions, setRuleARegions] = useState<string[]>(['US']);
  const [ruleBRegions, setRuleBRegions] = useState<string[]>(['US']);
  const [ruleBSaved, setRuleBSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (ruleBSaved && setsEqual(ruleBRegions, TARGET_SET) && setsEqual(ruleARegions, ['US'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [ruleBSaved, ruleBRegions, ruleARegions, onSuccess]);

  const columns = [
    {
      title: 'Rule',
      dataIndex: 'rule',
      key: 'rule',
      width: 100,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
    },
    {
      title: 'Regions',
      dataIndex: 'regions',
      key: 'regions',
      render: (_: unknown, record: { key: string }) => {
        const isA = record.key === 'a';
        return (
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%', minWidth: 180 }}
            placeholder="Add regions"
            value={isA ? ruleARegions : ruleBRegions}
            onChange={(v) => {
              if (isA) setRuleARegions(v);
              else { setRuleBRegions(v); setRuleBSaved(false); }
            }}
            options={regionOptions}
          />
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: unknown, record: { key: string }) => (
        <Button
          size="small"
          type="link"
          data-testid={`save-rule-${record.key}`}
          onClick={() => {
            if (record.key === 'b') setRuleBSaved(true);
          }}
        >
          Save
        </Button>
      ),
    },
  ];

  const data = [
    { key: 'a', rule: 'Rule A', priority: 'High' },
    { key: 'b', rule: 'Rule B', priority: 'Medium' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '24px 48px' }}>
      <Card title="Policy table" style={{ width: 600 }} size="small">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
            <Tag color="green">Active</Tag>
            <Tag>2 rules</Tag>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            size="small"
            bordered
          />
        </Space>
      </Card>
    </div>
  );
}
