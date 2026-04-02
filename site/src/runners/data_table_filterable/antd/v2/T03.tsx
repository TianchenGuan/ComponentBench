'use client';

/**
 * data_table_filterable-antd-v2-T03: Audit modal – created date range with apply
 *
 * A modal_flow page. Clicking "Audit Events" opens a centred AntD Modal containing a compact table
 * "Audit Events". The Created column has a custom filterDropdown with a date-range picker and an
 * "Apply filters" button. Target: Created between 2025-04-01 and 2025-06-30 inclusive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Modal, Button, Card, DatePicker, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../../types';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface AuditRow {
  key: string;
  eventId: string;
  actor: string;
  action: string;
  created: string;
}

const auditData: AuditRow[] = [
  { key: '1', eventId: 'EVT-001', actor: 'admin', action: 'create_user', created: '2025-02-10' },
  { key: '2', eventId: 'EVT-002', actor: 'jdoe', action: 'update_role', created: '2025-03-18' },
  { key: '3', eventId: 'EVT-003', actor: 'admin', action: 'delete_group', created: '2025-04-05' },
  { key: '4', eventId: 'EVT-004', actor: 'mchen', action: 'login', created: '2025-05-12' },
  { key: '5', eventId: 'EVT-005', actor: 'admin', action: 'export_data', created: '2025-06-20' },
  { key: '6', eventId: 'EVT-006', actor: 'slee', action: 'update_policy', created: '2025-06-30' },
  { key: '7', eventId: 'EVT-007', actor: 'admin', action: 'create_user', created: '2025-07-04' },
  { key: '8', eventId: 'EVT-008', actor: 'rkim', action: 'login', created: '2025-08-15' },
];

function fmt(d: Dayjs): string {
  return d.format('YYYY-MM-DD');
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [appliedRange, setAppliedRange] = useState<[string, string] | null>(null);
  const [pendingRange, setPendingRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const successFiredRef = useRef(false);

  const filteredData = auditData.filter(r => {
    if (!appliedRange) return true;
    return r.created >= appliedRange[0] && r.created <= appliedRange[1];
  });

  useEffect(() => {
    if (successFiredRef.current) return;
    if (appliedRange && appliedRange[0] === '2025-04-01' && appliedRange[1] === '2025-06-30') {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedRange, onSuccess]);

  const columns: ColumnsType<AuditRow> = [
    { title: 'Event ID', dataIndex: 'eventId', key: 'eventId', width: 100 },
    { title: 'Actor', dataIndex: 'actor', key: 'actor', width: 100 },
    { title: 'Action', dataIndex: 'action', key: 'action', width: 130 },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      width: 130,
      filtered: !!appliedRange,
      filterDropdown: ({ confirm }: FilterDropdownProps) => (
        <div style={{ padding: 12 }}>
          <RangePicker
            value={pendingRange[0] && pendingRange[1] ? [pendingRange[0], pendingRange[1]] : undefined}
            onChange={(dates) => {
              if (dates) setPendingRange([dates[0], dates[1]]);
              else setPendingRange([null, null]);
            }}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                if (pendingRange[0] && pendingRange[1]) {
                  setAppliedRange([fmt(pendingRange[0]), fmt(pendingRange[1])]);
                }
                confirm({ closeDropdown: true });
              }}
            >
              Apply filters
            </Button>
            <Button
              size="small"
              onClick={() => {
                setPendingRange([null, null]);
                setAppliedRange(null);
                confirm({ closeDropdown: true });
              }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
    },
  ];

  const filterModel: FilterModel = {
    table_id: 'audit_events',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: appliedRange
      ? [{ column: 'Created', operator: 'date_between_inclusive' as const, value: { start: appliedRange[0], end: appliedRange[1] } }]
      : [],
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ width: 500, marginBottom: 16 }}>
        <p style={{ margin: 0 }}>System overview — click below to review audit events.</p>
      </Card>
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Audit Events
      </Button>

      <Modal
        title="Audit Events"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={650}
      >
        <Table<AuditRow>
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="key"
          data-testid="table-audit-events"
          data-filter-model={JSON.stringify(filterModel)}
        />
      </Modal>
    </div>
  );
}
