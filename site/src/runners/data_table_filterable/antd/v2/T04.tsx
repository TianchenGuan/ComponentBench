'use client';

/**
 * data_table_filterable-antd-v2-T04: Team settings – filter Members only by two columns
 *
 * A compact settings_panel with three stacked AntD tables: "Members", "Guests", "Invites".
 * Each has Role and Active filter columns. Target: Members Role=Reviewer AND Active=Yes.
 * Guests and Invites must remain unfiltered.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Switch, Typography } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../../types';

const { Text } = Typography;

interface MemberRow {
  key: string;
  name: string;
  email: string;
  role: string;
  active: string;
}

const roleOptions = ['Admin', 'Editor', 'Reviewer', 'Viewer'];
const activeOptions = ['Yes', 'No'];

const membersData: MemberRow[] = [
  { key: 'm1', name: 'Alice Park', email: 'alice@co.io', role: 'Admin', active: 'Yes' },
  { key: 'm2', name: 'Bob Torres', email: 'bob@co.io', role: 'Reviewer', active: 'Yes' },
  { key: 'm3', name: 'Carol Xu', email: 'carol@co.io', role: 'Editor', active: 'No' },
  { key: 'm4', name: 'Derek Roy', email: 'derek@co.io', role: 'Reviewer', active: 'No' },
  { key: 'm5', name: 'Elaine Wu', email: 'elaine@co.io', role: 'Viewer', active: 'Yes' },
  { key: 'm6', name: 'Felix Cho', email: 'felix@co.io', role: 'Reviewer', active: 'Yes' },
];

const guestsData: MemberRow[] = [
  { key: 'g1', name: 'Gina Voss', email: 'gina@ext.io', role: 'Viewer', active: 'Yes' },
  { key: 'g2', name: 'Hugo Lam', email: 'hugo@ext.io', role: 'Reviewer', active: 'No' },
  { key: 'g3', name: 'Ivy Dunn', email: 'ivy@ext.io', role: 'Editor', active: 'Yes' },
];

const invitesData: MemberRow[] = [
  { key: 'i1', name: 'Jake Soto', email: 'jake@new.io', role: 'Reviewer', active: 'Yes' },
  { key: 'i2', name: 'Kim Lee', email: 'kim@new.io', role: 'Admin', active: 'No' },
  { key: 'i3', name: 'Leo Grant', email: 'leo@new.io', role: 'Viewer', active: 'Yes' },
];

function buildCols(info: Record<string, FilterValue | null>): ColumnsType<MemberRow> {
  return [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 120 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 150 },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      filters: roleOptions.map(r => ({ text: r, value: r })),
      filteredValue: info.role || null,
      onFilter: (v, rec) => rec.role === v,
      filterMultiple: false,
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: 80,
      filters: activeOptions.map(a => ({ text: a, value: a })),
      filteredValue: info.active || null,
      onFilter: (v, rec) => rec.active === v,
      filterMultiple: false,
    },
  ];
}

function toModel(tableId: string, info: Record<string, FilterValue | null>): FilterModel {
  return {
    table_id: tableId,
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(info)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: 'equals' as const,
        value: String(values![0]),
      })),
  };
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [membersFilter, setMembersFilter] = useState<Record<string, FilterValue | null>>({});
  const [guestsFilter, setGuestsFilter] = useState<Record<string, FilterValue | null>>({});
  const [invitesFilter, setInvitesFilter] = useState<Record<string, FilterValue | null>>({});
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const mRole = membersFilter.role;
    const mActive = membersFilter.active;
    const gHas = Object.values(guestsFilter).some(v => v && v.length > 0);
    const iHas = Object.values(invitesFilter).some(v => v && v.length > 0);
    if (
      mRole && mRole.length === 1 && mRole[0] === 'Reviewer' &&
      mActive && mActive.length === 1 && mActive[0] === 'Yes' &&
      !gHas && !iHas
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [membersFilter, guestsFilter, invitesFilter, onSuccess]);

  const tableProps = { pagination: false as const, size: 'small' as const, rowKey: 'key' as const };

  return (
    <div style={{ width: 640, padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Text strong>Team Settings</Text>
        <Switch size="small" /> <Text type="secondary" style={{ fontSize: 12 }}>Notifications</Text>
        <Switch size="small" /> <Text type="secondary" style={{ fontSize: 12 }}>Auto-approve</Text>
      </div>

      <Card size="small" title="Members" style={{ marginBottom: 8 }}>
        <Table<MemberRow>
          dataSource={membersData}
          columns={buildCols(membersFilter)}
          {...tableProps}
          onChange={(_p: TablePaginationConfig, f: Record<string, FilterValue | null>) => setMembersFilter(f)}
          data-testid="table-members"
          data-filter-model={JSON.stringify(toModel('members', membersFilter))}
        />
      </Card>

      <Card size="small" title="Guests" style={{ marginBottom: 8 }}>
        <Table<MemberRow>
          dataSource={guestsData}
          columns={buildCols(guestsFilter)}
          {...tableProps}
          onChange={(_p: TablePaginationConfig, f: Record<string, FilterValue | null>) => setGuestsFilter(f)}
          data-testid="table-guests"
          data-filter-model={JSON.stringify(toModel('guests', guestsFilter))}
        />
      </Card>

      <Card size="small" title="Invites">
        <Table<MemberRow>
          dataSource={invitesData}
          columns={buildCols(invitesFilter)}
          {...tableProps}
          onChange={(_p: TablePaginationConfig, f: Record<string, FilterValue | null>) => setInvitesFilter(f)}
          data-testid="table-invites"
          data-filter-model={JSON.stringify(toModel('invites', invitesFilter))}
        />
      </Card>
    </div>
  );
}
