'use client';

/**
 * data_table_filterable-antd-T03: Name contains fragment (preview-highlighted)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=mixed; clutter=none.
 *
 * Layout: isolated_card centered. Above the table, a small "Preview row" strip shows an example name with the target fragment
 * highlighted in yellow.
 *
 * The Ant Design Table titled "Customers" uses comfortable spacing and default scale.
 *
 * Name column uses a custom filterDropdown: clicking the Name filter icon opens a popover containing a single-line text
 * Input labeled "Search name", plus two buttons: "Search" and "Reset".
 *
 * Initial state: no filters active; the preview row is visible and highlights the substring "son".
 *
 * Success: Name text filter is active with a contains (case-insensitive) query equal to "son" after clicking Search.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, FilterDropdownProps } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../types';

interface CustomerData {
  key: string;
  name: string;
  country: string;
  status: string;
}

const customersData: CustomerData[] = [
  { key: '1', name: 'Alice Johnson', country: 'USA', status: 'Active' },
  { key: '2', name: 'Bob Wilson', country: 'Canada', status: 'Active' },
  { key: '3', name: 'Carol Thompson', country: 'UK', status: 'Inactive' },
  { key: '4', name: 'David Anderson', country: 'Germany', status: 'Active' },
  { key: '5', name: 'Eva Jackson', country: 'France', status: 'Active' },
  { key: '6', name: 'Frank Nelson', country: 'Japan', status: 'Inactive' },
  { key: '7', name: 'Grace Robinson', country: 'Australia', status: 'Active' },
  { key: '8', name: 'Henry Parson', country: 'China', status: 'Active' },
  { key: '9', name: 'Iris Brown', country: 'Brazil', status: 'Inactive' },
  { key: '10', name: 'Jack Davis', country: 'India', status: 'Active' },
];

const countryOptions = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'China', 'Brazil', 'India'];
const statusOptions = ['Active', 'Inactive'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [nameFilter, setNameFilter] = useState<string>('');
  const [appliedNameFilter, setAppliedNameFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const successFiredRef = useRef(false);
  const searchInputRef = useRef<any>(null);

  const handleSearch = (confirm: () => void) => {
    setAppliedNameFilter(nameFilter);
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    setNameFilter('');
    setAppliedNameFilter('');
    clearFilters();
  };

  const columns: ColumnsType<CustomerData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInputRef}
            placeholder="Search name"
            value={nameFilter}
            onChange={(e) => {
              setNameFilter(e.target.value);
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => handleSearch(confirm)}
            style={{ marginBottom: 8, display: 'block' }}
            data-testid="name-search-input"
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInputRef.current?.select(), 100);
        }
      },
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      filters: countryOptions.map(c => ({ text: c, value: c })),
      onFilter: (value, record) => record.country === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions.map(s => ({ text: s, value: s })),
      onFilter: (value, record) => record.status === value,
    },
  ];

  const handleChange = (_pagination: any, filters: any) => {
    setCountryFilter(filters.country || []);
    setStatusFilter(filters.status || []);
  };

  // Check success condition
  useEffect(() => {
    if (
      appliedNameFilter.toLowerCase().trim() === 'son' &&
      countryFilter.length === 0 &&
      statusFilter.length === 0 &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedNameFilter, countryFilter, statusFilter, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'customers',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: [
      ...(appliedNameFilter ? [{ column: 'Name', operator: 'contains_ci' as const, value: appliedNameFilter }] : []),
      ...(countryFilter.length > 0 ? [{ column: 'Country', operator: 'in' as const, value: countryFilter }] : []),
      ...(statusFilter.length > 0 ? [{ column: 'Status', operator: 'in' as const, value: statusFilter }] : []),
    ],
  };

  // Filter data based on applied filter
  const filteredData = customersData.filter(record => {
    if (appliedNameFilter && !record.name.toLowerCase().includes(appliedNameFilter.toLowerCase())) {
      return false;
    }
    if (countryFilter.length > 0 && !countryFilter.includes(record.country)) {
      return false;
    }
    if (statusFilter.length > 0 && !statusFilter.includes(record.status)) {
      return false;
    }
    return true;
  });

  // Highlight function for preview
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const index = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span style={{ backgroundColor: '#ffff00', padding: '0 2px' }}>
          {text.substring(index, index + highlight.length)}
        </span>
        {text.substring(index + highlight.length)}
      </>
    );
  };

  return (
    <Card style={{ width: 800 }}>
      {/* Preview row with highlighted fragment */}
      <div style={{ 
        marginBottom: 16, 
        padding: 12, 
        background: '#f5f5f5', 
        borderRadius: 4,
        border: '1px solid #d9d9d9'
      }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Preview row:</div>
        <div style={{ fontSize: 14 }}>
          Name: {highlightText('Alice Johnson', 'son')}
        </div>
      </div>

      <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Customers</div>
      <Table
        dataSource={filteredData}
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
