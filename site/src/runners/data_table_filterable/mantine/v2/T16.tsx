'use client';

/**
 * data_table_filterable-mantine-v2-T16: Leads surface – clear stale owner, then exact stage-country pair
 *
 * An inline_surface CRM workspace with two Mantine DataTable cards: "Leads" and "Accounts".
 * Leads starts with Owner=Maya already applied. The task: clear the Owner filter, then apply
 * Stage=Negotiation AND Country=Canada. Accounts must remain unfiltered. Explicit Apply popovers.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Select, Button, Popover, Stack, Group, Badge } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../../types';

interface LeadRow {
  id: string;
  name: string;
  owner: string;
  stage: string;
  country: string;
}

const ownerOptions = ['All', 'Maya', 'Raj', 'Sana', 'Tom'];
const stageOptions = ['All', 'Prospecting', 'Qualification', 'Negotiation', 'Closed Won', 'Closed Lost'];
const countryOptions = ['All', 'USA', 'Canada', 'UK', 'Germany', 'Australia', 'Brazil'];

const leadsData: LeadRow[] = [
  { id: 'l1', name: 'Acme Corp', owner: 'Maya', stage: 'Negotiation', country: 'Canada' },
  { id: 'l2', name: 'Beta Ltd', owner: 'Raj', stage: 'Prospecting', country: 'USA' },
  { id: 'l3', name: 'Gamma Inc', owner: 'Maya', stage: 'Qualification', country: 'UK' },
  { id: 'l4', name: 'Delta SA', owner: 'Sana', stage: 'Negotiation', country: 'Canada' },
  { id: 'l5', name: 'Epsilon Co', owner: 'Tom', stage: 'Closed Won', country: 'Germany' },
  { id: 'l6', name: 'Zeta Pty', owner: 'Maya', stage: 'Negotiation', country: 'Australia' },
];

const accountsData: LeadRow[] = [
  { id: 'a1', name: 'Omega Corp', owner: 'Raj', stage: 'Closed Won', country: 'USA' },
  { id: 'a2', name: 'Sigma Ltd', owner: 'Maya', stage: 'Qualification', country: 'Canada' },
  { id: 'a3', name: 'Tau Inc', owner: 'Sana', stage: 'Prospecting', country: 'Brazil' },
];

interface TFilters {
  owner: string;
  stage: string;
  country: string;
}

function buildModel(tableId: string, f: TFilters): FilterModel {
  const cols: FilterModel['column_filters'] = [];
  if (f.owner !== 'All') cols.push({ column: 'Owner', operator: 'equals', value: f.owner });
  if (f.stage !== 'All') cols.push({ column: 'Stage', operator: 'equals', value: f.stage });
  if (f.country !== 'All') cols.push({ column: 'Country', operator: 'equals', value: f.country });
  return { table_id: tableId, logic_operator: 'AND', global_filter: null, column_filters: cols };
}

function FilterPopover({
  label,
  options,
  current,
  onApply,
}: {
  label: string;
  options: string[];
  current: string;
  onApply: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(current);
  return (
    <Group gap={4}>
      {label}
      <Popover opened={open} onChange={setOpen} position="bottom" withArrow closeOnClickOutside={false}>
        <Popover.Target>
          <Badge
            size="xs"
            variant={current !== 'All' ? 'filled' : 'outline'}
            style={{ cursor: 'pointer' }}
            onClick={() => { setPending(current); setOpen(o => !o); }}
          >
            ▼
          </Badge>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="xs" style={{ width: 160 }}>
            <Select size="xs" data={options} value={pending} onChange={v => setPending(v || 'All')} />
            <Group gap="xs">
              <Button size="xs" variant="subtle" onClick={() => { onApply('All'); setOpen(false); }}>
                Reset
              </Button>
              <Button size="xs" onClick={() => { onApply(pending); setOpen(false); }}>
                Apply
              </Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}

function CRMTable({
  title,
  data,
  filters,
  onFilterChange,
  testId,
  tableId,
}: {
  title: string;
  data: LeadRow[];
  filters: TFilters;
  onFilterChange: (f: TFilters) => void;
  testId: string;
  tableId: string;
}) {
  const filtered = data.filter(r => {
    if (filters.owner !== 'All' && r.owner !== filters.owner) return false;
    if (filters.stage !== 'All' && r.stage !== filters.stage) return false;
    if (filters.country !== 'All' && r.country !== filters.country) return false;
    return true;
  });

  return (
    <Card shadow="xs" padding="sm" radius="sm" withBorder style={{ flex: 1 }}>
      <Text fw={600} size="sm" mb="xs">{title}</Text>
      <Table
        highlightOnHover
        data-testid={testId}
        data-filter-model={JSON.stringify(buildModel(tableId, filters))}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>
              <FilterPopover
                label="Owner"
                options={ownerOptions}
                current={filters.owner}
                onApply={v => onFilterChange({ ...filters, owner: v })}
              />
            </Table.Th>
            <Table.Th>
              <FilterPopover
                label="Stage"
                options={stageOptions}
                current={filters.stage}
                onApply={v => onFilterChange({ ...filters, stage: v })}
              />
            </Table.Th>
            <Table.Th>
              <FilterPopover
                label="Country"
                options={countryOptions}
                current={filters.country}
                onApply={v => onFilterChange({ ...filters, country: v })}
              />
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered.map(r => (
            <Table.Tr key={r.id}>
              <Table.Td>{r.name}</Table.Td>
              <Table.Td>{r.owner}</Table.Td>
              <Table.Td>{r.stage}</Table.Td>
              <Table.Td>{r.country}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}

export default function T16({ onSuccess }: TaskComponentProps) {
  const [leadsF, setLeadsF] = useState<TFilters>({ owner: 'Maya', stage: 'All', country: 'All' });
  const [accountsF, setAccountsF] = useState<TFilters>({ owner: 'All', stage: 'All', country: 'All' });
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const accClean = accountsF.owner === 'All' && accountsF.stage === 'All' && accountsF.country === 'All';
    if (
      leadsF.owner === 'All' &&
      leadsF.stage === 'Negotiation' &&
      leadsF.country === 'Canada' &&
      accClean
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [leadsF, accountsF, onSuccess]);

  return (
    <div style={{ width: 920, padding: 16 }}>
      <Text fw={600} size="md" mb="sm">CRM Workspace</Text>
      <Group align="flex-start" gap="md">
        <CRMTable
          title="Leads"
          data={leadsData}
          filters={leadsF}
          onFilterChange={setLeadsF}
          testId="table-leads"
          tableId="leads"
        />
        <CRMTable
          title="Accounts"
          data={accountsData}
          filters={accountsF}
          onFilterChange={setAccountsF}
          testId="table-accounts"
          tableId="accounts"
        />
      </Group>
    </div>
  );
}
