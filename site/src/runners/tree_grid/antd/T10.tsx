'use client';

/**
 * tree_grid-antd-T10: Edit Annual Budget cell with currency formatting
 *
 * Layout: settings_panel with two side-by-side cards.
 * Instances: 2 tree grids visible—left "Monthly Budget", right "Annual Budget".
 * Component: Ant Design tree table; the "Budget" column cells are inline-editable.
 * Initial state: Monthly Budget has some cells disabled. Annual Budget is editable.
 * All groups are collapsed. EU-West branch is not expanded.
 * Formatting rule: Budget must include a dollar sign and comma separators (example: $1,200).
 * Interaction: expand Operations → Data Centers → EU-West; click Rack 7 Budget cell to edit;
 * type the formatted value; commit by pressing Enter or clicking outside.
 * Feedback: on successful commit, the cell displays the formatted currency string.
 *
 * Success: In "Annual Budget" tree grid, Budget cell for Operations → Data Centers → EU-West → Rack 7
 * equals $12,500 (canonical numeric value 12500).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography, Input, Space, Form } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../types';
import { formatCurrency, parseCurrency } from '../types';

const { Text, Paragraph } = Typography;

interface BudgetRow {
  key: string;
  name: string;
  budget: number;
  children?: BudgetRow[];
}

// Generate budget data with EU-West racks
function generateBudgetData(): BudgetRow[] {
  const euWestRacks: BudgetRow[] = [];
  for (let i = 1; i <= 15; i++) {
    euWestRacks.push({
      key: `operations/data-centers/eu-west/rack-${i}`,
      name: `Rack ${i}`,
      budget: 8000 + i * 500,
    });
  }

  return [
    {
      key: 'platform',
      name: 'Platform',
      budget: 50000,
      children: [
        { key: 'platform/api-gateway', name: 'API Gateway', budget: 15000 },
        { key: 'platform/auth-service', name: 'Auth Service', budget: 20000 },
      ],
    },
    {
      key: 'finance',
      name: 'Finance',
      budget: 35000,
      children: [
        { key: 'finance/billing', name: 'Billing', budget: 12000 },
        { key: 'finance/invoicing', name: 'Invoicing', budget: 8000 },
      ],
    },
    {
      key: 'operations',
      name: 'Operations',
      budget: 120000,
      children: [
        {
          key: 'operations/data-centers',
          name: 'Data Centers',
          budget: 100000,
          children: [
            {
              key: 'operations/data-centers/us-east',
              name: 'US-East',
              budget: 40000,
              children: [
                { key: 'operations/data-centers/us-east/rack-1', name: 'Rack 1', budget: 5000 },
                { key: 'operations/data-centers/us-east/rack-2', name: 'Rack 2', budget: 5500 },
              ],
            },
            {
              key: 'operations/data-centers/eu-west',
              name: 'EU-West',
              budget: 60000,
              children: euWestRacks,
            },
          ],
        },
      ],
    },
  ];
}

const TARGET_KEY = 'operations/data-centers/eu-west/rack-7';
const TARGET_VALUE = 12500;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [monthlyData] = useState<BudgetRow[]>(generateBudgetData);
  const [annualData, setAnnualData] = useState<BudgetRow[]>(generateBudgetData);
  const [monthlyExpanded, setMonthlyExpanded] = useState<React.Key[]>([]);
  const [annualExpanded, setAnnualExpanded] = useState<React.Key[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const successFired = useRef(false);

  // Find current value of target row
  const findBudget = (rows: BudgetRow[], key: string): number | null => {
    for (const row of rows) {
      if (row.key === key) return row.budget;
      if (row.children) {
        const found = findBudget(row.children, key);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const currentTargetValue = findBudget(annualData, TARGET_KEY);

  useEffect(() => {
    if (!successFired.current && currentTargetValue === TARGET_VALUE) {
      successFired.current = true;
      onSuccess();
    }
  }, [currentTargetValue, onSuccess]);

  // Update budget in tree
  const updateBudget = (rows: BudgetRow[], key: string, newBudget: number): BudgetRow[] => {
    return rows.map(row => {
      if (row.key === key) {
        return { ...row, budget: newBudget };
      }
      if (row.children) {
        return { ...row, children: updateBudget(row.children, key, newBudget) };
      }
      return row;
    });
  };

  const handleSave = (key: string) => {
    const parsed = parseCurrency(editingValue);
    if (parsed !== null) {
      setAnnualData(prev => updateBudget(prev, key, parsed));
    }
    setEditingKey(null);
    setEditingValue('');
  };

  const monthlyColumns: TableColumnsType<BudgetRow> = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 180 },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (value: number) => (
        <Text type="secondary">{formatCurrency(value)}</Text>
      ),
    },
  ];

  const annualColumns: TableColumnsType<BudgetRow> = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 180 },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (value: number, record: BudgetRow) => {
        if (editingKey === record.key) {
          return (
            <Input
              size="small"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onPressEnter={() => handleSave(record.key)}
              onBlur={() => handleSave(record.key)}
              autoFocus
              style={{ width: 100 }}
            />
          );
        }
        return (
          <Text
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setEditingKey(record.key);
              setEditingValue(formatCurrency(value));
            }}
          >
            {formatCurrency(value)}
          </Text>
        );
      },
    },
  ];

  return (
    <div>
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Annual Budget table: set EU-West / Rack 7 Budget to $12,500.
      </Paragraph>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Currency format: $9,750 (include dollar sign and comma separator)
      </Text>

      <Space align="start" size={24}>
        {/* Monthly Budget (read-only) */}
        <Card 
          title="Monthly Budget" 
          style={{ width: 350 }}
          data-component-instance="Monthly Budget"
        >
          <Table<BudgetRow>
            columns={monthlyColumns}
            dataSource={monthlyData}
            expandable={{
              expandedRowKeys: monthlyExpanded,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setMonthlyExpanded([...monthlyExpanded, record.key]);
                } else {
                  setMonthlyExpanded(monthlyExpanded.filter(k => k !== record.key));
                }
              },
            }}
            pagination={false}
            size="small"
            data-testid="monthly-tree-grid"
          />
        </Card>

        {/* Annual Budget (editable) */}
        <Card 
          title="Annual Budget" 
          style={{ width: 350 }}
          data-component-instance="Annual Budget"
        >
          <Table<BudgetRow>
            columns={annualColumns}
            dataSource={annualData}
            expandable={{
              expandedRowKeys: annualExpanded,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setAnnualExpanded([...annualExpanded, record.key]);
                } else {
                  setAnnualExpanded(annualExpanded.filter(k => k !== record.key));
                }
              },
            }}
            pagination={false}
            size="small"
            data-testid="annual-tree-grid"
          />
        </Card>
      </Space>
    </div>
  );
}
