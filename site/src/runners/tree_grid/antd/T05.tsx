'use client';

/**
 * tree_grid-antd-T05: Select a row in the Archived Projects grid
 *
 * Layout: form_section with two stacked cards.
 * Top card: "Active Projects" tree grid (AntD Table). Bottom card: "Archived Projects" tree grid (AntD Table).
 * Both use the same column set and tree affordances.
 * Instances: 2 tree grids are visible at once; each card has a bold title directly above its table.
 * Interaction: rows can be selected by clicking; parent rows expand via the caret in the first column.
 * Initial state: Active Projects has "Platform → Auth Service" pre-selected (blue highlight).
 * Archived Projects has no selection and all groups collapsed.
 * Distractors: the form section includes a non-interactive summary paragraph and two disabled toggle switches.
 * Feedback: each table has its own "Selected:" breadcrumb line scoped to that instance.
 *
 * Success: In the "Archived Projects" tree grid, the selected row path equals Marketing → Campaigns → Q2 Launch.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography, Switch, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

const { Text, Paragraph } = Typography;

const columns: TableColumnsType<TreeGridRow> = [
  { title: 'Service', dataIndex: 'service', key: 'service', width: 200 },
  { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 150 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
  { title: 'Last updated', dataIndex: 'lastUpdated', key: 'lastUpdated', width: 120 },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  // Active Projects state - pre-selected
  const [activeExpandedKeys, setActiveExpandedKeys] = useState<React.Key[]>(['platform']);
  const [activeSelectedKey, setActiveSelectedKey] = useState<string | null>('platform/auth-service');
  
  // Archived Projects state - starts empty
  const [archivedExpandedKeys, setArchivedExpandedKeys] = useState<React.Key[]>([]);
  const [archivedSelectedKey, setArchivedSelectedKey] = useState<string | null>(null);
  
  const successFired = useRef(false);

  const archivedPath = archivedSelectedKey ? getRowPath(SERVICE_CATALOG_DATA, archivedSelectedKey) : [];

  useEffect(() => {
    if (!successFired.current && pathEquals(archivedPath, ['Marketing', 'Campaigns', 'Q2 Launch'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [archivedPath, onSuccess]);

  const activePath = activeSelectedKey ? getRowPath(SERVICE_CATALOG_DATA, activeSelectedKey) : [];

  return (
    <div style={{ maxWidth: 800 }}>
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Manage your project catalogs. Toggle visibility settings below to control which projects appear in dashboards.
      </Paragraph>
      
      <Space style={{ marginBottom: 24 }}>
        <Switch disabled /> <Text type="secondary">Show inactive</Text>
        <Switch disabled /> <Text type="secondary">Show archived in reports</Text>
      </Space>

      {/* Active Projects */}
      <Card 
        title="Active Projects" 
        style={{ marginBottom: 24 }} 
        data-component-instance="Active Projects"
      >
        {activeSelectedKey && (
          <Text strong style={{ display: 'block', marginBottom: 12 }}>
            Selected: {activePath.join(' → ')}
          </Text>
        )}
        <Table<TreeGridRow>
          columns={columns}
          dataSource={SERVICE_CATALOG_DATA}
          expandable={{
            expandedRowKeys: activeExpandedKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                setActiveExpandedKeys([...activeExpandedKeys, record.key]);
              } else {
                setActiveExpandedKeys(activeExpandedKeys.filter(k => k !== record.key));
              }
            },
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: activeSelectedKey ? [activeSelectedKey] : [],
            onChange: (keys) => setActiveSelectedKey(keys[0] as string || null),
            hideSelectAll: true,
          }}
          onRow={(record) => ({
            onClick: () => setActiveSelectedKey(record.key),
          })}
          pagination={false}
          size="small"
          data-testid="active-tree-grid"
        />
      </Card>

      {/* Archived Projects */}
      <Card 
        title="Archived Projects" 
        data-component-instance="Archived Projects"
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Archived Projects: select "Marketing → Campaigns → Q2 Launch".
        </Text>
        {archivedSelectedKey && (
          <Text strong style={{ display: 'block', marginBottom: 12 }}>
            Selected: {archivedPath.join(' → ')}
          </Text>
        )}
        <Table<TreeGridRow>
          columns={columns}
          dataSource={SERVICE_CATALOG_DATA}
          expandable={{
            expandedRowKeys: archivedExpandedKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                setArchivedExpandedKeys([...archivedExpandedKeys, record.key]);
              } else {
                setArchivedExpandedKeys(archivedExpandedKeys.filter(k => k !== record.key));
              }
            },
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: archivedSelectedKey ? [archivedSelectedKey] : [],
            onChange: (keys) => setArchivedSelectedKey(keys[0] as string || null),
            hideSelectAll: true,
          }}
          onRow={(record) => ({
            onClick: () => setArchivedSelectedKey(record.key),
          })}
          pagination={false}
          size="small"
          data-testid="archived-tree-grid"
        />
      </Card>
    </div>
  );
}
