'use client';

/**
 * link-antd-T09: Open a specific report from a dense table of View links
 * 
 * setup_description:
 * The link component is embedded in a realistic table_cell layout: a compact Reports
 * table is centered in the viewport. The table has 5 rows and 3 columns: "Report",
 * "Updated", and "Action".
 * 
 * In the "Action" column, each row contains an Ant Design Typography.Link labeled
 * exactly "View" (identical text across rows). Row labels in the first column
 * differentiate the target ("Q4 Finance"). Spacing mode is compact, making row height
 * smaller and targets closer together.
 * 
 * success_trigger:
 * - The "View" link in the "Q4 Finance" row (data-testid="report-q4-view") was activated.
 * - The current route pathname equals "/reports/q4-finance".
 * - The report detail header shows "Q4 Finance".
 */

import React, { useState } from 'react';
import { Card, Typography, Table } from 'antd';
import type { TaskComponentProps } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Link, Title } = Typography;

interface ReportRow {
  key: string;
  name: string;
  updated: string;
  path: string;
  testId: string;
}

const reports: ReportRow[] = [
  { key: 'q1', name: 'Q1 Summary', updated: '2024-03-15', path: '/reports/q1-summary', testId: 'report-q1-view' },
  { key: 'q2', name: 'Q2 Summary', updated: '2024-06-20', path: '/reports/q2-summary', testId: 'report-q2-view' },
  { key: 'q3', name: 'Q3 Summary', updated: '2024-09-18', path: '/reports/q3-summary', testId: 'report-q3-view' },
  { key: 'q4', name: 'Q4 Finance', updated: '2024-12-10', path: '/reports/q4-finance', testId: 'report-q4-view' },
  { key: 'annual', name: 'Annual Review', updated: '2025-01-05', path: '/reports/annual-review', testId: 'report-annual-view' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/reports');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  const handleViewClick = (report: ReportRow) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute(report.path);
    setSelectedReport(report.name);
    
    if (report.key === 'q4') {
      setActivated(true);
      onSuccess();
    }
  };

  const columns: ColumnsType<ReportRow> = [
    {
      title: 'Report',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Link
          onClick={handleViewClick(record)}
          data-testid={record.testId}
          style={{ cursor: 'pointer' }}
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <Card 
      title={selectedReport || 'Reports'} 
      style={{ width: 500 }}
      styles={{ body: { padding: 0 } }}
    >
      {selectedReport && (
        <div style={{ padding: 16, background: '#f6ffed', borderBottom: '1px solid #b7eb8f' }}>
          <Title level={5} style={{ margin: 0 }} data-testid="detail-title">
            {selectedReport}
          </Title>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={reports}
        pagination={false}
        size="small"
        style={{ margin: 0 }}
      />
    </Card>
  );
}
