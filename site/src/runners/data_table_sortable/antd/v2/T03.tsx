'use client';

/**
 * data_table_sortable-antd-v2-T03: Incidents table – exact two-key multi-sort and Apply view
 *
 * A compact dark settings_panel with one AntD table titled "Incidents" plus two unrelated
 * form controls. Severity and Updated support multiple-sort priorities (showSorterTooltip
 * with multiple: true). A footer "Apply view" button commits the current view state.
 *
 * Success: Severity descending (priority 1), Updated ascending (priority 2), Apply view clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Button, Typography, Space, Input, Switch, ConfigProvider, theme as antTheme, Tag } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../../types';

const { Text } = Typography;

interface IncidentRow {
  key: string;
  incidentId: string;
  title: string;
  severity: number;
  assignee: string;
  updated: string;
  status: string;
}

const data: IncidentRow[] = [
  { key: '1', incidentId: 'INC-401', title: 'API timeout', severity: 3, assignee: 'Alice', updated: '2024-02-15 09:30', status: 'Open' },
  { key: '2', incidentId: 'INC-402', title: 'DB connection pool', severity: 5, assignee: 'Bob', updated: '2024-02-14 17:00', status: 'In progress' },
  { key: '3', incidentId: 'INC-403', title: 'Auth failure', severity: 4, assignee: 'Carol', updated: '2024-02-15 11:15', status: 'Open' },
  { key: '4', incidentId: 'INC-404', title: 'Slow queries', severity: 2, assignee: 'Dan', updated: '2024-02-13 08:45', status: 'Resolved' },
  { key: '5', incidentId: 'INC-405', title: 'SSL cert expiry', severity: 5, assignee: 'Eva', updated: '2024-02-15 06:20', status: 'Open' },
  { key: '6', incidentId: 'INC-406', title: 'Memory leak', severity: 4, assignee: 'Frank', updated: '2024-02-14 22:10', status: 'In progress' },
  { key: '7', incidentId: 'INC-407', title: 'CDN outage', severity: 3, assignee: 'Grace', updated: '2024-02-15 14:00', status: 'Open' },
  { key: '8', incidentId: 'INC-408', title: 'Disk full', severity: 1, assignee: 'Hiro', updated: '2024-02-12 10:30', status: 'Resolved' },
  { key: '9', incidentId: 'INC-409', title: 'Rate limiting', severity: 2, assignee: 'Alice', updated: '2024-02-15 13:00', status: 'Open' },
  { key: '10', incidentId: 'INC-410', title: 'DNS propagation', severity: 3, assignee: 'Bob', updated: '2024-02-14 15:45', status: 'Resolved' },
];

const sevColor = (s: number) => s >= 4 ? 'red' : s >= 3 ? 'orange' : 'blue';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [sortedInfo, setSortedInfo] = useState<Record<string, SorterResult<IncidentRow>>>({});
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  const activeSorts = Object.values(sortedInfo).filter(s => s.columnKey && s.order);

  const columns: ColumnsType<IncidentRow> = [
    { title: 'ID', dataIndex: 'incidentId', key: 'incidentId', width: 90 },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Severity', dataIndex: 'severity', key: 'severity', width: 90,
      sorter: { compare: (a, b) => a.severity - b.severity, multiple: 1 },
      sortOrder: sortedInfo['severity']?.order || null,
      render: (v: number) => <Tag color={sevColor(v)}>P{v}</Tag>,
    },
    { title: 'Assignee', dataIndex: 'assignee', key: 'assignee', width: 90 },
    {
      title: 'Updated', dataIndex: 'updated', key: 'updated', width: 140,
      sorter: { compare: (a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime(), multiple: 2 },
      sortOrder: sortedInfo['updated']?.order || null,
    },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
  ];

  const handleChange = (_p: unknown, _f: unknown, sorter: SorterResult<IncidentRow> | SorterResult<IncidentRow>[]) => {
    const arr = Array.isArray(sorter) ? sorter : [sorter];
    const next: Record<string, SorterResult<IncidentRow>> = {};
    arr.forEach(s => { if (s.columnKey) next[String(s.columnKey)] = s; });
    setSortedInfo(next);
    setApplied(false);
  };

  useEffect(() => {
    if (successFired.current) return;
    if (!applied) return;
    const sevSort = sortedInfo['severity'];
    const updSort = sortedInfo['updated'];
    const sevOk = sevSort?.order === 'descend';
    const updOk = updSort?.order === 'ascend';
    const onlyTwo = activeSorts.length === 2;
    if (sevOk && updOk && onlyTwo) {
      successFired.current = true;
      onSuccess();
    }
  }, [sortedInfo, applied, activeSorts.length, onSuccess]);

  const sortModel: SortModel = activeSorts.map((s, i) => ({
    column_key: String(s.columnKey),
    direction: s.order === 'ascend' ? 'asc' as const : 'desc' as const,
    priority: i + 1,
  }));

  return (
    <ConfigProvider theme={{ algorithm: antTheme.darkAlgorithm }}>
      <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%,-50%)', width: 720, background: '#1f1f1f', borderRadius: 8, padding: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <Text style={{ color: '#aaa' }}>Auto-refresh</Text>
            <Switch size="small" />
            <Input size="small" placeholder="Filter incidents…" style={{ width: 180 }} />
          </Space>

          <Card size="small" style={{ background: '#141414' }}>
            <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>Incidents</Text>
            <Table<IncidentRow>
              dataSource={data}
              columns={columns}
              pagination={false}
              size="small"
              rowKey="key"
              onChange={handleChange}
              showSorterTooltip={{ target: 'sorter-icon' }}
              data-testid="table-incidents"
              data-sort-model={JSON.stringify(sortModel)}
            />
          </Card>

          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => setApplied(true)}>Apply view</Button>
          </div>
        </Space>
      </div>
    </ConfigProvider>
  );
}
