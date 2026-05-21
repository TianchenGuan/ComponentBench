'use client';

/**
 * autocomplete_restricted-antd-T03: Open the assignee dropdown
 *
 * setup_description:
 * The page contains a single isolated card titled "New ticket".
 *
 * There is one Ant Design Select labeled **Assignee** with placeholder "Pick a teammate".
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: no selection (placeholder visible).
 * - Clicking the field or the dropdown arrow opens a popover list of 6 names: Alex Kim, Brianna Lee, Chen Wei, Daniela Rossi, Omar Haddad, Priya Singh.
 * - The component is restricted to the provided options (no free text value).
 *
 * There are no other form fields. This task is only about opening (disclosing) the options list and leaving it open.
 *
 * Success: The Assignee Select's options popup/listbox is open and visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const assignees = [
  { label: 'Alex Kim', value: 'Alex Kim' },
  { label: 'Brianna Lee', value: 'Brianna Lee' },
  { label: 'Chen Wei', value: 'Chen Wei' },
  { label: 'Daniela Rossi', value: 'Daniela Rossi' },
  { label: 'Omar Haddad', value: 'Omar Haddad' },
  { label: 'Priya Singh', value: 'Priya Singh' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && isOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [isOpen, onSuccess]);

  return (
    <Card title="New ticket" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Assignee</Text>
      <Select
        data-testid="assignee-select"
        style={{ width: '100%' }}
        placeholder="Pick a teammate"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        open={isOpen}
        onDropdownVisibleChange={(open) => setIsOpen(open)}
        options={assignees}
      />
    </Card>
  );
}
