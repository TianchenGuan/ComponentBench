'use client';

/**
 * tree_grid-antd-T03: Select Billing and Invoicing
 *
 * Layout: isolated card centered.
 * Component: Ant Design tree table with checkbox row selection enabled (a selection checkbox column appears at the far left).
 * Hierarchy: Finance contains several child services including Billing, Invoicing, and Payments.
 * Initial state: all groups collapsed; no rows selected.
 * Interaction: checkboxes toggle selection per row; selecting children does not automatically select the parent.
 * Feedback: selected rows show checked boxes and a "Selected (2)" counter appears above the table.
 *
 * Success: The selected row set contains Billing and Invoicing. No other rows are selected.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography, Badge } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, setsEqual } from '../types';

const { Text } = Typography;

const columns: TableColumnsType<TreeGridRow> = [
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
  },
  {
    title: 'Last updated',
    dataIndex: 'lastUpdated',
    key: 'lastUpdated',
    width: 120,
  },
];

const TARGET_KEYS = ['finance/billing', 'finance/invoicing'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selectedRowKeys as string[], TARGET_KEYS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <Card 
      title="Service Catalog" 
      style={{ width: 700 }} 
      data-testid="tree-grid-card"
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Select "Billing" and "Invoicing" (under Finance) in the Service Catalog tree grid.
      </Text>
      
      {selectedRowKeys.length > 0 && (
        <Badge count={selectedRowKeys.length} style={{ marginBottom: 12 }}>
          <Text strong style={{ paddingRight: 8 }}>Selected</Text>
        </Badge>
      )}
      
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
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          checkStrictly: true, // Don't auto-select parent/children
        }}
        pagination={false}
        size="middle"
        data-testid="tree-grid"
      />
    </Card>
  );
}
