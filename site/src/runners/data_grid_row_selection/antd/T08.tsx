'use client';

/**
 * data_grid_row_selection-antd-T08: Select archived projects in a dashboard with two tables
 *
 * The scene is a dashboard with two cards in a two-column layout. Each card contains an Ant Design Table
 * with checkbox row selection:
 *   • Left card: "Active projects"
 *   • Right card: "Archived projects"
 * Both tables share the same columns (Project code, Name, Owner) and have visually similar rows, increasing
 * confusion.
 * Spacing is comfortable, scale is default. A small KPI strip and a refresh icon appear above the tables
 * (medium clutter), but they do not affect success.
 * Initial state: no rows are selected in either table. No overlays are involved and selection applies
 * immediately.
 * The target rows AR-017 and AR-023 are present in the Archived projects table; Active projects contains
 * similar codes like AC-017 and AC-023 as distractors.
 *
 * Success: Archived table selected_row_ids equals ['arch_AR017', 'arch_AR023'], Active table has []
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Space, Statistic, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface ProjectData {
  key: string;
  projectCode: string;
  name: string;
  owner: string;
}

const activeProjectsData: ProjectData[] = [
  { key: 'active_AC015', projectCode: 'AC-015', name: 'Dashboard Redesign', owner: 'Alice Chen' },
  { key: 'active_AC017', projectCode: 'AC-017', name: 'API Integration', owner: 'Bob Martinez' },
  { key: 'active_AC019', projectCode: 'AC-019', name: 'Mobile App v2', owner: 'Carol Williams' },
  { key: 'active_AC021', projectCode: 'AC-021', name: 'Analytics Platform', owner: 'David Kim' },
  { key: 'active_AC023', projectCode: 'AC-023', name: 'Cloud Migration', owner: 'Eva Schmidt' },
  { key: 'active_AC025', projectCode: 'AC-025', name: 'Security Audit', owner: 'Frank Jones' },
];

const archivedProjectsData: ProjectData[] = [
  { key: 'arch_AR015', projectCode: 'AR-015', name: 'Legacy System', owner: 'Grace Liu' },
  { key: 'arch_AR017', projectCode: 'AR-017', name: 'Q3 Report', owner: 'Henry Wilson' },
  { key: 'arch_AR019', projectCode: 'AR-019', name: 'Training Portal', owner: 'Iris Chang' },
  { key: 'arch_AR021', projectCode: 'AR-021', name: 'CRM Update', owner: 'Jack Brown' },
  { key: 'arch_AR023', projectCode: 'AR-023', name: 'Data Backup', owner: 'Karen Lee' },
  { key: 'arch_AR025', projectCode: 'AR-025', name: 'Compliance Check', owner: 'Leo Garcia' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [activeSelectedKeys, setActiveSelectedKeys] = useState<React.Key[]>([]);
  const [archivedSelectedKeys, setArchivedSelectedKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<ProjectData> = [
    { title: 'Project code', dataIndex: 'projectCode', key: 'projectCode', width: 110 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 120 },
  ];

  const activeRowSelection: TableRowSelection<ProjectData> = {
    selectedRowKeys: activeSelectedKeys,
    onChange: (keys) => setActiveSelectedKeys(keys),
  };

  const archivedRowSelection: TableRowSelection<ProjectData> = {
    selectedRowKeys: archivedSelectedKeys,
    onChange: (keys) => setArchivedSelectedKeys(keys),
  };

  // Check success condition
  useEffect(() => {
    if (
      selectionEquals(archivedSelectedKeys as string[], ['arch_AR017', 'arch_AR023']) &&
      selectionEquals(activeSelectedKeys as string[], [])
    ) {
      onSuccess();
    }
  }, [activeSelectedKeys, archivedSelectedKeys, onSuccess]);

  return (
    <div style={{ width: 900 }}>
      {/* KPI Strip (medium clutter) */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size="large">
          <Statistic title="Active" value={6} />
          <Statistic title="Archived" value={6} />
          <Statistic title="Total budget" value="$125K" />
        </Space>
        <Button icon={<ReloadOutlined />} type="text">Refresh</Button>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Active projects */}
        <Card style={{ flex: 1 }} data-testid="active-projects-grid">
          <div style={{ fontWeight: 500, marginBottom: 12 }}>Active projects</div>
          <Table
            dataSource={activeProjectsData}
            columns={columns}
            rowSelection={activeRowSelection}
            pagination={false}
            size="small"
            rowKey="key"
            data-testid="active-projects-table"
            data-selected-row-ids={JSON.stringify(activeSelectedKeys)}
          />
        </Card>

        {/* Archived projects */}
        <Card style={{ flex: 1 }} data-testid="archived-projects-grid">
          <div style={{ fontWeight: 500, marginBottom: 12 }}>Archived projects</div>
          <Table
            dataSource={archivedProjectsData}
            columns={columns}
            rowSelection={archivedRowSelection}
            pagination={false}
            size="small"
            rowKey="key"
            data-testid="archived-projects-table"
            data-selected-row-ids={JSON.stringify(archivedSelectedKeys)}
          />
        </Card>
      </div>
    </div>
  );
}
