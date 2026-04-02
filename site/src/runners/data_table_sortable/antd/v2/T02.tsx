'use client';

/**
 * data_table_sortable-antd-v2-T02: Expense Claims – replace stale sort in the correct card
 *
 * Dashboard panel near bottom-right with two AntD table cards: "Expense Claims" (pre-sorted
 * by Status ascending) and "Travel Requests" (unsorted). Both have a Submitted date column.
 * Single-sort only: activating a new sort clears the old one in that card.
 *
 * Success: Expense Claims sorted by Submitted descending (Status no longer sorted).
 *          Travel Requests remains unsorted.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Row, Col, Typography, Tag } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../../types';

const { Text } = Typography;

interface ClaimRow { key: string; claimId: string; employee: string; amount: number; submitted: string; status: string; }
interface TravelRow { key: string; requestId: string; traveler: string; destination: string; submitted: string; status: string; }

const claimsData: ClaimRow[] = [
  { key: '1', claimId: 'EC-201', employee: 'Alice Chen', amount: 342.50, submitted: '2024-02-10', status: 'Approved' },
  { key: '2', claimId: 'EC-202', employee: 'Bob Torres', amount: 128.00, submitted: '2024-02-14', status: 'Pending' },
  { key: '3', claimId: 'EC-203', employee: 'Carol Diaz', amount: 890.25, submitted: '2024-01-28', status: 'Rejected' },
  { key: '4', claimId: 'EC-204', employee: 'Dan Okafor', amount: 55.00, submitted: '2024-02-18', status: 'Approved' },
  { key: '5', claimId: 'EC-205', employee: 'Eva Singh', amount: 1200.00, submitted: '2024-02-05', status: 'Pending' },
  { key: '6', claimId: 'EC-206', employee: 'Frank Liu', amount: 410.75, submitted: '2024-02-22', status: 'Approved' },
  { key: '7', claimId: 'EC-207', employee: 'Grace Kim', amount: 67.50, submitted: '2024-01-30', status: 'Rejected' },
  { key: '8', claimId: 'EC-208', employee: 'Hiro Tanaka', amount: 275.00, submitted: '2024-02-12', status: 'Pending' },
];

const travelData: TravelRow[] = [
  { key: '1', requestId: 'TR-101', traveler: 'Alice Chen', destination: 'New York', submitted: '2024-02-08', status: 'Approved' },
  { key: '2', requestId: 'TR-102', traveler: 'Bob Torres', destination: 'London', submitted: '2024-02-15', status: 'Pending' },
  { key: '3', requestId: 'TR-103', traveler: 'Carol Diaz', destination: 'Tokyo', submitted: '2024-01-25', status: 'Approved' },
  { key: '4', requestId: 'TR-104', traveler: 'Dan Okafor', destination: 'Berlin', submitted: '2024-02-20', status: 'Pending' },
  { key: '5', requestId: 'TR-105', traveler: 'Eva Singh', destination: 'Paris', submitted: '2024-02-01', status: 'Rejected' },
  { key: '6', requestId: 'TR-106', traveler: 'Frank Liu', destination: 'Sydney', submitted: '2024-02-17', status: 'Approved' },
];

const statusColor = (s: string) => s === 'Approved' ? 'green' : s === 'Pending' ? 'gold' : 'red';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [claimSort, setClaimSort] = useState<SorterResult<ClaimRow>>({ columnKey: 'status', order: 'ascend' });
  const [travelSort, setTravelSort] = useState<SorterResult<TravelRow>>({});
  const successFired = useRef(false);

  const claimColumns: ColumnsType<ClaimRow> = [
    { title: 'Claim ID', dataIndex: 'claimId', key: 'claimId', width: 90 },
    { title: 'Employee', dataIndex: 'employee', key: 'employee' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Submitted', dataIndex: 'submitted', key: 'submitted', sorter: (a, b) => new Date(a.submitted).getTime() - new Date(b.submitted).getTime(), sortOrder: claimSort.columnKey === 'submitted' ? claimSort.order : null },
    { title: 'Status', dataIndex: 'status', key: 'status', sorter: (a, b) => a.status.localeCompare(b.status), sortOrder: claimSort.columnKey === 'status' ? claimSort.order : null, render: (v: string) => <Tag color={statusColor(v)}>{v}</Tag> },
  ];

  const travelColumns: ColumnsType<TravelRow> = [
    { title: 'Request ID', dataIndex: 'requestId', key: 'requestId', width: 90 },
    { title: 'Traveler', dataIndex: 'traveler', key: 'traveler' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Submitted', dataIndex: 'submitted', key: 'submitted', sorter: (a, b) => new Date(a.submitted).getTime() - new Date(b.submitted).getTime(), sortOrder: travelSort.columnKey === 'submitted' ? travelSort.order : null },
    { title: 'Status', dataIndex: 'status', key: 'status', sorter: (a, b) => a.status.localeCompare(b.status), sortOrder: travelSort.columnKey === 'status' ? travelSort.order : null, render: (v: string) => <Tag color={statusColor(v)}>{v}</Tag> },
  ];

  const handleClaimChange = (_p: unknown, _f: unknown, sorter: SorterResult<ClaimRow> | SorterResult<ClaimRow>[]) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    setClaimSort(s || {});
  };

  const handleTravelChange = (_p: unknown, _f: unknown, sorter: SorterResult<TravelRow> | SorterResult<TravelRow>[]) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    setTravelSort(s || {});
  };

  useEffect(() => {
    if (successFired.current) return;
    const claimOk = claimSort.columnKey === 'submitted' && claimSort.order === 'descend';
    const travelOk = !travelSort.columnKey || !travelSort.order;
    if (claimOk && travelOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [claimSort, travelSort, onSuccess]);

  const claimSortModel: SortModel = claimSort.columnKey && claimSort.order
    ? [{ column_key: String(claimSort.columnKey), direction: claimSort.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];
  const travelSortModel: SortModel = travelSort.columnKey && travelSort.order
    ? [{ column_key: String(travelSort.columnKey), direction: travelSort.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <div style={{ position: 'absolute', bottom: 24, right: 24, width: 820 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small">
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Expense Claims</Text>
            <Table<ClaimRow> dataSource={claimsData} columns={claimColumns} pagination={false} size="small" rowKey="key" onChange={handleClaimChange} data-testid="table-expense-claims" data-sort-model={JSON.stringify(claimSortModel)} />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Travel Requests</Text>
            <Table<TravelRow> dataSource={travelData} columns={travelColumns} pagination={false} size="small" rowKey="key" onChange={handleTravelChange} data-testid="table-travel-requests" data-sort-model={JSON.stringify(travelSortModel)} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
