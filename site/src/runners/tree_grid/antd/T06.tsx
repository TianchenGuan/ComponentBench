'use client';

/**
 * tree_grid-antd-T06: Filter Status to Blocked (confirm required)
 *
 * Layout: isolated card centered.
 * Component: Ant Design tree table with a "Status" column that has a filter icon in the header.
 * Status values include Active, Paused, and Blocked.
 * Interaction: clicking the filter icon opens a small dropdown overlay with checkbox options and
 * two buttons at the bottom: "OK" and "Reset".
 * Initial state: no filters are applied; all groups are collapsed; no row selection.
 * Confirm behavior: selecting a checkbox in the dropdown does not apply the filter until "OK" is clicked.
 * Feedback: after confirming, the Status header shows an active filter indicator and non-matching rows disappear.
 *
 * Success: The Status column filter is applied with the single allowed value: Blocked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography } from 'antd';
import type { ColumnsType, FilterValue } from 'antd/es/table/interface';
import type { TaskComponentProps, TreeGridRow, FilterModel } from '../types';
import { SERVICE_CATALOG_DATA, setsEqual } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [filterModel, setFilterModel] = useState<FilterModel[]>([]);
  const successFired = useRef(false);

  const columns: ColumnsType<TreeGridRow> = [
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      width: 200,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Paused', value: 'Paused' },
        { text: 'Blocked', value: 'Blocked' },
      ],
      filteredValue: filterModel.find(f => f.column === 'Status')?.value as string[] || null,
      onFilter: (value: React.Key | boolean, record: TreeGridRow) => record.status === value,
    },
    {
      title: 'Last updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 120,
    },
  ];

  useEffect(() => {
    const statusFilter = filterModel.find(f => f.column === 'Status');
    if (!successFired.current && statusFilter && setsEqual(statusFilter.value as string[], ['Blocked'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [filterModel, onSuccess]);

  const handleTableChange = (
    _pagination: unknown,
    filters: Record<string, FilterValue | null>
  ) => {
    const newFilters: FilterModel[] = [];
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      newFilters.push({
        column: 'Status',
        operator: 'in',
        value: filters.status as string[],
      });
    }
    setFilterModel(newFilters);
  };

  return (
    <Card 
      title="Service Catalog" 
      style={{ width: 700 }} 
      data-testid="tree-grid-card"
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Filter Status = Blocked in the Service Catalog table and confirm.
      </Text>
      
      <Table<TreeGridRow>
        columns={columns}
        dataSource={SERVICE_CATALOG_DATA}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedKeys([...expandedKeys, record.key]);
            } else {
              setExpandedKeys(expandedKeys.filter(k => k !== record.key));
            }
          },
        }}
        onChange={handleTableChange}
        pagination={false}
        size="middle"
        data-testid="tree-grid"
      />
    </Card>
  );
}
