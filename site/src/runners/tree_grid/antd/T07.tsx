'use client';

/**
 * tree_grid-antd-T07: Select row matching the reference preview
 *
 * Layout: isolated card anchored near the top-right of the viewport.
 * Component: Ant Design tree table labeled "Service Catalog".
 * Guidance: a small non-interactive reference panel is placed to the left of the table.
 * It shows a miniature tree breadcrumb with the target row highlighted (visual emphasis),
 * but does not provide a clickable shortcut.
 * Interaction: expand/collapse via carets; select a row by clicking it.
 * Initial state: all groups collapsed; no selection.
 * Distractors: the reference panel also shows two other non-highlighted example paths.
 * Feedback: selected row highlight + a "Selected:" breadcrumb above the table.
 *
 * Success: The selected row path equals Marketing → Campaigns → Q2 Launch.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

const { Text } = Typography;

const columns: TableColumnsType<TreeGridRow> = [
  { title: 'Service', dataIndex: 'service', key: 'service', width: 180 },
  { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 130 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 80 },
  { title: 'Last updated', dataIndex: 'lastUpdated', key: 'lastUpdated', width: 100 },
];

const referencePaths = [
  { path: ['Platform', 'Auth Service'], highlighted: false },
  { path: ['Marketing', 'Campaigns', 'Q2 Launch'], highlighted: true },
  { path: ['Finance', 'Billing'], highlighted: false },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedRowKey ? getRowPath(SERVICE_CATALOG_DATA, selectedRowKey) : [];

  useEffect(() => {
    if (!successFired.current && pathEquals(selectedPath, ['Marketing', 'Campaigns', 'Q2 Launch'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedPath, onSuccess]);

  return (
    <Space align="start" size={24}>
      {/* Reference Panel */}
      <Card 
        title="Reference Preview" 
        size="small" 
        style={{ width: 200 }}
        data-reference-id="ref-path-1"
      >
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
          Match the highlighted path:
        </Text>
        {referencePaths.map((ref, idx) => (
          <div
            key={idx}
            style={{
              padding: '4px 8px',
              marginBottom: 4,
              borderRadius: 4,
              background: ref.highlighted ? '#fff7e6' : 'transparent',
              border: ref.highlighted ? '1px solid #ffc53d' : '1px solid transparent',
              fontSize: 12,
            }}
          >
            {ref.path.map((p, i) => (
              <span key={i}>
                {i > 0 && ' → '}
                <span style={{ fontWeight: ref.highlighted ? 600 : 400 }}>{p}</span>
              </span>
            ))}
          </div>
        ))}
      </Card>

      {/* Main Table */}
      <Card 
        title="Service Catalog" 
        style={{ width: 550 }} 
        data-testid="tree-grid-card"
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Match the reference preview: select "Marketing → Campaigns → Q2 Launch".
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
            onChange: (keys) => setSelectedRowKey(keys[0] as string || null),
            hideSelectAll: true,
          }}
          onRow={(record) => ({
            onClick: () => setSelectedRowKey(record.key),
          })}
          pagination={false}
          size="small"
          data-testid="tree-grid"
        />
      </Card>
    </Space>
  );
}
