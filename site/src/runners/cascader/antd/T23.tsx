'use client';

/**
 * cascader-antd-T23: Multiple mode: select exactly two cities (Paris and Osaka)
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Cities included" in multiple=true mode (checkboxes shown).
 * Display: showCheckedStrategy is set to SHOW_CHILD so selected leaf nodes appear as individual tags in the input.
 * Options: Continent → Country → City:
 *   - Europe → France → Paris (target), Lyon
 *   - Asia → Japan → Tokyo, Osaka (target)
 *   - Americas → USA → New York, Chicago
 * Initial state: no selections.
 * Behavior: each leaf is selected by checking its checkbox (or clicking the item). Multiple selections can be made.
 *
 * Success: selected paths are exactly [Europe/France/Paris] and [Asia/Japan/Osaka] (order-insensitive)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathSetsEqual } from '../types';

const { SHOW_CHILD } = Cascader;

const options = [
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'fr',
        label: 'France',
        children: [
          { value: 'paris', label: 'Paris' },
          { value: 'lyon', label: 'Lyon' },
        ],
      },
    ],
  },
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'jp',
        label: 'Japan',
        children: [
          { value: 'tokyo', label: 'Tokyo' },
          { value: 'osaka', label: 'Osaka' },
        ],
      },
    ],
  },
  {
    value: 'americas',
    label: 'Americas',
    children: [
      {
        value: 'usa',
        label: 'USA',
        children: [
          { value: 'new-york', label: 'New York' },
          { value: 'chicago', label: 'Chicago' },
        ],
      },
    ],
  },
];

const TARGET_PATHS = [
  ['europe', 'fr', 'paris'],
  ['asia', 'jp', 'osaka'],
];

export default function T23({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[][]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathSetsEqual(value, TARGET_PATHS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Trip Planner" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Cities included
        </label>
        <Cascader
          data-testid="cities-included-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[][])}
          placeholder="Select cities"
          multiple
          showCheckedStrategy={SHOW_CHILD}
          maxTagCount="responsive"
        />
      </div>
    </Card>
  );
}
