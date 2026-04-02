'use client';

/**
 * data_table_sortable-antd-T03: Shipments - clear the active ETA sort
 *
 * Single Ant Design Table in an isolated card titled "Shipments".
 * - Columns: Tracking #, Carrier, ETA, Destination, Status.
 * - Sorting is enabled on ETA and Status.
 * - Initial state: ETA is pre-sorted in ascending order.
 * - The sorter toggle cycles through ascend → descend → unsorted.
 *
 * Distractors: a small legend below the table explaining status colors.
 * Success: No column is sorted (sort_model is empty).
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface ShipmentData {
  key: string;
  trackingNum: string;
  carrier: string;
  eta: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Delayed';
}

const shipmentsData: ShipmentData[] = [
  { key: '1', trackingNum: 'TRK-8801', carrier: 'FedEx', eta: '2024-02-18', destination: 'New York', status: 'In Transit' },
  { key: '2', trackingNum: 'TRK-8802', carrier: 'UPS', eta: '2024-02-15', destination: 'Los Angeles', status: 'Delivered' },
  { key: '3', trackingNum: 'TRK-8803', carrier: 'DHL', eta: '2024-02-20', destination: 'Chicago', status: 'In Transit' },
  { key: '4', trackingNum: 'TRK-8804', carrier: 'USPS', eta: '2024-02-12', destination: 'Houston', status: 'Delayed' },
  { key: '5', trackingNum: 'TRK-8805', carrier: 'FedEx', eta: '2024-02-25', destination: 'Phoenix', status: 'In Transit' },
  { key: '6', trackingNum: 'TRK-8806', carrier: 'UPS', eta: '2024-02-14', destination: 'Philadelphia', status: 'Delivered' },
  { key: '7', trackingNum: 'TRK-8807', carrier: 'DHL', eta: '2024-02-22', destination: 'San Antonio', status: 'In Transit' },
  { key: '8', trackingNum: 'TRK-8808', carrier: 'USPS', eta: '2024-02-10', destination: 'San Diego', status: 'Delivered' },
  { key: '9', trackingNum: 'TRK-8809', carrier: 'FedEx', eta: '2024-02-28', destination: 'Dallas', status: 'Delayed' },
  { key: '10', trackingNum: 'TRK-8810', carrier: 'UPS', eta: '2024-02-16', destination: 'San Jose', status: 'In Transit' },
];

const statusColors: Record<ShipmentData['status'], string> = {
  'In Transit': 'blue',
  'Delivered': 'green',
  'Delayed': 'red',
};

export default function T03({ onSuccess }: TaskComponentProps) {
  // Start with ETA sorted ascending
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ShipmentData>>({
    columnKey: 'eta',
    order: 'ascend',
  });

  const columns: ColumnsType<ShipmentData> = [
    { title: 'Tracking #', dataIndex: 'trackingNum', key: 'trackingNum' },
    { title: 'Carrier', dataIndex: 'carrier', key: 'carrier' },
    {
      title: 'ETA',
      dataIndex: 'eta',
      key: 'eta',
      sorter: (a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime(),
      sortOrder: sortedInfo.columnKey === 'eta' ? sortedInfo.order : null,
      sortDirections: ['ascend', 'descend', null] as const,
    },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
      sortDirections: ['ascend', 'descend', null] as const,
      render: (status: ShipmentData['status']) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
  ];

  const handleChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<ShipmentData> | SorterResult<ShipmentData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(singleSorter || {});
  };

  // Check success condition: no sort active
  useEffect(() => {
    if (!sortedInfo.columnKey || !sortedInfo.order) {
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <Card style={{ width: 800 }}>
      <div style={{ marginBottom: 16, fontWeight: 500 }}>Shipments</div>
      <Table
        dataSource={shipmentsData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onChange={handleChange}
        data-testid="table-shipments"
        data-sort-model={JSON.stringify(sortModel)}
      />
      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        <span style={{ marginRight: 16 }}><Tag color="blue">In Transit</Tag> Package is on the way</span>
        <span style={{ marginRight: 16 }}><Tag color="green">Delivered</Tag> Package delivered</span>
        <span><Tag color="red">Delayed</Tag> Delivery delayed</span>
      </div>
    </Card>
  );
}
