'use client';

/**
 * data_table_filterable-antd-T09: Dark mode: Match reference chips (Country + Status)
 *
 * Scene context: theme=dark; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=mixed; clutter=none.
 *
 * Theme: dark. Layout: isolated_card centered with no extra clutter.
 *
 * A small "Target filters" row above the Ant Design Table shows two colored chips: "Country: Canada" and "Status: Active".
 *
 * The table titled "Customers" has columns Country and Status, each with a filter funnel icon that opens the standard AntD
 * filter popover with OK/Reset.
 *
 * Initial state: no filters active.
 *
 * Success: Country equals "Canada" AND Status equals "Active" after clicking OK in both filter popovers.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Tag } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../types';

interface CustomerData {
  key: string;
  name: string;
  email: string;
  country: string;
  status: string;
}

const customersData: CustomerData[] = [
  { key: '1', name: 'Alice Johnson', email: 'alice@example.com', country: 'USA', status: 'Active' },
  { key: '2', name: 'Bob Wilson', email: 'bob@example.com', country: 'Canada', status: 'Active' },
  { key: '3', name: 'Carol Schmidt', email: 'carol@example.com', country: 'Germany', status: 'Inactive' },
  { key: '4', name: 'David Chen', email: 'david@example.com', country: 'China', status: 'Active' },
  { key: '5', name: 'Eva Mueller', email: 'eva@example.com', country: 'Germany', status: 'Active' },
  { key: '6', name: 'Frank Martin', email: 'frank@example.com', country: 'Canada', status: 'Inactive' },
  { key: '7', name: 'Grace Thompson', email: 'grace@example.com', country: 'Canada', status: 'Active' },
  { key: '8', name: 'Henry Tanaka', email: 'henry@example.com', country: 'Japan', status: 'Active' },
];

const countryOptions = ['USA', 'Canada', 'Germany', 'China', 'Japan', 'France', 'UK', 'Australia'];
const statusOptions = ['Active', 'Inactive', 'Pending', 'Suspended'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const successFiredRef = useRef(false);

  const columns: ColumnsType<CustomerData> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      filters: countryOptions.map(c => ({ text: c, value: c })),
      filteredValue: filteredInfo.country || null,
      onFilter: (value, record) => record.country === value,
      filterMultiple: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions.map(s => ({ text: s, value: s })),
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      filterMultiple: false,
    },
  ];

  const handleChange = (
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    setFilteredInfo(filters);
  };

  // Check success condition
  useEffect(() => {
    const countryFilter = filteredInfo.country;
    const statusFilter = filteredInfo.status;
    
    if (
      countryFilter &&
      countryFilter.length === 1 &&
      countryFilter[0] === 'Canada' &&
      statusFilter &&
      statusFilter.length === 1 &&
      statusFilter[0] === 'Active' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filteredInfo, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'customers',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(filteredInfo)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: 'equals' as const,
        value: String(values?.[0]),
      })),
  };

  return (
    <Card style={{ width: 800 }}>
      {/* Target filters reference chips */}
      <div style={{ 
        marginBottom: 16, 
        padding: 12, 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontSize: 12, marginBottom: 8 }}>Target filters:</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag color="blue">Country: Canada</Tag>
          <Tag color="green">Status: Active</Tag>
        </div>
      </div>

      <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Customers</div>
      <Table
        dataSource={customersData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onChange={handleChange}
        data-testid="table-customers"
        data-filter-model={JSON.stringify(filterModel)}
      />
    </Card>
  );
}
