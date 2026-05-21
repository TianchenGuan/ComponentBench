'use client';

/**
 * tree_grid-antd-T08: Deep select in Operations data center tree (scroll, dark compact)
 *
 * Layout: isolated card positioned near the bottom-right of the viewport.
 * Theme & density: dark theme with compact spacing; the table is rendered at a small scale.
 * Component: Ant Design tree table with a fixed header and a scrollable body (about 10 visible rows).
 * Hierarchy depth: Operations → Data Centers → (region) → (rack) → (asset).
 * US-East contains many racks, so "Rack 12" is not initially visible.
 * Initial state: top-level groups collapsed; no selection.
 * Interaction: expand via carets; scroll within the table body; select by clicking the leaf row.
 * Feedback: selected row highlight and breadcrumb update; expanded branches remain open.
 *
 * Success: The selected row path equals Operations → Data Centers → US-East → Rack 12 → UPS Battery.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography, ConfigProvider, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

const { Text } = Typography;

const columns: TableColumnsType<TreeGridRow> = [
  { title: 'Service', dataIndex: 'service', key: 'service', width: 150 },
  { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 100 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 70 },
  { title: 'Last updated', dataIndex: 'lastUpdated', key: 'lastUpdated', width: 90 },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedRowKey ? getRowPath(SERVICE_CATALOG_DATA, selectedRowKey) : [];

  useEffect(() => {
    if (
      !successFired.current &&
      pathEquals(selectedPath, ['Operations', 'Data Centers', 'US-East', 'Rack 12', 'UPS Battery'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedPath, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          fontSize: 12,
        },
      }}
    >
      <Card 
        title="Service Catalog" 
        style={{ 
          width: 500,
          background: '#1f1f1f',
        }}
        styles={{
          header: { background: '#1f1f1f', borderBottom: '1px solid #303030' },
          body: { background: '#1f1f1f' },
        }}
        data-testid="tree-grid-card"
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 11 }}>
          Select "Operations → Data Centers → US-East → Rack 12 → UPS Battery".
        </Text>
        
        {selectedRowKey && (
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 11 }}>
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
            onChange: (keys) => setSelectedRowKey(keys[0] as string || null),
            hideSelectAll: true,
          }}
          onRow={(record) => ({
            onClick: () => setSelectedRowKey(record.key),
          })}
          scroll={{ y: 300 }}
          pagination={false}
          size="small"
          data-testid="tree-grid"
        />
      </Card>
    </ConfigProvider>
  );
}
