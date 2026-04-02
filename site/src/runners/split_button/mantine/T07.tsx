'use client';

/**
 * split_button-mantine-T07: Settings: set Invoice actions split-button to Export CSV (Mantine, 2 instances)
 *
 * Layout: settings_panel titled "Documents" with clutter=medium.
 * Target component: TWO Mantine split buttons:
 * 1) "Invoice actions" (target)
 * 2) "Quote actions" (distractor)
 *
 * Menu items (same for both): "Export CSV", "Export PDF", "Duplicate", "Archive", Divider, "Delete" (danger)
 * Initial state: Both set to "Export PDF".
 *
 * Success: Only "Invoice actions" instance has selectedAction = "export_csv"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text, Badge, Box, List } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'export_csv', label: 'Export CSV' },
  { key: 'export_pdf', label: 'Export PDF' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'archive', label: 'Archive' },
  { key: 'divider', divider: true },
  { key: 'delete', label: 'Delete', danger: true },
];

interface SplitButtonProps {
  label: string;
  instance: string;
  selectedAction: string;
  onActionChange: (key: string) => void;
}

function SplitButton({ label, instance, selectedAction, onActionChange }: SplitButtonProps) {
  const getLabel = (key: string) => options.find(o => o.key === key && !o.divider)?.label || key;

  return (
    <Box mb="md">
      <Text size="sm" c="dimmed" mb="xs">{label}</Text>
      <div
        data-testid="split-button-root"
        data-instance={instance}
        data-selected-action={selectedAction}
        aria-label={`${label} split button`}
      >
        <Group gap={0}>
          <Button 
            size="sm"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          >
            {getLabel(selectedAction)}
          </Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <Button 
                size="sm"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 8, paddingRight: 8 }}
              >
                <IconChevronDown size={14} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {options.map((option) => {
                if (option.divider) {
                  return <Menu.Divider key={option.key} />;
                }
                return (
                  <Menu.Item 
                    key={option.key}
                    color={option.danger ? 'red' : undefined}
                    onClick={() => onActionChange(option.key)}
                  >
                    {option.label}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Box>
  );
}

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [invoiceAction, setInvoiceAction] = useState('export_pdf');
  const [quoteAction, setQuoteAction] = useState('export_pdf');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const handleInvoiceChange = (key: string) => {
    setInvoiceAction(key);
    if (key === 'export_csv' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="lg" mb="md">Documents</Text>

      {/* Distractors: document list */}
      <List size="sm" mb="lg" spacing="xs">
        <List.Item>
          Invoice #1234 <Badge size="xs" ml="xs">Paid</Badge>
        </List.Item>
        <List.Item>
          Quote #5678 <Badge size="xs" color="yellow" ml="xs">Pending</Badge>
        </List.Item>
        <List.Item>
          Invoice #1235 <Badge size="xs" ml="xs">Paid</Badge>
        </List.Item>
      </List>

      {/* Right-side details panel placeholder (distractor) */}
      <Box 
        style={{ 
          padding: 12, 
          background: '#f8f9fa', 
          borderRadius: 4,
          marginBottom: 16,
          fontSize: 13,
          color: '#999'
        }}
      >
        Select a document to view details
      </Box>

      <SplitButton
        label="Invoice actions"
        instance="invoice"
        selectedAction={invoiceAction}
        onActionChange={handleInvoiceChange}
      />

      <SplitButton
        label="Quote actions"
        instance="quote"
        selectedAction={quoteAction}
        onActionChange={setQuoteAction}
      />

      {/* Disabled button (distractor) */}
      <Button disabled variant="outline" mt="md">New document</Button>
    </Card>
  );
}
