'use client';

/**
 * tree_grid-antd-v2-T03: Annual Budget grid – deep branch edit in the correct of two grids
 *
 * Two side-by-side grids: "Monthly Budget" and "Annual Budget". Both share same hierarchy.
 * Edit Operations → Data Centers → EU-West → Rack 7 Budget to $12,750 in Annual Budget.
 * Click "Save annual budget".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Typography, Button, InputNumber, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../../types';
import { formatCurrency, parseCurrency, pathEquals } from '../../types';

const { Text } = Typography;

interface BudgetNode {
  key: string;
  name: string;
  budget: number;
  children?: BudgetNode[];
}

function makeBudgetTree(): BudgetNode[] {
  return [{
    key: 'ops', name: 'Operations', budget: 500000,
    children: [{
      key: 'ops/dc', name: 'Data Centers', budget: 300000,
      children: [{
        key: 'ops/dc/eu-west', name: 'EU-West', budget: 100000,
        children: [
          { key: 'ops/dc/eu-west/rack-7', name: 'Rack 7', budget: 10000 },
          { key: 'ops/dc/eu-west/rack-8', name: 'Rack 8', budget: 10000 },
        ],
      }],
    }],
  }];
}

function getPath(rows: BudgetNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
}

function findNode(rows: BudgetNode[], key: string): BudgetNode | null {
  for (const r of rows) {
    if (r.key === key) return r;
    if (r.children) { const f = findNode(r.children, key); if (f) return f; }
  }
  return null;
}

function cloneAndUpdate(rows: BudgetNode[], key: string, budget: number): BudgetNode[] {
  return rows.map(r => {
    if (r.key === key) return { ...r, budget };
    if (r.children) return { ...r, children: cloneAndUpdate(r.children, key, budget) };
    return r;
  });
}

function BudgetGrid({ title, data, onDataChange, expandedKeys, onExpandedChange, footer }: {
  title: string;
  data: BudgetNode[];
  onDataChange: (d: BudgetNode[]) => void;
  expandedKeys: React.Key[];
  onExpandedChange: (k: React.Key[]) => void;
  footer: React.ReactNode;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number | null>(null);

  const commitEdit = useCallback(() => {
    if (editingKey && editValue !== null) {
      onDataChange(cloneAndUpdate(data, editingKey, editValue));
    }
    setEditingKey(null);
    setEditValue(null);
  }, [editingKey, editValue, data, onDataChange]);

  const cols: TableColumnsType<BudgetNode> = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
    {
      title: 'Budget', dataIndex: 'budget', key: 'budget', width: 130,
      render: (val: number, record: BudgetNode) => {
        if (editingKey === record.key) {
          return (
            <InputNumber
              autoFocus
              value={editValue}
              onChange={v => setEditValue(v)}
              onPressEnter={commitEdit}
              onBlur={commitEdit}
              formatter={v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={v => parseInt((v || '').replace(/\$\s?|(,*)/g, ''), 10) as 0}
              size="small"
              style={{ width: 120 }}
            />
          );
        }
        return (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => { setEditingKey(record.key); setEditValue(val); }}
          >
            {formatCurrency(val)}
          </span>
        );
      },
    },
  ];

  return (
    <Card size="small" title={title} style={{ flex: 1, minWidth: 340 }}>
      <Table<BudgetNode>
        columns={cols}
        dataSource={data}
        rowKey="key"
        pagination={false}
        size="small"
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            onExpandedChange(expanded
              ? [...expandedKeys, record.key]
              : expandedKeys.filter(k => k !== record.key));
          },
        }}
      />
      <div style={{ marginTop: 8 }}>{footer}</div>
    </Card>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [monthlyData, setMonthlyData] = useState(makeBudgetTree);
  const [annualData, setAnnualData] = useState(makeBudgetTree);
  const [monthlyExpanded, setMonthlyExpanded] = useState<React.Key[]>([]);
  const [annualExpanded, setAnnualExpanded] = useState<React.Key[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const node = findNode(annualData, 'ops/dc/eu-west/rack-7');
    if (node && node.budget === 12750) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, annualData, onSuccess]);

  return (
    <Space align="start" size="middle" style={{ width: '100%' }}>
      <BudgetGrid
        title="Monthly Budget"
        data={monthlyData}
        onDataChange={setMonthlyData}
        expandedKeys={monthlyExpanded}
        onExpandedChange={setMonthlyExpanded}
        footer={<Button size="small">Save monthly budget</Button>}
      />
      <BudgetGrid
        title="Annual Budget"
        data={annualData}
        onDataChange={setAnnualData}
        expandedKeys={annualExpanded}
        onExpandedChange={setAnnualExpanded}
        footer={<Button type="primary" size="small" onClick={() => setSaved(true)}>Save annual budget</Button>}
      />
    </Space>
  );
}
