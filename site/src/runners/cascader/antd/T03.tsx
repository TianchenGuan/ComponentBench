'use client';

/**
 * cascader-antd-T03: Clear the Product category selection
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Product category" with allowClear enabled.
 * Initial state: the cascader currently shows "Electronics / Computers / Laptops".
 * UI details: when the input is hovered, a small clear (×) icon appears on the right side of the input.
 * Behavior: clicking the clear icon removes the selection and returns the input to the placeholder state.
 * Distractors: none.
 *
 * Success: Product category Cascader has no selected value (empty / null value path).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';

const options = [
  {
    value: 'electronics',
    label: 'Electronics',
    children: [
      {
        value: 'computers',
        label: 'Computers',
        children: [
          { value: 'laptops', label: 'Laptops' },
          { value: 'desktops', label: 'Desktops' },
        ],
      },
      {
        value: 'phones',
        label: 'Phones',
        children: [
          { value: 'smartphones', label: 'Smartphones' },
        ],
      },
    ],
  },
  {
    value: 'clothing',
    label: 'Clothing',
    children: [
      {
        value: 'mens',
        label: 'Mens',
        children: [
          { value: 'shirts', label: 'Shirts' },
        ],
      },
    ],
  },
];

const INITIAL_VALUE = ['electronics', 'computers', 'laptops'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(INITIAL_VALUE);
  const successFired = useRef(false);

  useEffect(() => {
    // Success when value is empty/cleared
    if (!successFired.current && (!value || value.length === 0)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Product Settings" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Product category
        </label>
        <Cascader
          data-testid="product-category-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue((val as string[]) || [])}
          placeholder="Please select"
          allowClear
        />
      </div>
    </Card>
  );
}
