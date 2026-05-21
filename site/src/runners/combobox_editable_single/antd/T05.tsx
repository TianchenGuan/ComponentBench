'use client';

/**
 * combobox_editable_single-antd-T05: Set Primary contact to Alice Johnson
 *
 * A "Contacts" form section is centered in the viewport with two editable comboboxes.
 * - Scene: form_section layout, center placement, light theme, comfortable spacing, default scale.
 * - Instances: 2 AutoComplete fields stacked vertically:
 *   1) "Primary contact" (target)
 *   2) "Backup contact" (distractor)
 * - Options: Alice Johnson, Alison Johnson, Alicia Jones, Alan Johnson, Bob Smith, Ben Wong, Becky Wu, Carlos Diaz, Chen Li, Dana Patel, Emily Nguyen, Fatima Hassan, George Kim, Hannah Lee.
 * - Initial state: Primary contact empty, Backup contact prefilled with "Ben Wong".
 * - Distractors: checkbox "Notify contacts by email" and a "Notes" textarea.
 *
 * Success: The "Primary contact" combobox value equals "Alice Johnson".
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography, Checkbox, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;
const { TextArea } = Input;

const contacts = [
  { value: 'Alice Johnson' },
  { value: 'Alison Johnson' },
  { value: 'Alicia Jones' },
  { value: 'Alan Johnson' },
  { value: 'Bob Smith' },
  { value: 'Ben Wong' },
  { value: 'Becky Wu' },
  { value: 'Carlos Diaz' },
  { value: 'Chen Li' },
  { value: 'Dana Patel' },
  { value: 'Emily Nguyen' },
  { value: 'Fatima Hassan' },
  { value: 'George Kim' },
  { value: 'Hannah Lee' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryContact, setPrimaryContact] = useState('');
  const [backupContact, setBackupContact] = useState('Ben Wong');

  const handlePrimarySelect = (selectedValue: string) => {
    setPrimaryContact(selectedValue);
    if (selectedValue === 'Alice Johnson') {
      onSuccess();
    }
  };

  const handlePrimaryBlur = () => {
    if (primaryContact === 'Alice Johnson') {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 450 }}>
      <Title level={4} style={{ marginBottom: 24 }}>Contacts</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary contact</Text>
        <AutoComplete
          data-testid="contact-primary"
          style={{ width: '100%' }}
          options={contacts}
          placeholder="Select contact"
          value={primaryContact}
          onChange={setPrimaryContact}
          onSelect={handlePrimarySelect}
          onBlur={handlePrimaryBlur}
          filterOption={(inputValue, option) =>
            option!.value.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Backup contact</Text>
        <AutoComplete
          data-testid="contact-backup"
          style={{ width: '100%' }}
          options={contacts}
          placeholder="Select contact"
          value={backupContact}
          onChange={setBackupContact}
          filterOption={(inputValue, option) =>
            option!.value.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </div>

      <Checkbox style={{ marginBottom: 16 }}>Notify contacts by email</Checkbox>

      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Notes</Text>
        <TextArea rows={3} placeholder="Additional notes..." />
      </div>
    </Card>
  );
}
