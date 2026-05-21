'use client';

/**
 * meter-antd-T10: Drag to set Server B Utilization meter in table
 *
 * Setup Description:
 * A table_cell scene shows a small "Servers" table with multiple rows; each row includes a utilization meter.
 * - Layout: table_cell (meter is inside a table column).
 * - Placement: center.
 * - Spacing: compact (tight row height) and default scale.
 * - Clutter: high (table has sortable headers, row action icons, and a search box above).
 * - Component: AntD Progress (type='line') embedded in each row, used as a meter approximation.
 * - Instances: 3 meter instances, one per row:
 *   * Server A → Utilization meter (read-only)
 *   * Server B → Utilization meter (interactive target)
 *   * Server C → Utilization meter (interactive but distractor)
 * - Interaction: the target meter supports click-and-drag on the bar to set value continuously; 
 *   releasing the mouse commits the new value.
 * - Observability: percent text is shown inside the cell as a small number (e.g., "38%").
 * - Initial state: Server B = 15%.
 * - Feedback: on mouse up, the number updates and briefly highlights (200ms transition); no Apply/Save.
 *
 * Success: The Utilization meter in the Server B row is 40% (±2 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography, Input, Table, Button, Space } from 'antd';
import { SearchOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface ServerData {
  key: string;
  name: string;
  utilization: number;
  isInteractive: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [serverB, setServerB] = useState(15);
  const [serverC, setServerC] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(serverB - 40) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [serverB, onSuccess]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, server: string) => {
    if (server === 'A') return; // Read-only
    setIsDragging(true);
    setDragTarget(server);
    handleDrag(e, server);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragTarget) return;
    handleDrag(e, dragTarget);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>, server: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    if (server === 'B') {
      setServerB(clampedPercent);
    } else if (server === 'C') {
      setServerC(clampedPercent);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, server: string) => {
    if (server === 'A') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    if (server === 'B') {
      setServerB(clampedPercent);
    } else if (server === 'C') {
      setServerC(clampedPercent);
    }
  };

  const data: ServerData[] = [
    { key: 'A', name: 'Server A', utilization: 45, isInteractive: false },
    { key: 'B', name: 'Server B', utilization: serverB, isInteractive: true },
    { key: 'C', name: 'Server C', utilization: serverC, isInteractive: true },
  ];

  const columns = [
    {
      title: 'Server',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ServerData, b: ServerData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Utilization',
      dataIndex: 'utilization',
      key: 'utilization',
      sorter: (a: ServerData, b: ServerData) => a.utilization - b.utilization,
      render: (value: number, record: ServerData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            onMouseDown={(e) => handleMouseDown(e, record.key)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => handleClick(e, record.key)}
            style={{ 
              flex: 1, 
              cursor: record.isInteractive ? 'pointer' : 'default',
              userSelect: 'none'
            }}
            data-testid={`meter-util-server-${record.key.toLowerCase()}`}
            data-meter-value={value}
            role="meter"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${record.name} Utilization`}
          >
            <Progress 
              percent={value} 
              showInfo={false} 
              size="small"
              status={record.isInteractive ? 'normal' : 'active'}
            />
          </div>
          <Text style={{ minWidth: 35, fontSize: 12 }}>{value}%</Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: () => (
        <Space size="small">
          <Button type="text" size="small" icon={<SettingOutlined />} />
          <Button type="text" size="small" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <Card title="Servers" style={{ width: 600 }}>
      <div style={{ marginBottom: 16 }}>
        <Input 
          placeholder="Search servers..." 
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
      </div>
      <Table 
        dataSource={data} 
        columns={columns} 
        size="small"
        pagination={false}
      />
    </Card>
  );
}
