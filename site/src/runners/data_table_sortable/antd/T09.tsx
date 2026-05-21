'use client';

/**
 * data_table_sortable-antd-T09: Dashboard - sort Team Members by Last active newest→oldest (3 tables)
 *
 * High-clutter dashboard with three sortable Ant Design Tables.
 * - Tables: "Team Members" (target), "Vendors" (distractor), "Projects" (distractor).
 * - Each table has a date/time column with similar meaning.
 * - Initial state: all three tables are unsorted.
 * - Placement: bottom_left.
 *
 * Success: Team Members sorted by Last active descending; others unchanged.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, Menu } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface TeamMemberData {
  key: string;
  name: string;
  role: string;
  lastActive: string;
  status: string;
}

interface VendorData {
  key: string;
  vendor: string;
  contact: string;
  lastInvoice: string;
  status: string;
}

interface ProjectData {
  key: string;
  project: string;
  lead: string;
  lastUpdated: string;
  status: string;
}

const teamMembersData: TeamMemberData[] = [
  { key: '1', name: 'Alice Chen', role: 'Engineer', lastActive: '2024-02-15 09:30', status: 'Active' },
  { key: '2', name: 'Bob Smith', role: 'Designer', lastActive: '2024-02-14 14:20', status: 'Active' },
  { key: '3', name: 'Carol Davis', role: 'PM', lastActive: '2024-02-15 11:45', status: 'Active' },
  { key: '4', name: 'David Kim', role: 'Engineer', lastActive: '2024-02-13 16:00', status: 'Away' },
  { key: '5', name: 'Emma Wilson', role: 'QA', lastActive: '2024-02-15 08:15', status: 'Active' },
];

const vendorsData: VendorData[] = [
  { key: '1', vendor: 'TechSupply Inc', contact: 'John Doe', lastInvoice: '2024-02-10', status: 'Active' },
  { key: '2', vendor: 'CloudServices', contact: 'Jane Smith', lastInvoice: '2024-02-01', status: 'Active' },
  { key: '3', vendor: 'DataVault', contact: 'Mike Brown', lastInvoice: '2024-01-25', status: 'Pending' },
];

const projectsData: ProjectData[] = [
  { key: '1', project: 'Website Redesign', lead: 'Alice', lastUpdated: '2024-02-15', status: 'Active' },
  { key: '2', project: 'Mobile App v2', lead: 'Bob', lastUpdated: '2024-02-14', status: 'Active' },
  { key: '3', project: 'API Migration', lead: 'Carol', lastUpdated: '2024-02-12', status: 'On Hold' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [teamSortedInfo, setTeamSortedInfo] = useState<SorterResult<TeamMemberData>>({});
  const [vendorSortedInfo, setVendorSortedInfo] = useState<SorterResult<VendorData>>({});
  const [projectSortedInfo, setProjectSortedInfo] = useState<SorterResult<ProjectData>>({});

  const teamColumns: ColumnsType<TeamMemberData> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Last active',
      dataIndex: 'lastActive',
      key: 'last_active',
      sorter: (a, b) => new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime(),
      sortOrder: teamSortedInfo.columnKey === 'last_active' ? teamSortedInfo.order : null,
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const vendorColumns: ColumnsType<VendorData> = [
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    {
      title: 'Last invoice',
      dataIndex: 'lastInvoice',
      key: 'lastInvoice',
      sorter: (a, b) => new Date(a.lastInvoice).getTime() - new Date(b.lastInvoice).getTime(),
      sortOrder: vendorSortedInfo.columnKey === 'lastInvoice' ? vendorSortedInfo.order : null,
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const projectColumns: ColumnsType<ProjectData> = [
    { title: 'Project', dataIndex: 'project', key: 'project' },
    { title: 'Lead', dataIndex: 'lead', key: 'lead' },
    {
      title: 'Last updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
      sortOrder: projectSortedInfo.columnKey === 'lastUpdated' ? projectSortedInfo.order : null,
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  // Check success condition
  useEffect(() => {
    const teamCorrect = teamSortedInfo.columnKey === 'last_active' && teamSortedInfo.order === 'descend';
    const vendorUntouched = !vendorSortedInfo.columnKey || !vendorSortedInfo.order;
    const projectUntouched = !projectSortedInfo.columnKey || !projectSortedInfo.order;
    
    if (teamCorrect && vendorUntouched && projectUntouched) {
      onSuccess();
    }
  }, [teamSortedInfo, vendorSortedInfo, projectSortedInfo, onSuccess]);

  const teamSortModel: SortModel = teamSortedInfo.columnKey && teamSortedInfo.order
    ? [{ column_key: String(teamSortedInfo.columnKey), direction: teamSortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  const vendorSortModel: SortModel = vendorSortedInfo.columnKey && vendorSortedInfo.order
    ? [{ column_key: String(vendorSortedInfo.columnKey), direction: vendorSortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  const projectSortModel: SortModel = projectSortedInfo.columnKey && projectSortedInfo.order
    ? [{ column_key: String(projectSortedInfo.columnKey), direction: projectSortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <div style={{ display: 'flex', width: 1000 }}>
      {/* Sidebar */}
      <div style={{ width: 200, marginRight: 24 }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['team']}
          items={[
            { key: 'home', icon: <HomeOutlined />, label: 'Home' },
            { key: 'team', icon: <TeamOutlined />, label: 'Team' },
            { key: 'projects', icon: <ProjectOutlined />, label: 'Projects' },
            { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
          ]}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {/* KPI Tiles */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Card size="small" style={{ flex: 1 }}>
            <Statistic title="Team Members" value={12} />
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <Statistic title="Active Projects" value={8} />
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <Statistic title="Vendors" value={5} />
          </Card>
        </div>

        {/* Tables stacked */}
        <Card title="Team Members" style={{ marginBottom: 16 }}>
          <Table
            dataSource={teamMembersData}
            columns={teamColumns}
            pagination={false}
            size="small"
            rowKey="key"
            onChange={(_, __, sorter) => {
              const s = Array.isArray(sorter) ? sorter[0] : sorter;
              setTeamSortedInfo(s || {});
            }}
            data-testid="table-team-members"
            data-sort-model={JSON.stringify(teamSortModel)}
          />
        </Card>

        <Card title="Vendors" style={{ marginBottom: 16 }}>
          <Table
            dataSource={vendorsData}
            columns={vendorColumns}
            pagination={false}
            size="small"
            rowKey="key"
            onChange={(_, __, sorter) => {
              const s = Array.isArray(sorter) ? sorter[0] : sorter;
              setVendorSortedInfo(s || {});
            }}
            data-testid="table-vendors"
            data-sort-model={JSON.stringify(vendorSortModel)}
          />
        </Card>

        <Card title="Projects">
          <Table
            dataSource={projectsData}
            columns={projectColumns}
            pagination={false}
            size="small"
            rowKey="key"
            onChange={(_, __, sorter) => {
              const s = Array.isArray(sorter) ? sorter[0] : sorter;
              setProjectSortedInfo(s || {});
            }}
            data-testid="table-projects"
            data-sort-model={JSON.stringify(projectSortModel)}
          />
        </Card>
      </div>
    </div>
  );
}
