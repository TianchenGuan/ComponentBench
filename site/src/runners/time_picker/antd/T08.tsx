'use client';

/**
 * time_picker-antd-T08: Set Region B cutoff to 23:55 in a table
 *
 * The page contains a small table anchored near the bottom-right of the viewport (table cell layout).
 * The table is titled "Cutoff Times" and has three rows: Region A, Region B, and Region C. Each row contains an Ant Design
 * TimePicker inside the "Cutoff time" column. The TimePickers are rendered in the small size tier, making the input and
 * the clock icon compact. All three pickers start at 23:00 and use HH:mm format. Minute stepping is set to 5 (minutes list
 * shows 00, 05, …, 55) to simulate operational cutoff schedules. Selecting a time commits immediately (needConfirm=false).
 * The table also includes non-target columns (e.g., a small "Enabled" switch per row) as realistic clutter, but success
 * depends only on the Region B cutoff TimePicker.
 *
 * Scene: layout=table_cell, placement=bottom_right, scale=small, instances=3, clutter=medium
 *
 * Success: The TimePicker in the "Region B" row (Cutoff time column) has canonical time value exactly 23:55 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, TimePicker, Switch, Table } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface RegionRow {
  key: string;
  region: string;
  cutoff: Dayjs | null;
  enabled: boolean;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<RegionRow[]>([
    { key: 'a', region: 'Region A', cutoff: dayjs('23:00', 'HH:mm'), enabled: true },
    { key: 'b', region: 'Region B', cutoff: dayjs('23:00', 'HH:mm'), enabled: true },
    { key: 'c', region: 'Region C', cutoff: dayjs('23:00', 'HH:mm'), enabled: true },
  ]);

  useEffect(() => {
    const regionB = data.find((row) => row.key === 'b');
    if (regionB && regionB.cutoff && regionB.cutoff.format('HH:mm') === '23:55') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleCutoffChange = (key: string, time: Dayjs | null) => {
    setData((prev) =>
      prev.map((row) => (row.key === key ? { ...row, cutoff: time } : row))
    );
  };

  const handleEnabledChange = (key: string, enabled: boolean) => {
    setData((prev) =>
      prev.map((row) => (row.key === key ? { ...row, enabled } : row))
    );
  };

  const columns = [
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'Cutoff time',
      dataIndex: 'cutoff',
      key: 'cutoff',
      render: (_: unknown, record: RegionRow) => (
        <TimePicker
          size="small"
          value={record.cutoff}
          onChange={(time) => handleCutoffChange(record.key, time)}
          format="HH:mm"
          minuteStep={5}
          needConfirm={false}
          data-testid={`tp-cutoff-region-${record.key}`}
        />
      ),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (_: unknown, record: RegionRow) => (
        <Switch
          size="small"
          checked={record.enabled}
          onChange={(checked) => handleEnabledChange(record.key, checked)}
        />
      ),
    },
  ];

  return (
    <Card title="Cutoff Times" style={{ width: 450 }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
      />
      <div style={{ marginTop: 12, color: '#666', fontSize: 12 }}>
        (Set Region B to 23:55)
      </div>
    </Card>
  );
}
