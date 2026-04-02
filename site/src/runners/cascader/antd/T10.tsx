'use client';

/**
 * cascader-antd-T10: Search and select: South Campus / Art Studio (top-left placement)
 *
 * Layout: isolated card anchored near the top-left of the viewport.
 * Component: one AntD Cascader labeled "Campus building" with showSearch enabled.
 * UI behavior: opening the cascader reveals a search input; typing filters the available paths.
 * Options: Campus → Building:
 *   - North Campus → Science Hall, Library
 *   - South Campus → Gym, Art Studio (target)
 * Initial state: blank.
 * Distractors: the dropdown still supports manual column navigation, but the intent is to use search.
 *
 * Success: path_labels equal [South Campus, Art Studio], path_values equal ['south','art-studio']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'north',
    label: 'North Campus',
    children: [
      { value: 'science-hall', label: 'Science Hall' },
      { value: 'library', label: 'Library' },
    ],
  },
  {
    value: 'south',
    label: 'South Campus',
    children: [
      { value: 'gym', label: 'Gym' },
      { value: 'art-studio', label: 'Art Studio' },
    ],
  },
];

const TARGET_PATH = ['south', 'art-studio'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Campus Services" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Campus building
        </label>
        <Cascader
          data-testid="campus-building-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Search or select"
          showSearch
        />
      </div>
    </Card>
  );
}
