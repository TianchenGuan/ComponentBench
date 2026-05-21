'use client';

/**
 * progress_bar-antd-T09: Table: run Nightly build #7 to completion
 *
 * Layout: table_cell inside a "Builds" panel anchored near the bottom-left of the viewport.
 * Spacing is compact and the table uses small typography.
 *
 * Target components: multiple AntD mini line Progress bars embedded in the "Progress" column 
 * of a table (instances=4 visible at a time due to pagination/virtualization).
 *
 * Table details:
 * - Columns: "Build", "Owner", "Progress", "Action".
 * - Each visible row has a mini Progress bar and a small "Run" button in the Action column.
 * - The table is scrollable vertically within a fixed-height container; Nightly build #7 is 
 *   not initially visible and requires scrolling the table body.
 *
 * Initial state:
 * - Some rows show partially complete progress (static).
 * - The target row "Nightly build #7" shows 0% with status "normal" until started.
 *
 * Success: Progress bar in row "Nightly build #7" reaches 100% with status "success".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Button, Table, Input, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface BuildRow {
  key: string;
  build: string;
  owner: string;
  progress: number;
  status: 'normal' | 'active' | 'success' | 'exception';
}

const initialBuilds: BuildRow[] = [
  { key: 'build-1', build: 'Nightly build #1', owner: 'Alice', progress: 45, status: 'normal' },
  { key: 'build-2', build: 'Nightly build #2', owner: 'Bob', progress: 78, status: 'normal' },
  { key: 'build-3', build: 'Nightly build #3', owner: 'Charlie', progress: 23, status: 'normal' },
  { key: 'build-4', build: 'Nightly build #4', owner: 'Diana', progress: 91, status: 'normal' },
  { key: 'build-5', build: 'Nightly build #5', owner: 'Eve', progress: 56, status: 'normal' },
  { key: 'build-6', build: 'Nightly build #6', owner: 'Frank', progress: 12, status: 'normal' },
  { key: 'build-7', build: 'Nightly build #7', owner: 'Grace', progress: 0, status: 'normal' },
  { key: 'build-8', build: 'Nightly build #8', owner: 'Henry', progress: 67, status: 'normal' },
  { key: 'build-9', build: 'Nightly build #9', owner: 'Ivy', progress: 34, status: 'normal' },
  { key: 'build-10', build: 'Nightly build #10', owner: 'Jack', progress: 89, status: 'normal' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [builds, setBuilds] = useState<BuildRow[]>(initialBuilds);
  const [runningKey, setRunningKey] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: Nightly build #7 at 100% with status "success"
  useEffect(() => {
    const build7 = builds.find((b) => b.key === 'build-7');
    if (build7 && build7.progress === 100 && build7.status === 'success' && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [builds, onSuccess]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleRun = (key: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setRunningKey(key);
    setBuilds((prev) =>
      prev.map((b) => (b.key === key ? { ...b, status: 'active' as const } : b))
    );

    intervalRef.current = setInterval(() => {
      setBuilds((prev) => {
        const build = prev.find((b) => b.key === key);
        if (!build) return prev;

        if (build.progress >= 100) {
          clearInterval(intervalRef.current!);
          setRunningKey(null);
          return prev.map((b) =>
            b.key === key ? { ...b, progress: 100, status: 'success' as const } : b
          );
        }

        return prev.map((b) =>
          b.key === key ? { ...b, progress: b.progress + 2 } : b
        );
      });
    }, 100);
  };

  const columns: ColumnsType<BuildRow> = [
    {
      title: 'Build',
      dataIndex: 'build',
      key: 'build',
      width: 150,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 80,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number, record: BuildRow) => (
        <Progress
          percent={progress}
          size="small"
          status={record.status}
          style={{ margin: 0 }}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: unknown, record: BuildRow) => (
        <Button
          size="small"
          type="primary"
          onClick={() => handleRun(record.key)}
          disabled={runningKey === record.key || record.progress >= 100}
        >
          Run
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Builds"
      size="small"
      style={{ width: 500 }}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <Input.Search placeholder="Search builds..." size="small" style={{ width: 200 }} />
      </div>
      <div style={{ height: 200, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={builds}
          pagination={false}
          size="small"
          rowKey="key"
          scroll={{ y: 180 }}
          onRow={(record) => ({
            'data-row-key': record.key,
          } as React.HTMLAttributes<HTMLTableRowElement>)}
        />
      </div>
    </Card>
  );
}
