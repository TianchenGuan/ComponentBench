'use client';

/**
 * select_with_search-antd-T04: Open the Assignee dropdown
 *
 * Layout: isolated_card centered titled "Task details".
 * Component: one Ant Design Select labeled "Assignee" with showSearch enabled.
 * Options (people): Unassigned, Alex Chen, Priya Singh, Maria Garcia, Omar Haddad.
 * Initial state: "Unassigned" is selected.
 * The dropdown is closed initially. When opened, a popover appears below the Select with:
 *  - a search input at the top
 *  - the list of options beneath
 * No other interactive elements are present. The goal is only to open the dropdown overlay without changing the selected value.
 *
 * Success: The dropdown overlay for the "Assignee" Select is open (options list visible).
 *          The selected value remains "Unassigned".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Unassigned', label: 'Unassigned' },
  { value: 'Alex Chen', label: 'Alex Chen' },
  { value: 'Priya Singh', label: 'Priya Singh' },
  { value: 'Maria Garcia', label: 'Maria Garcia' },
  { value: 'Omar Haddad', label: 'Omar Haddad' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('Unassigned');
  const [isOpen, setIsOpen] = useState(false);
  const hasTriggeredSuccess = useRef(false);

  useEffect(() => {
    // Trigger success when dropdown is opened and value is still Unassigned
    if (isOpen && value === 'Unassigned' && !hasTriggeredSuccess.current) {
      hasTriggeredSuccess.current = true;
      onSuccess();
    }
  }, [isOpen, value, onSuccess]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleDropdownVisibleChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Card title="Task details" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Assignee</Text>
      <Select
        data-testid="assignee-select"
        showSearch
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        options={options}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Card>
  );
}
