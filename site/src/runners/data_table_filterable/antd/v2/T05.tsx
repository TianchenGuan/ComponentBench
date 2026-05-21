'use client';

/**
 * data_table_filterable-antd-v2-T05: Projects board – configure then apply owner filter
 *
 * An admin-style inline_surface with one AntD Table "Projects", a metrics strip, and a read-only
 * summary card. The Owner column has a customized filterDropdown with a search input, a long
 * checklist, and Reset / Apply filters buttons. Target: Owner = Platform (applied).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Input, Button, Checkbox, Space, Statistic, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../../types';

interface ProjectRow {
  key: string;
  name: string;
  owner: string;
  status: string;
  progress: number;
}

const ownerOptions = [
  'Analytics', 'Backend', 'Core', 'Data', 'Design',
  'DevOps', 'Frontend', 'Growth', 'Infra', 'Mobile',
  'Platform', 'QA', 'Research', 'Security', 'Support',
];

const projectsData: ProjectRow[] = [
  { key: '1', name: 'Dashboard Redesign', owner: 'Frontend', status: 'Active', progress: 60 },
  { key: '2', name: 'API v3 Migration', owner: 'Backend', status: 'Active', progress: 40 },
  { key: '3', name: 'Auth Service', owner: 'Platform', status: 'Active', progress: 80 },
  { key: '4', name: 'CI Pipeline', owner: 'DevOps', status: 'Paused', progress: 25 },
  { key: '5', name: 'Mobile SDK', owner: 'Mobile', status: 'Active', progress: 55 },
  { key: '6', name: 'Data Lake Setup', owner: 'Data', status: 'Active', progress: 70 },
  { key: '7', name: 'Feature Flags', owner: 'Platform', status: 'Active', progress: 90 },
  { key: '8', name: 'Load Testing', owner: 'QA', status: 'Completed', progress: 100 },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [appliedOwner, setAppliedOwner] = useState<string | null>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    if (appliedOwner === 'Platform') {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedOwner, onSuccess]);

  const filteredData = appliedOwner
    ? projectsData.filter(p => p.owner === appliedOwner)
    : projectsData;

  const columns: ColumnsType<ProjectRow> = [
    { title: 'Project', dataIndex: 'name', key: 'name', width: 180 },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 130,
      filtered: !!appliedOwner,
      filterDropdown: ({ confirm }: FilterDropdownProps) => {
        const [search, setSearch] = useState('');
        const [selected, setSelected] = useState<string | null>(null);
        const visible = ownerOptions.filter(o => o.toLowerCase().includes(search.toLowerCase()));
        return (
          <div style={{ padding: 8, width: 200 }}>
            <Input
              placeholder="Search owners…"
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: 8 }}
              data-testid="owner-search"
            />
            <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 8 }}>
              {visible.map(o => (
                <div key={o} style={{ padding: '2px 0' }}>
                  <Checkbox
                    checked={selected === o}
                    onChange={() => setSelected(selected === o ? null : o)}
                  >
                    {o}
                  </Checkbox>
                </div>
              ))}
            </div>
            <Space>
              <Button
                size="small"
                onClick={() => { setSelected(null); setAppliedOwner(null); confirm({ closeDropdown: true }); }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => { setAppliedOwner(selected); confirm({ closeDropdown: true }); }}
              >
                Apply filters
              </Button>
            </Space>
          </div>
        );
      },
    },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: 90,
      render: (v: number) => `${v}%`,
    },
  ];

  const filterModel: FilterModel = {
    table_id: 'projects',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: appliedOwner
      ? [{ column: 'Owner', operator: 'equals' as const, value: appliedOwner }]
      : [],
  };

  return (
    <div style={{ width: 780, padding: 16 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Statistic title="Active" value={6} /></Col>
        <Col span={8}><Statistic title="Paused" value={1} /></Col>
        <Col span={8}><Statistic title="Completed" value={1} /></Col>
      </Row>

      <Card size="small" style={{ marginBottom: 12, background: '#fafafa' }}>
        <span style={{ fontSize: 12, color: '#888' }}>Summary: 8 projects across 8 teams.</span>
      </Card>

      <Card size="small" title="Projects">
        <Table<ProjectRow>
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="key"
          data-testid="table-projects"
          data-filter-model={JSON.stringify(filterModel)}
        />
      </Card>
    </div>
  );
}
