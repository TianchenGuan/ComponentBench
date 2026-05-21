'use client';

/**
 * select_custom_single-antd-T03: Open the Language dropdown
 *
 * Layout: centered isolated card titled "Localization".
 * The card contains one Ant Design Select labeled "Language", default size, comfortable spacing.
 *
 * Initial state: value is "English" and the dropdown is closed.
 * Clicking the field opens a popover list anchored to the select input with options: English, Spanish, French, German.
 *
 * This task is about the overlay state: success requires the dropdown list to be visible/open at the end.
 * Selecting an option will normally close the dropdown, so avoid ending in a closed state.
 *
 * No other controls are present (no extra buttons, no second select).
 *
 * Success: The AntD Select labeled "Language" has its dropdown/popup open (options list visible).
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  { label: 'German', value: 'German' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('English');
  const [open, setOpen] = useState(false);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleDropdownVisibleChange = (visible: boolean) => {
    setOpen(visible);
    if (visible) {
      onSuccess();
    }
  };

  return (
    <Card title="Localization" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Language</Text>
      <Select
        data-testid="language-select"
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        open={open}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        options={options}
      />
    </Card>
  );
}
