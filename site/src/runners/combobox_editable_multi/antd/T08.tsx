'use client';

/**
 * combobox_editable_multi-antd-T08: Pick four countries from a long dropdown
 *
 * The Select is rendered in the bottom-right corner of the viewport inside a small compact card titled "Geo rules".
 * - Theme: light
 * - Spacing: compact (tight padding and smaller text)
 * - Component scale: small (Select size=small)
 * - Label: "Allowed countries"
 * - Initial state: empty
 * - The dropdown contains a long alphabetized list of ~80 country options and uses a scrollable menu; the target countries are not visible when the dropdown first opens.
 * Clutter is minimal: only a short description text above the field.
 * To succeed, you must add exactly the four specified countries as tags.
 *
 * Success: Selected values equal {Uruguay, Uzbekistan, Vietnam, Zimbabwe} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

// Long alphabetized list of countries
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Chad', 'Chile', 'China', 'Colombia',
  'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti',
  'Dominica', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Guinea', 'Haiti',
  'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon',
  'Libya', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman',
  'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore', 'Slovakia',
  'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden',
  'Switzerland', 'Syria', 'Taiwan', 'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const options = countries.map(c => ({ value: c, label: c }));

const TARGET_SET = ['Uruguay', 'Uzbekistan', 'Vietnam', 'Zimbabwe'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Geo rules" style={{ width: 320 }} size="small">
      <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
        Configure allowed regions for data processing.
      </Text>
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Allowed countries</Text>
      <Select
        data-testid="allowed-countries"
        mode="tags"
        size="small"
        style={{ width: '100%' }}
        placeholder="Select countries"
        value={value}
        onChange={setValue}
        options={options}
        listHeight={200}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Card>
  );
}
