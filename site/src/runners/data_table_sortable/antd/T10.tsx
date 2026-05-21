'use client';

/**
 * data_table_sortable-antd-T10: Modal audit log - open overlay and sort Event time newest→oldest (dark)
 *
 * Dark theme scene where the target sortable table is inside a modal overlay.
 * - Main page shows a settings panel with a button "Open Audit Log".
 * - Clicking opens an Ant Design Modal with a compact Table.
 * - Columns: Event, Actor, Event time, IP address.
 * - Initial state: unsorted.
 *
 * Distractors: "Recent alerts" list in background, Close/Cancel buttons in modal.
 * Success: Modal is open and Event time is sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, List } from 'antd';
import { AuditOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface AuditLogData {
  key: string;
  event: string;
  actor: string;
  eventTime: string;
  ipAddress: string;
}

const auditLogData: AuditLogData[] = [
  { key: '1', event: 'User login', actor: 'alice@company.com', eventTime: '2024-02-15 09:30:15', ipAddress: '192.168.1.100' },
  { key: '2', event: 'Password changed', actor: 'bob@company.com', eventTime: '2024-02-15 08:45:22', ipAddress: '192.168.1.101' },
  { key: '3', event: 'Settings updated', actor: 'admin@company.com', eventTime: '2024-02-15 10:15:08', ipAddress: '192.168.1.1' },
  { key: '4', event: 'User logout', actor: 'carol@company.com', eventTime: '2024-02-14 17:30:45', ipAddress: '192.168.1.102' },
  { key: '5', event: 'API key created', actor: 'david@company.com', eventTime: '2024-02-15 11:00:00', ipAddress: '192.168.1.103' },
  { key: '6', event: 'Permission granted', actor: 'admin@company.com', eventTime: '2024-02-14 14:20:33', ipAddress: '192.168.1.1' },
  { key: '7', event: 'User login', actor: 'emma@company.com', eventTime: '2024-02-15 07:55:12', ipAddress: '192.168.1.104' },
  { key: '8', event: 'Export data', actor: 'frank@company.com', eventTime: '2024-02-14 16:45:50', ipAddress: '192.168.1.105' },
];

const recentAlerts = [
  'System update scheduled for 2024-02-20',
  'New security policy in effect',
  'Maintenance window: Sunday 2am-4am',
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sortedInfo, setSortedInfo] = useState<SorterResult<AuditLogData>>({});

  const columns: ColumnsType<AuditLogData> = [
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Actor', dataIndex: 'actor', key: 'actor' },
    {
      title: 'Event time',
      dataIndex: 'eventTime',
      key: 'event_time',
      sorter: (a, b) => new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime(),
      sortOrder: sortedInfo.columnKey === 'event_time' ? sortedInfo.order : null,
    },
    { title: 'IP address', dataIndex: 'ipAddress', key: 'ipAddress' },
  ];

  const handleChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<AuditLogData> | SorterResult<AuditLogData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(singleSorter || {});
  };

  // Check success condition: modal open AND Event time sorted descending
  useEffect(() => {
    if (modalOpen && sortedInfo.columnKey === 'event_time' && sortedInfo.order === 'descend') {
      onSuccess();
    }
  }, [modalOpen, sortedInfo, onSuccess]);

  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <div style={{ width: 600 }}>
      <Card title="Settings">
        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            icon={<AuditOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Open Audit Log
          </Button>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Recent alerts</div>
          <List
            size="small"
            bordered
            dataSource={recentAlerts}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </div>
      </Card>

      <Modal
        title="Audit Log"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
        ]}
        width={700}
        data-overlay-type="modal"
        data-overlay-label="Audit Log"
      >
        <Table
          dataSource={auditLogData}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="key"
          onChange={handleChange}
          data-testid="table-audit-log"
          data-sort-model={JSON.stringify(sortModel)}
        />
      </Modal>
    </div>
  );
}
