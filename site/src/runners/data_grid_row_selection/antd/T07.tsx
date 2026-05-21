'use client';

/**
 * data_grid_row_selection-antd-T07: Search then select in the correct segment table
 *
 * The page is a form_section for "Create campaign" with light clutter: a couple of text inputs (Campaign name,
 * Budget) and a disabled toggle appear above the audience segment.
 * The audience segment contains TWO Ant Design Tables side-by-side, each with its own heading and checkbox
 * row selection column:
 *   1) "Prospects" table (left)
 *   2) "Customers" table (right)
 * Each table has an Input.Search field directly above it that filters rows within that table only.
 * Spacing is comfortable and scale is default. Both tables show about 12 rows with columns: User ID, Name, Region.
 * Initial state: no rows selected in either table, and no search filters applied.
 * The target row "U-118 — Kara Novak" exists only in the Prospects table. Selecting a row takes effect
 * immediately (no Apply button).
 *
 * Success: Prospects table selected_row_ids equals ['user_U118'], Customers table has []
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Card, Input, Switch, Space } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface UserData {
  key: string;
  userId: string;
  name: string;
  region: string;
}

const prospectsData: UserData[] = [
  { key: 'user_U101', userId: 'U-101', name: 'Alex Turner', region: 'North' },
  { key: 'user_U104', userId: 'U-104', name: 'Diana Ross', region: 'East' },
  { key: 'user_U107', userId: 'U-107', name: 'Bruno Mars', region: 'South' },
  { key: 'user_U110', userId: 'U-110', name: 'Fiona Chen', region: 'West' },
  { key: 'user_U113', userId: 'U-113', name: 'Hans Mueller', region: 'North' },
  { key: 'user_U115', userId: 'U-115', name: 'Isabella Rossi', region: 'East' },
  { key: 'user_U118', userId: 'U-118', name: 'Kara Novak', region: 'South' },
  { key: 'user_U120', userId: 'U-120', name: 'Liam Johnson', region: 'West' },
  { key: 'user_U123', userId: 'U-123', name: 'Maria Garcia', region: 'North' },
  { key: 'user_U126', userId: 'U-126', name: 'Noah Kim', region: 'East' },
  { key: 'user_U129', userId: 'U-129', name: 'Olivia Brown', region: 'South' },
  { key: 'user_U132', userId: 'U-132', name: 'Peter Zhang', region: 'West' },
];

const customersData: UserData[] = [
  { key: 'cust_C201', userId: 'U-201', name: 'Quinn Adams', region: 'North' },
  { key: 'cust_C204', userId: 'U-204', name: 'Rachel Green', region: 'East' },
  { key: 'cust_C207', userId: 'U-207', name: 'Sam Wilson', region: 'South' },
  { key: 'cust_C210', userId: 'U-210', name: 'Tina Baker', region: 'West' },
  { key: 'cust_C213', userId: 'U-213', name: 'Uma Patel', region: 'North' },
  { key: 'cust_C216', userId: 'U-216', name: 'Victor Hugo', region: 'East' },
  { key: 'cust_C219', userId: 'U-219', name: 'Wendy Liu', region: 'South' },
  { key: 'cust_C222', userId: 'U-222', name: 'Xavier Jones', region: 'West' },
  { key: 'cust_C225', userId: 'U-225', name: 'Yuki Tanaka', region: 'North' },
  { key: 'cust_C228', userId: 'U-228', name: 'Zara Khan', region: 'East' },
  { key: 'cust_C231', userId: 'U-231', name: 'Aaron Smith', region: 'South' },
  { key: 'cust_C234', userId: 'U-234', name: 'Beth Clark', region: 'West' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [prospectsSelectedKeys, setProspectsSelectedKeys] = useState<React.Key[]>([]);
  const [customersSelectedKeys, setCustomersSelectedKeys] = useState<React.Key[]>([]);
  const [prospectsSearch, setProspectsSearch] = useState('');
  const [customersSearch, setCustomersSearch] = useState('');

  const columns: ColumnsType<UserData> = [
    { title: 'User ID', dataIndex: 'userId', key: 'userId', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Region', dataIndex: 'region', key: 'region', width: 80 },
  ];

  const filteredProspects = useMemo(() => {
    if (!prospectsSearch) return prospectsData;
    const search = prospectsSearch.toLowerCase();
    return prospectsData.filter(
      d => d.userId.toLowerCase().includes(search) || d.name.toLowerCase().includes(search)
    );
  }, [prospectsSearch]);

  const filteredCustomers = useMemo(() => {
    if (!customersSearch) return customersData;
    const search = customersSearch.toLowerCase();
    return customersData.filter(
      d => d.userId.toLowerCase().includes(search) || d.name.toLowerCase().includes(search)
    );
  }, [customersSearch]);

  const prospectsRowSelection: TableRowSelection<UserData> = {
    selectedRowKeys: prospectsSelectedKeys,
    onChange: (keys) => setProspectsSelectedKeys(keys),
  };

  const customersRowSelection: TableRowSelection<UserData> = {
    selectedRowKeys: customersSelectedKeys,
    onChange: (keys) => setCustomersSelectedKeys(keys),
  };

  // Check success condition
  useEffect(() => {
    if (
      selectionEquals(prospectsSelectedKeys as string[], ['user_U118']) &&
      selectionEquals(customersSelectedKeys as string[], [])
    ) {
      onSuccess();
    }
  }, [prospectsSelectedKeys, customersSelectedKeys, onSuccess]);

  return (
    <Card style={{ width: 900, padding: 16 }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: 0, marginBottom: 16 }}>Create campaign</h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>
              Campaign name
            </label>
            <Input placeholder="Enter campaign name" style={{ width: 300 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>
              Budget
            </label>
            <Input placeholder="$0.00" style={{ width: 150 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch disabled />
            <span style={{ color: '#999' }}>Enable A/B testing</span>
          </div>
        </Space>
      </div>

      <div style={{ marginBottom: 8, fontWeight: 500 }}>Audience segment</div>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Prospects table */}
        <div style={{ flex: 1 }} data-testid="prospects-grid">
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Prospects</div>
          <Input.Search
            placeholder="Search prospects..."
            value={prospectsSearch}
            onChange={(e) => setProspectsSearch(e.target.value)}
            style={{ marginBottom: 8 }}
            data-testid="prospects-search"
          />
          <Table
            dataSource={filteredProspects}
            columns={columns}
            rowSelection={prospectsRowSelection}
            pagination={false}
            size="small"
            rowKey="key"
            scroll={{ y: 250 }}
            data-testid="prospects-table"
            data-selected-row-ids={JSON.stringify(prospectsSelectedKeys)}
          />
        </div>

        {/* Customers table */}
        <div style={{ flex: 1 }} data-testid="customers-grid">
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Customers</div>
          <Input.Search
            placeholder="Search customers..."
            value={customersSearch}
            onChange={(e) => setCustomersSearch(e.target.value)}
            style={{ marginBottom: 8 }}
            data-testid="customers-search"
          />
          <Table
            dataSource={filteredCustomers}
            columns={columns}
            rowSelection={customersRowSelection}
            pagination={false}
            size="small"
            rowKey="key"
            scroll={{ y: 250 }}
            data-testid="customers-table"
            data-selected-row-ids={JSON.stringify(customersSelectedKeys)}
          />
        </div>
      </div>
    </Card>
  );
}
