'use client';

/**
 * cascader-antd-T15: Cancel out: open Delivery zone and close without changing
 *
 * Layout: isolated card anchored near the bottom-left of the viewport.
 * Component: one AntD Cascader labeled "Delivery zone".
 * Initial state: already selected to "EMEA / UK / London".
 * Options: Region → Country → City:
 *   - EMEA → UK → London (current)
 *   - EMEA → UAE → Dubai
 *   - Americas → USA → New York
 * Behavior: opening the dropdown shows columns; clicking outside (or pressing Escape) closes the dropdown.
 * Selection only changes if a new leaf is clicked.
 * Goal: ensure the dropdown ends closed and the committed selection remains unchanged.
 *
 * Success: dropdown is closed (open=false), selection remains ['emea','uk','london']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'emea',
    label: 'EMEA',
    children: [
      {
        value: 'uk',
        label: 'UK',
        children: [
          { value: 'london', label: 'London' },
        ],
      },
      {
        value: 'uae',
        label: 'UAE',
        children: [
          { value: 'dubai', label: 'Dubai' },
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
        ],
      },
    ],
  },
];

const INITIAL_VALUE = ['emea', 'uk', 'london'];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(INITIAL_VALUE);
  const [open, setOpen] = useState(false);
  const [wasOpened, setWasOpened] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (open) {
      setWasOpened(true);
    }
  }, [open]);

  useEffect(() => {
    // Success when: was opened, now closed, and value unchanged
    if (!successFired.current && wasOpened && !open && pathEquals(value, INITIAL_VALUE)) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, value, wasOpened, onSuccess]);

  return (
    <Card title="Delivery Settings" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Delivery zone
        </label>
        <Cascader
          data-testid="delivery-zone-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          open={open}
          onDropdownVisibleChange={setOpen}
          placeholder="Please select"
        />
      </div>
    </Card>
  );
}
