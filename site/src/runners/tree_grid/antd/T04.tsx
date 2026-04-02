'use client';

/**
 * tree_grid-antd-T04: Sort by Last updated (newest first)
 *
 * Layout: isolated card centered.
 * Component: Ant Design tree table with sortable column headers. "Last updated" shows dates like "Jan 12, 2026".
 * Initial state: no active sort (neutral sort indicator on all headers); groups are collapsed.
 * Interaction: clicking the "Last updated" header cycles sort state (none → ascending → descending).
 * Feedback: the sort caret indicator on the header updates and the visible rows re-order accordingly.
 *
 * Success: The active sort model is set to column "Last updated" in descending order.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, TreeGridRow, SortModel } from '../types';
import { SERVICE_CATALOG_DATA } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [sortModel, setSortModel] = useState<SortModel | null>(null);
  const successFired = useRef(false);

  const columns: ColumnsType<TreeGridRow> = [
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      width: 200,
      sorter: (a: TreeGridRow, b: TreeGridRow) => a.service.localeCompare(b.service),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 150,
      sorter: (a: TreeGridRow, b: TreeGridRow) => a.owner.localeCompare(b.owner),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: 'Last updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 120,
      sorter: (a: TreeGridRow, b: TreeGridRow) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
      sortOrder: sortModel?.column === 'Last updated' ? (sortModel.direction === 'asc' ? 'ascend' : 'descend') : null,
    },
  ];

  useEffect(() => {
    if (!successFired.current && sortModel?.column === 'Last updated' && sortModel.direction === 'desc') {
      successFired.current = true;
      onSuccess();
    }
  }, [sortModel, onSuccess]);

  const handleTableChange = (
    _pagination: unknown,
    _filters: unknown,
    sorter: SorterResult<TreeGridRow> | SorterResult<TreeGridRow>[]
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    if (singleSorter.order) {
      setSortModel({
        column: singleSorter.column?.title as string,
        direction: singleSorter.order === 'ascend' ? 'asc' : 'desc',
      });
    } else {
      setSortModel(null);
    }
  };

  return (
    <Card 
      title="Service Catalog" 
      style={{ width: 700 }} 
      data-testid="tree-grid-card"
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Sort the Service Catalog by "Last updated" (newest first).
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
