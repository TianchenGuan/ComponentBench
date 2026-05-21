'use client';

/**
 * autocomplete_restricted-antd-T04: Match language to the profile card
 *
 * setup_description:
 * The page shows an isolated "Profile settings" card centered on the screen.
 *
 * Two elements are visible inside the card:
 * 1) A small **sample profile card** (read-only) showing:
 *    - Name: "Taylor"
 *    - A highlighted pill labeled **Language: Spanish** (this pill is the reference)
 * 2) An Ant Design Select labeled **Preferred language** with placeholder "Select language".
 *
 * Component details:
 * - Theme: light; spacing: comfortable; size: default.
 * - Options-only selection (restricted): English, Spanish, French, German.
 * - `showSearch` is enabled, but the list is short.
 * - Selecting an option immediately updates the field; no Save button.
 *
 * This task uses mixed/visual guidance: the target language must be inferred from the profile card pill rather than being spelled out in the instruction.
 *
 * Success: The "Preferred language" Select has selected value "Spanish" (matching the reference).
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Tag, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const languages = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  { label: 'German', value: 'German' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Spanish') {
      onSuccess();
    }
  };

  return (
    <Card title="Profile settings" style={{ width: 450 }}>
      {/* Sample profile card (reference) */}
      <div
        style={{
          background: '#f5f5f5',
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Taylor</Text>
        <Space>
          <Tag data-testid="profile-card.language-pill" color="blue">Language: Spanish</Tag>
        </Space>
      </div>

      {/* Target Select */}
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Preferred language</Text>
      <Select
        data-testid="preferred-language-select"
        style={{ width: '100%' }}
        placeholder="Select language"
        value={value}
        onChange={handleChange}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={languages}
      />
    </Card>
  );
}
