'use client';

/**
 * data_table_sortable-antd-v2-T04: Pipelines card – match the visual reference sort
 *
 * Dashboard panel with two AntD table cards ("Pipelines" and "Accounts") and a compact
 * Reference preview card to the right of Pipelines. The preview shows "Score" with a
 * downward arrow and a three-row miniature of the desired top ordering.
 * Guidance is visual-only; no text says "descending".
 *
 * Success: Pipelines sorted by Score descending. Accounts remains unsorted.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Row, Col, Typography, Space } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../../types';

const { Text } = Typography;

interface PipelineRow { key: string; name: string; stage: string; owner: string; score: number; lastContact: string; }
interface AccountRow { key: string; company: string; industry: string; revenue: number; tier: string; }

const pipelineData: PipelineRow[] = [
  { key: '1', name: 'Acme deal', stage: 'Proposal', owner: 'Li Wei', score: 92, lastContact: '2024-02-14' },
  { key: '2', name: 'TechStart', stage: 'Discovery', owner: 'Sara T.', score: 55, lastContact: '2024-02-10' },
  { key: '3', name: 'GlobalSys', stage: 'Negotiation', owner: 'James K.', score: 78, lastContact: '2024-02-12' },
  { key: '4', name: 'DataFlow', stage: 'Closed Won', owner: 'Aisha B.', score: 100, lastContact: '2024-02-08' },
  { key: '5', name: 'CloudNet', stage: 'Proposal', owner: 'Li Wei', score: 84, lastContact: '2024-02-15' },
  { key: '6', name: 'InnoLabs', stage: 'Discovery', owner: 'Sara T.', score: 30, lastContact: '2024-02-01' },
  { key: '7', name: 'QuickShip', stage: 'Negotiation', owner: 'James K.', score: 67, lastContact: '2024-02-13' },
  { key: '8', name: 'FinHub', stage: 'Proposal', owner: 'Aisha B.', score: 45, lastContact: '2024-02-06' },
];

const accountData: AccountRow[] = [
  { key: '1', company: 'Acme Corp', industry: 'Manufacturing', revenue: 48000, tier: 'Gold' },
  { key: '2', company: 'TechStart', industry: 'SaaS', revenue: 12000, tier: 'Silver' },
  { key: '3', company: 'GlobalSys', industry: 'Consulting', revenue: 95000, tier: 'Platinum' },
  { key: '4', company: 'DataFlow', industry: 'Analytics', revenue: 23000, tier: 'Gold' },
  { key: '5', company: 'CloudNet', industry: 'Infrastructure', revenue: 67000, tier: 'Platinum' },
  { key: '6', company: 'InnoLabs', industry: 'R&D', revenue: 8000, tier: 'Bronze' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [pipSort, setPipSort] = useState<SorterResult<PipelineRow>>({});
  const [accSort, setAccSort] = useState<SorterResult<AccountRow>>({});
  const successFired = useRef(false);

  const pipColumns: ColumnsType<PipelineRow> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Stage', dataIndex: 'stage', key: 'stage' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { title: 'Score', dataIndex: 'score', key: 'score', sorter: (a, b) => a.score - b.score, sortOrder: pipSort.columnKey === 'score' ? pipSort.order : null },
    { title: 'Last contact', dataIndex: 'lastContact', key: 'lastContact', sorter: (a, b) => new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime(), sortOrder: pipSort.columnKey === 'lastContact' ? pipSort.order : null },
  ];

  const accColumns: ColumnsType<AccountRow> = [
    { title: 'Company', dataIndex: 'company', key: 'company' },
    { title: 'Industry', dataIndex: 'industry', key: 'industry' },
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', sorter: (a, b) => a.revenue - b.revenue, sortOrder: accSort.columnKey === 'revenue' ? accSort.order : null, render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Tier', dataIndex: 'tier', key: 'tier' },
  ];

  const handlePipChange = (_p: unknown, _f: unknown, sorter: SorterResult<PipelineRow> | SorterResult<PipelineRow>[]) => {
    setPipSort(Array.isArray(sorter) ? sorter[0] : sorter);
  };
  const handleAccChange = (_p: unknown, _f: unknown, sorter: SorterResult<AccountRow> | SorterResult<AccountRow>[]) => {
    setAccSort(Array.isArray(sorter) ? sorter[0] : sorter);
  };

  useEffect(() => {
    if (successFired.current) return;
    const pipOk = pipSort.columnKey === 'score' && pipSort.order === 'descend';
    const accOk = !accSort.columnKey || !accSort.order;
    if (pipOk && accOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [pipSort, accSort, onSuccess]);

  const pipSortModel: SortModel = pipSort.columnKey && pipSort.order
    ? [{ column_key: String(pipSort.columnKey), direction: pipSort.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];
  const accSortModel: SortModel = accSort.columnKey && accSort.order
    ? [{ column_key: String(accSort.columnKey), direction: accSort.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <div style={{ position: 'absolute', top: 24, right: 24, width: 900 }}>
      <Row gutter={12}>
        <Col span={10}>
          <Card size="small">
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Pipelines</Text>
            <Table<PipelineRow> dataSource={pipelineData} columns={pipColumns} pagination={false} size="small" rowKey="key" onChange={handlePipChange} data-testid="table-pipelines" data-sort-model={JSON.stringify(pipSortModel)} />
          </Card>
        </Col>

        <Col span={4}>
          <Card size="small" style={{ background: '#f5f5f5' }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Reference preview</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6, fontWeight: 600, fontSize: 12 }}>
              <span>Score</span>
              <ArrowDownOutlined style={{ fontSize: 10 }} />
            </div>
            <div style={{ fontSize: 11, lineHeight: '18px' }}>
              <div>1. DataFlow — 100</div>
              <div>2. Acme deal — 92</div>
              <div>3. CloudNet — 84</div>
            </div>
          </Card>
        </Col>

        <Col span={10}>
          <Card size="small">
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Accounts</Text>
            <Table<AccountRow> dataSource={accountData} columns={accColumns} pagination={false} size="small" rowKey="key" onChange={handleAccChange} data-testid="table-accounts" data-sort-model={JSON.stringify(accSortModel)} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
