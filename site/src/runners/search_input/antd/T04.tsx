'use client';

/**
 * search_input-antd-T04: Pick a suggestion from AntD AutoComplete (small list)
 *
 * Baseline isolated card centered in the viewport titled "Snack builder".
 * The card contains one Ant Design AutoComplete with label "Fruit search" and placeholder "Type to search fruits…".
 * Suggestions appear in a dropdown panel below the input after typing. The dataset contains 6 fruits: Apple, Apricot, Banana, Blackberry, Cherry, Grape.
 * Initial state: empty; no suggestion panel visible until the input is focused/typed.
 * Feedback: selecting a suggestion fills the input value and shows a small pill below: "Selected fruit: Banana".
 * No other interactive elements are present.
 *
 * Success: The AutoComplete labeled "Fruit search" has selected_option equal to "Banana" and value equals "Banana".
 */

import React, { useState, useRef } from 'react';
import { Card, AutoComplete, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const fruits = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Cherry', 'Grape'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const hasSucceeded = useRef(false);

  const handleSearch = (searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }
    const filtered = fruits
      .filter((fruit) => fruit.toLowerCase().includes(searchText.toLowerCase()))
      .map((fruit) => ({ value: fruit }));
    setOptions(filtered);
  };

  const handleSelect = (data: string) => {
    setValue(data);
    setSelectedOption(data);
    if (data === 'Banana' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card title="Snack builder" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="search-fruit" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Fruit search
        </label>
        <AutoComplete
          id="search-fruit"
          style={{ width: '100%' }}
          placeholder="Type to search fruits…"
          value={value}
          options={options}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onChange={setValue}
          data-testid="search-fruit"
        />
        {selectedOption && (
          <div style={{ marginTop: 8 }}>
            <Tag color="green">Selected fruit: {selectedOption}</Tag>
          </div>
        )}
      </div>
    </Card>
  );
}
