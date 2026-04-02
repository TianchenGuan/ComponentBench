'use client';

/**
 * combobox_editable_multi-mantine-T09: Set required tags in a drawer and apply
 *
 * Drawer flow in a dashboard:
 * - Main page shows a table of invoices and a button "Edit filters".
 * - Clicking "Edit filters" opens a left-side Drawer.
 * Inside the drawer:
 * - Target field: Mantine TagsInput labeled "Required tags".
 * - Initial pills: none.
 * - Suggestions include many invoice-related tags (billing, overdue, escalated, paid, refunded, disputed, high-risk).
 * - Drawer footer has buttons: "Cancel" and primary "Apply".
 * Feedback:
 * - After clicking Apply, the drawer closes and a small inline status text updates to "Filters applied" (not required for success).
 * Success requires the tags to match exactly AND the Apply button to be clicked.
 *
 * Success: Selected values equal {billing, overdue, escalated} AND Apply clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, TagsInput, Button, Drawer, Table, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const suggestions = ['billing', 'overdue', 'escalated', 'paid', 'refunded', 'disputed', 'high-risk'];

const TARGET_SET = ['billing', 'overdue', 'escalated'];

const invoiceData = [
  { id: 'INV-001', customer: 'Acme Corp', amount: '$1,250.00', status: 'Pending' },
  { id: 'INV-002', customer: 'Tech Solutions', amount: '$3,400.00', status: 'Paid' },
  { id: 'INV-003', customer: 'Global Industries', amount: '$890.00', status: 'Overdue' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const hasSucceeded = useRef(false);

  const handleApply = () => {
    if (setsEqual(value, TARGET_SET) && !hasSucceeded.current) {
      hasSucceeded.current = true;
      setDrawerOpen(false);
      setFilterStatus('Filters applied');
      onSuccess();
    } else {
      setDrawerOpen(false);
      setFilterStatus('Filters applied');
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">Invoices</Text>
          <Button 
            data-testid="open-drawer-button"
            variant="outline" 
            onClick={() => setDrawerOpen(true)}
          >
            Edit filters
          </Button>
        </Group>
        
        {filterStatus && (
          <Text size="sm" c="green" mb="md">{filterStatus}</Text>
        )}
        
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Invoice ID</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {invoiceData.map((invoice) => (
              <Table.Tr key={invoice.id}>
                <Table.Td>{invoice.id}</Table.Td>
                <Table.Td>{invoice.customer}</Table.Td>
                <Table.Td>{invoice.amount}</Table.Td>
                <Table.Td>{invoice.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Edit Filters"
        position="left"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1 }}>
            <Text fw={500} size="sm" mb={8}>Required tags</Text>
            <TagsInput
              data-testid="required-tags"
              placeholder="Add required tags"
              data={suggestions}
              value={value}
              onChange={setValue}
            />
          </div>
          
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button 
              data-testid="apply-button"
              onClick={handleApply}
            >
              Apply
            </Button>
          </Group>
        </div>
      </Drawer>
    </>
  );
}
