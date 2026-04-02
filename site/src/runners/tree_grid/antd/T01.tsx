'use client';

/**
 * tree_grid-antd-T01: Select API Gateway row
 *
 * Layout: isolated card centered on the page.
 * Component: an Ant Design Table configured as a tree table (hierarchical rows via a `children` field).
 * The first column is "Service", followed by "Owner", "Status", and "Last updated".
 * Interaction: each parent row has a small expand/collapse caret at the start of the "Service" cell;
 * clicking a row highlights it as the current selection.
 * Initial state: all top-level groups (Platform, Finance, Marketing, Operations, People) are collapsed;
 * no row is selected.
 * Distractors: none besides the table header and a non-interactive help caption under the card title.
 * Feedback: the selected row is highlighted and the breadcrumb text above the table updates to "Selected: <path>".
 *
 * Success: The selected row path equals Platform → API Gateway.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

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

export default function T01({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedRowKey ? getRowPath(SERVICE_CATALOG_DATA, selectedRowKey) : [];

  useEffect(() => {
    if (!successFired.current && pathEquals(selectedPath, ['Platform', 'API Gateway'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedPath, onSuccess]);

  return (
    <Card 
      title="Service Catalog" 
      style={{ width: 700 }} 
      data-testid="tree-grid-card"
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Select "API Gateway" under "Platform" in the Service Catalog tree grid.
      </Text>
      
      {selectedRowKey && (
        <Text strong style={{ display: 'block', marginBottom: 12 }}>
          Selected: {selectedPath.join(' → ')}
        </Text>
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
          type: 'radio',
          selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
          onChange: (keys) => {
            const key = keys[0] as string;
            setSelectedRowKey(key || null);
          },
          hideSelectAll: true,
        }}
        onRow={(record) => ({
          onClick: () => setSelectedRowKey(record.key),
          'data-row-path': getRowPath(SERVICE_CATALOG_DATA, record.key).join('/'),
        })}
        pagination={false}
        size="middle"
        data-testid="tree-grid"
      />
    </Card>
  );
}
