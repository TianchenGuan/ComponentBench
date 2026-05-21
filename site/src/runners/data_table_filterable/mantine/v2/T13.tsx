'use client';

/**
 * data_table_filterable-mantine-v2-T13: Admin dashboard – filter Users only, not Projects or Contracts
 *
 * A high-clutter dashboard_panel with three Mantine DataTable cards: "Users", "Projects", "Contracts".
 * Each card has custom header filter popovers with an Apply button. Target: Users Country=Brazil AND
 * Status=Active. Projects and Contracts must remain unfiltered.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Select, Group, Button, Popover, Stack, Badge } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../../types';

interface Row {
  id: string;
  name: string;
  country: string;
  status: string;
}

const countryOptions = ['All', 'USA', 'Canada', 'Brazil', 'UK', 'Germany', 'Japan', 'Australia'];
const statusOptions = ['All', 'Active', 'Inactive', 'Suspended', 'Pending'];

const usersData: Row[] = [
  { id: 'u1', name: 'Alice Park', country: 'USA', status: 'Active' },
  { id: 'u2', name: 'Bruno Silva', country: 'Brazil', status: 'Active' },
  { id: 'u3', name: 'Carol Xu', country: 'Japan', status: 'Inactive' },
  { id: 'u4', name: 'Diana Costa', country: 'Brazil', status: 'Suspended' },
  { id: 'u5', name: 'Eric Müller', country: 'Germany', status: 'Active' },
  { id: 'u6', name: 'Fernanda Lima', country: 'Brazil', status: 'Active' },
];

const projectsData: Row[] = [
  { id: 'p1', name: 'Project Alpha', country: 'USA', status: 'Active' },
  { id: 'p2', name: 'Project Beta', country: 'Brazil', status: 'Pending' },
  { id: 'p3', name: 'Project Gamma', country: 'UK', status: 'Active' },
];

const contractsData: Row[] = [
  { id: 'c1', name: 'Contract X', country: 'Canada', status: 'Active' },
  { id: 'c2', name: 'Contract Y', country: 'Australia', status: 'Inactive' },
  { id: 'c3', name: 'Contract Z', country: 'Brazil', status: 'Active' },
];

interface TableFilters {
  country: string;
  status: string;
}

const emptyFilters: TableFilters = { country: 'All', status: 'All' };

function buildModel(tableId: string, f: TableFilters): FilterModel {
  const cols: FilterModel['column_filters'] = [];
  if (f.country !== 'All') cols.push({ column: 'Country', operator: 'equals', value: f.country });
  if (f.status !== 'All') cols.push({ column: 'Status', operator: 'equals', value: f.status });
  return { table_id: tableId, logic_operator: 'AND', global_filter: null, column_filters: cols };
}

function FilterableCard({
  title,
  data,
  filters,
  onFiltersChange,
  testId,
  tableId,
}: {
  title: string;
  data: Row[];
  filters: TableFilters;
  onFiltersChange: (f: TableFilters) => void;
  testId: string;
  tableId: string;
}) {
  const [pendingCountry, setPendingCountry] = useState(filters.country);
  const [pendingStatus, setPendingStatus] = useState(filters.status);
  const [countryOpen, setCountryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const filtered = data.filter(r => {
    if (filters.country !== 'All' && r.country !== filters.country) return false;
    if (filters.status !== 'All' && r.status !== filters.status) return false;
    return true;
  });

  return (
    <Card shadow="xs" padding="sm" radius="sm" withBorder>
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
              <Group gap={4}>
                Country
                <Popover opened={countryOpen} onChange={setCountryOpen} position="bottom" withArrow closeOnClickOutside={false}>
                  <Popover.Target>
                    <Badge
                      size="xs"
                      variant={filters.country !== 'All' ? 'filled' : 'outline'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => { setPendingCountry(filters.country); setCountryOpen(o => !o); }}
                    >
                      ▼
                    </Badge>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Stack gap="xs" style={{ width: 160 }}>
                      <Select
                        size="xs"
                        data={countryOptions}
                        value={pendingCountry}
                        onChange={v => setPendingCountry(v || 'All')}
                      />
                      <Button
                        size="xs"
                        onClick={() => {
                          onFiltersChange({ ...filters, country: pendingCountry });
                          setCountryOpen(false);
                        }}
                      >
                        Apply
                      </Button>
                    </Stack>
                  </Popover.Dropdown>
                </Popover>
              </Group>
            </Table.Th>
            <Table.Th>
              <Group gap={4}>
                Status
                <Popover opened={statusOpen} onChange={setStatusOpen} position="bottom" withArrow closeOnClickOutside={false}>
                  <Popover.Target>
                    <Badge
                      size="xs"
                      variant={filters.status !== 'All' ? 'filled' : 'outline'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => { setPendingStatus(filters.status); setStatusOpen(o => !o); }}
                    >
                      ▼
                    </Badge>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Stack gap="xs" style={{ width: 160 }}>
                      <Select
                        size="xs"
                        data={statusOptions}
                        value={pendingStatus}
                        onChange={v => setPendingStatus(v || 'All')}
                      />
                      <Button
                        size="xs"
                        onClick={() => {
                          onFiltersChange({ ...filters, status: pendingStatus });
                          setStatusOpen(false);
                        }}
                      >
                        Apply
                      </Button>
                    </Stack>
                  </Popover.Dropdown>
                </Popover>
              </Group>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered.map(r => (
            <Table.Tr key={r.id}>
              <Table.Td>{r.name}</Table.Td>
              <Table.Td>{r.country}</Table.Td>
              <Table.Td>{r.status}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}

export default function T13({ onSuccess }: TaskComponentProps) {
  const [usersF, setUsersF] = useState<TableFilters>({ ...emptyFilters });
  const [projectsF, setProjectsF] = useState<TableFilters>({ ...emptyFilters });
  const [contractsF, setContractsF] = useState<TableFilters>({ ...emptyFilters });
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const pClean = projectsF.country === 'All' && projectsF.status === 'All';
    const cClean = contractsF.country === 'All' && contractsF.status === 'All';
    if (
      usersF.country === 'Brazil' && usersF.status === 'Active' &&
      pClean && cClean
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [usersF, projectsF, contractsF, onSuccess]);

  return (
    <div style={{ width: 820, padding: 16 }}>
      <Group mb="sm" gap="md">
        <Badge color="blue">Total Users: 6</Badge>
        <Badge color="green">Active Projects: 3</Badge>
        <Badge color="orange">Open Contracts: 3</Badge>
      </Group>

      <Stack gap="sm">
        <FilterableCard title="Users" data={usersData} filters={usersF} onFiltersChange={setUsersF} testId="table-users" tableId="users" />
        <FilterableCard title="Projects" data={projectsData} filters={projectsF} onFiltersChange={setProjectsF} testId="table-projects" tableId="projects" />
        <FilterableCard title="Contracts" data={contractsData} filters={contractsF} onFiltersChange={setContractsF} testId="table-contracts" tableId="contracts" />
      </Stack>
    </div>
  );
}
