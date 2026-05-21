'use client';

/**
 * breadcrumb-mantine-T03: Select department from menu (Mantine)
 * 
 * Centered card titled "Team Page".
 * Mantine Breadcrumbs: Company > Departments (menu) > Teams > Team Page
 * Clicking Departments opens menu: Marketing, Engineering, Design.
 * Select "Engineering".
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card, Menu } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const handleSelectDepartment = (dept: string) => {
    if (selectedDepartment) return;
    setSelectedDepartment(dept);
    if (dept === 'Engineering') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text size="lg" fw={600} mb="md">Team Page</Text>
      
      <Breadcrumbs mb="md">
        <Text data-testid="mantine-breadcrumb-company">Company</Text>
        <Menu shadow="md" width={150} data-testid="mantine-breadcrumb-departments-menu">
          <Menu.Target>
            <Anchor
              component="button"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              Departments <IconChevronDown size={14} />
            </Anchor>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => handleSelectDepartment('Marketing')}>
              Marketing
            </Menu.Item>
            <Menu.Item onClick={() => handleSelectDepartment('Engineering')}>
              Engineering
            </Menu.Item>
            <Menu.Item onClick={() => handleSelectDepartment('Design')}>
              Design
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Text data-testid="mantine-breadcrumb-teams">Teams</Text>
        <Text data-testid="mantine-breadcrumb-teampage">Team Page</Text>
      </Breadcrumbs>

      {selectedDepartment ? (
        <Text c="green" fw={500}>
          Selected department: {selectedDepartment}
        </Text>
      ) : (
        <Text>
          Click "Departments" to open the menu and select a department.
        </Text>
      )}
    </Card>
  );
}
