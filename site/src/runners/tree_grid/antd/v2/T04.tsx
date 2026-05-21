'use client';

/**
 * tree_grid-antd-v2-T04: Deep asset selection in compact dark grid with local add action
 *
 * Fixed-height scrollable tree grid. Select Operations → Data Centers → US-East → Rack 12 → UPS Battery.
 * Click "Add asset".
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Table, Typography, Button, ConfigProvider, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps, TreeGridRow } from '../../types';
import { pathEquals } from '../../types';

const { Text } = Typography;

function buildAssetTree(): TreeGridRow[] {
  const assets = ['UPS Battery', 'Cooling Unit', 'Network Switch', 'Server Rack'];
  const racks: TreeGridRow[] = Array.from({ length: 20 }, (_, i) => ({
    key: `us-east/rack-${i + 1}`,
    service: `Rack ${i + 1}`,
    owner: `Tech ${i + 1}`,
    status: 'Active' as const,
    lastUpdated: `Jan ${Math.max(1, 28 - i)}, 2026`,
    children: assets.map(a => ({
      key: `us-east/rack-${i + 1}/${a.toLowerCase().replace(/\s+/g, '-')}`,
      service: a,
      owner: `Eng ${i + 1}`,
      status: 'Active' as const,
      lastUpdated: `Jan ${Math.max(1, 26 - i)}, 2026`,
    })),
  }));
  return [{
    key: 'ops', service: 'Operations', owner: 'Nancy Red', status: 'Active', lastUpdated: 'Jan 29, 2026',
    children: [{
      key: 'ops/dc', service: 'Data Centers', owner: 'Oscar Yellow', status: 'Active', lastUpdated: 'Jan 28, 2026',
      children: [{
        key: 'ops/dc/us-east', service: 'US-East', owner: 'Pat Orange', status: 'Active', lastUpdated: 'Jan 27, 2026',
        children: racks,
      }],
    }],
  }];
}

function getPath(rows: TreeGridRow[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.service];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.service, ...p]; }
  }
  return [];
}

const columns: TableColumnsType<TreeGridRow> = [
  { title: 'Asset', dataIndex: 'service', key: 'service', width: 200 },
  { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 120 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 80 },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const data = useMemo(buildAssetTree, []);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getPath(data, selectedKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (pathEquals(selectedPath, ['Operations', 'Data Centers', 'US-East', 'Rack 12', 'UPS Battery'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selectedPath, onSuccess]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Card title="Asset inventory" style={{ width: 500 }} size="small">
        <div style={{ maxHeight: 320, overflow: 'auto' }}>
          <Table<TreeGridRow>
            columns={columns}
            dataSource={data}
            rowKey="key"
            pagination={false}
            size="small"
            expandable={{
              expandedRowKeys: expandedKeys,
              onExpand: (expanded, record) => {
                setExpandedKeys(expanded
                  ? [...expandedKeys, record.key]
                  : expandedKeys.filter(k => k !== record.key));
              },
            }}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedKey ? [selectedKey] : [],
              onChange: (keys) => setSelectedKey((keys[0] as string) || null),
              hideSelectAll: true,
            }}
            onRow={(record) => ({ onClick: () => setSelectedKey(record.key) })}
            data-testid="tree-grid"
          />
        </div>
        {selectedKey && <Text style={{ display: 'block', margin: '8px 0' }}>Selected: {selectedPath.join(' → ')}</Text>}
        <Button type="primary" block onClick={() => setSaved(true)} style={{ marginTop: 8 }}>Add asset</Button>
      </Card>
    </ConfigProvider>
  );
}
