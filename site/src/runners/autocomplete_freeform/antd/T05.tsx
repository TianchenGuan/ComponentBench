'use client';

/**
 * autocomplete_freeform-antd-T05: Search and select a company in a form section
 *
 * setup_description:
 * The UI is a "New customer" form_section centered on the page. It uses Ant Design Form styling with labels aligned on the left and inputs on the right.
 *
 * The target control is an Ant Design AutoComplete labeled "Company" with placeholder "Start typing a company". The dropdown suggestions contain several similar-looking entries such as "Acme", "Acme Corp", "Acme Corporation", and "ACME Consulting".
 *
 * Clutter/distractors (not required for success): a normal text input for "Contact name", a normal text input for "Email", and a multiline "Notes" textarea appear below. They are enabled and can receive focus, so the agent must avoid typing into them.
 *
 * Initial state: all fields are empty and no dropdown is open. Feedback: selecting a company fills the AutoComplete input with the full company name.
 *
 * Success: The "Company" AutoComplete input's displayed value equals "Acme Corporation" (after trimming whitespace).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Form, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;
const { TextArea } = Input;

const companies = [
  { value: 'Acme' },
  { value: 'Acme Corp' },
  { value: 'Acme Corporation' },
  { value: 'ACME Consulting' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [companyValue, setCompanyValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = companyValue.trim();
  const targetValue = 'Acme Corporation';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card title="New customer" style={{ width: 500 }}>
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="Company">
          <AutoComplete
            data-testid="company-autocomplete"
            style={{ width: '100%' }}
            options={companies}
            placeholder="Start typing a company"
            value={companyValue}
            onChange={(newValue) => setCompanyValue(newValue)}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item label="Contact name">
          <Input placeholder="Enter contact name" />
        </Form.Item>
        <Form.Item label="Email">
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item label="Notes">
          <TextArea placeholder="Enter notes" rows={3} />
        </Form.Item>
      </Form>
    </Card>
  );
}
