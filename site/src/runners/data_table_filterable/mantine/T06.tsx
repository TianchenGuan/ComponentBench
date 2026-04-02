'use client';

/**
 * data_table_filterable-mantine-T06: Admin: Filter Users table (not Projects)
 *
 * Scene context: theme=light; spacing=comfortable; layout=form_section; placement=center; scale=default;
 * instances=2; guidance=text; clutter=low.
 *
 * Layout: form_section with low clutter (page title, short help text).
 *
 * Two Mantine composite filterable tables are shown one after another: "Users" first and "Projects" second. Each has a filter
 * toolbar with a Country Select.
 *
 * Placement: centered; default scale; comfortable spacing.
 *
 * Initial state: no filters active in either table.
 *
 * Disambiguation: only the Users table's Country filter should be set to Brazil.
 *
 * Success: Users table has Country equals Brazil. Projects table remains unfiltered.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Select, Group, Title, Box } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../types';

interface UserData {
  id: string;
  name: string;
  email: string;
  country: string;
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
  country: string;
}

const usersData: UserData[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', country: 'USA' },
  { id: '2', name: 'Bob Silva', email: 'bob@example.com', country: 'Brazil' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', country: 'UK' },
  { id: '4', name: 'David Santos', email: 'david@example.com', country: 'Brazil' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', country: 'Germany' },
];

const projectsData: ProjectData[] = [
  { id: '1', name: 'Project Alpha', status: 'Active', country: 'USA' },
  { id: '2', name: 'Project Beta', status: 'Planning', country: 'Brazil' },
  { id: '3', name: 'Project Gamma', status: 'Active', country: 'Japan' },
  { id: '4', name: 'Project Delta', status: 'On Hold', country: 'Germany' },
  { id: '5', name: 'Project Epsilon', status: 'Active', country: 'Brazil' },
];

const countryOptions = [
  { value: 'All', label: 'All' },
  { value: 'USA', label: 'USA' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'UK', label: 'UK' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Japan', label: 'Japan' },
  { value: 'France', label: 'France' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [usersCountryFilter, setUsersCountryFilter] = useState<string | null>('All');
  const [projectsCountryFilter, setProjectsCountryFilter] = useState<string | null>('All');
  const successFiredRef = useRef(false);

  // Filter users data
  const filteredUsersData = usersData.filter(user => {
    if (usersCountryFilter && usersCountryFilter !== 'All' && user.country !== usersCountryFilter) return false;
    return true;
  });

  // Filter projects data
  const filteredProjectsData = projectsData.filter(project => {
    if (projectsCountryFilter && projectsCountryFilter !== 'All' && project.country !== projectsCountryFilter) return false;
    return true;
  });

  // Check success condition
  useEffect(() => {
    if (
      usersCountryFilter === 'Brazil' &&
      (projectsCountryFilter === 'All' || !projectsCountryFilter) &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [usersCountryFilter, projectsCountryFilter, onSuccess]);

  const usersFilterModel: FilterModel = {
    table_id: 'users_mantine',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: usersCountryFilter && usersCountryFilter !== 'All'
      ? [{ column: 'Country', operator: 'equals' as const, value: usersCountryFilter }]
      : [],
  };

  const projectsFilterModel: FilterModel = {
    table_id: 'projects_mantine',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: projectsCountryFilter && projectsCountryFilter !== 'All'
      ? [{ column: 'Country', operator: 'equals' as const, value: projectsCountryFilter }]
      : [],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Title order={3} mb="xs">Admin</Title>
      <Text size="sm" c="dimmed" mb="lg">Manage users and projects below.</Text>

      {/* Users Table */}
      <Box mb="xl">
        <Group mb="sm">
          <Select
            label="Country"
            data={countryOptions}
            value={usersCountryFilter}
            onChange={setUsersCountryFilter}
            style={{ width: 150 }}
            data-testid="users-country-filter"
          />
        </Group>
        <Text fw={500} size="md" mb="sm">Users</Text>
        <Table
          highlightOnHover
          data-testid="table-users"
          data-filter-model={JSON.stringify(usersFilterModel)}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Country</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsersData.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.name}</Table.Td>
                <Table.Td>{row.email}</Table.Td>
                <Table.Td>{row.country}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>

      {/* Projects Table */}
      <Box>
        <Group mb="sm">
          <Select
            label="Country"
            data={countryOptions}
            value={projectsCountryFilter}
            onChange={setProjectsCountryFilter}
            style={{ width: 150 }}
            data-testid="projects-country-filter"
          />
        </Group>
        <Text fw={500} size="md" mb="sm">Projects</Text>
        <Table
          highlightOnHover
          data-testid="table-projects"
          data-filter-model={JSON.stringify(projectsFilterModel)}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Country</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredProjectsData.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.name}</Table.Td>
                <Table.Td>{row.status}</Table.Td>
                <Table.Td>{row.country}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );
}
