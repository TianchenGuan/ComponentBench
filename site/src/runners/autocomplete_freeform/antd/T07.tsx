'use client';

/**
 * autocomplete_freeform-antd-T07: Match the team nickname from a reference badge
 *
 * setup_description:
 * A centered isolated card titled "Team setup" contains a small "Reference" area and one Ant Design AutoComplete.
 *
 * The Reference area shows a prominent pill/badge with uppercase text "ORCHID" (non-interactive). This is the only place where the target value is shown; the instruction tells the user to match it.
 *
 * Below the reference, the target AutoComplete is labeled "Team nickname" with placeholder "Type a nickname". Its suggestion list contains several flower-like strings (ORCHID, ORANGE BLOSSOM, OLIVE, OPAL) to create mild confusability.
 *
 * Initial state: the AutoComplete input is empty and the dropdown is closed. Distractors: none besides the reference badge and a short note "Nicknames can be custom". Feedback: the entered nickname is visible as plain text in the input.
 *
 * Success: The "Team nickname" AutoComplete input's displayed value equals "ORCHID" (case-insensitive match allowed, whitespace trimmed).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Typography, Tag, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const nicknames = [
  { value: 'ORCHID' },
  { value: 'ORANGE BLOSSOM' },
  { value: 'OLIVE' },
  { value: 'OPAL' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = value.trim().toLowerCase();
  const targetValue = 'orchid';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card title="Team setup" style={{ width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Reference</Text>
          <Tag data-testid="reference-badge" color="purple" style={{ fontSize: 16, padding: '4px 12px' }}>ORCHID</Tag>
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Team nickname</Text>
          <AutoComplete
            data-testid="team-nickname"
            style={{ width: '100%' }}
            options={nicknames}
            placeholder="Type a nickname"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>Nicknames can be custom</Text>
        </div>
      </Space>
    </Card>
  );
}
