'use client';

/**
 * data_table_filterable-antd-T02: Filter Customers by Country (Canada + Germany)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. A single Ant Design Table titled "Customers".
 * Columns: Name, Email, Country, Status.
 *
 * Country filter: multi-select checkbox list of 10 countries; OK and Reset buttons at the bottom of the popover.
 *
 * Initial state: no active filters.
 *
 * Success: Country filter set to {Canada, Germany} after clicking OK.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card } from 'antd';
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
  { key: '6', name: 'Frank Martin', email: 'frank@example.com', country: 'France', status: 'Inactive' },
  { key: '7', name: 'Grace Thompson', email: 'grace@example.com', country: 'Canada', status: 'Active' },
  { key: '8', name: 'Henry Tanaka', email: 'henry@example.com', country: 'Japan', status: 'Active' },
  { key: '9', name: 'Iris Lopez', email: 'iris@example.com', country: 'Brazil', status: 'Inactive' },
  { key: '10', name: 'Jack Brown', email: 'jack@example.com', country: 'Australia', status: 'Active' },
];

const countryOptions = ['USA', 'Canada', 'Germany', 'China', 'France', 'Japan', 'Brazil', 'Australia', 'UK', 'India'];
const statusOptions = ['Active', 'Inactive'];

export default function T02({ onSuccess }: TaskComponentProps) {
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
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions.map(s => ({ text: s, value: s })),
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
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
      countryFilter.length === 2 &&
      countryFilter.includes('Canada') &&
      countryFilter.includes('Germany') &&
      (!statusFilter || statusFilter.length === 0) &&
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
        operator: (values?.length ?? 0) > 1 ? 'in' : 'equals' as const,
        value: values?.length === 1 ? String(values[0]) : (values as string[]),
      })),
  };

  return (
    <Card style={{ width: 800 }}>
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
