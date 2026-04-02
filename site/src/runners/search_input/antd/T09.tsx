'use client';

/**
 * search_input-antd-T09: Select the exact SKU from a dense AutoComplete list
 *
 * Isolated card centered in the viewport titled "Inventory lookup".
 * Contains one Ant Design AutoComplete labeled "SKU search" with placeholder "Type SKU…".
 * The dropdown suggestions include 30 very similar SKUs: AC-1200 through AC-1229 (all share the AC-12 prefix).
 * Initial state: empty. Typing shows the dropdown; options are in a single dense list with no grouping.
 * Feedback: selecting a SKU shows a read-only detail line below: "Selected SKU: AC-1209".
 * No additional clutter.
 *
 * Success: The AutoComplete labeled "SKU search" has selected_option "AC-1209" and value "AC-1209".
 */

import React, { useState, useRef } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Generate SKUs AC-1200 through AC-1229
const skus = Array.from({ length: 30 }, (_, i) => `AC-${1200 + i}`);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const hasSucceeded = useRef(false);

  const handleSearch = (searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }
    const filtered = skus
      .filter((sku) => sku.toLowerCase().includes(searchText.toLowerCase()))
      .map((sku) => ({ value: sku }));
    setOptions(filtered);
  };

  const handleSelect = (data: string) => {
    setValue(data);
    setSelectedOption(data);
    if (data === 'AC-1209' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card title="Inventory lookup" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="search-sku" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          SKU search
        </label>
        <AutoComplete
          id="search-sku"
          style={{ width: '100%' }}
          placeholder="Type SKU…"
          value={value}
          options={options}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onChange={setValue}
          data-testid="search-sku"
          listHeight={200}
        />
        {selectedOption && (
          <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
            Selected SKU: {selectedOption}
          </Text>
        )}
      </div>
    </Card>
  );
}
