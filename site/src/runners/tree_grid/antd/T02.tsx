'use client';

/**
 * tree_grid-antd-T02: Expand Finance group only
 *
 * Layout: isolated card centered.
 * Component: Ant Design tree table with top-level groups Platform, Finance, Marketing, Operations, People.
 * Interaction: clicking the caret next to a group name expands/collapses that group in place.
 * Initial state: all top-level groups are collapsed; no filters; no row selection.
 * Distractors: the table has sortable headers, but sorting is not required.
 * Feedback: expanded groups show indented child rows and the caret rotates downward.
 *
 * Success: Expanded row paths include Finance. No other top-level group is expanded.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography } from 'antd';
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
    sorter: (a, b) => a.service.localeCompare(b.service),
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    width: 150,
    sorter: (a, b) => a.owner.localeCompare(b.owner),
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
    sorter: (a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
  },
];

// Top-level keys that should NOT be expanded
const TOP_LEVEL_KEYS = ['platform', 'finance', 'marketing', 'operations', 'people'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const successFired = useRef(false);

  // Check if only Finance is expanded at top level
  const expandedTopLevel = expandedKeys.filter(k => TOP_LEVEL_KEYS.includes(k as string));

  useEffect(() => {
    if (!successFired.current && setsEqual(expandedTopLevel, ['finance'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [expandedTopLevel, onSuccess]);

  return (
    <Card 
      title="Service Catalog" 
      style={{ width: 700 }} 
      data-testid="tree-grid-card"
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Expand "Finance" in the Service Catalog tree grid (only Finance should be expanded).
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
        pagination={false}
        size="middle"
        data-testid="tree-grid"
      />
    </Card>
  );
}
