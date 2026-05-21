'use client';

/**
 * cascader-antd-T14: Dashboard filter: set Product taxonomy to Home / Kitchen / Coffee Makers
 *
 * Layout: dashboard with a top filter bar.
 * Clutter: medium — multiple filters and charts are present.
 * Target component: an AntD Cascader in the filter bar labeled "Product taxonomy".
 * Other UI (distractors): a date range picker, a keyword search box, a region select, and several summary charts.
 * Taxonomy options: Category → Subcategory → Product type:
 *   - Home → Kitchen → Coffee Makers (target), Cookware, Cutlery
 *   - Home → Lighting → Lamps
 *   - Electronics → Audio → Headphones
 * Initial state: Product taxonomy is blank (interpreted as "All").
 *
 * Success: path_labels equal [Home, Kitchen, Coffee Makers], path_values equal ['home','kitchen','coffee-makers']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader, Input, Select, DatePicker } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const { RangePicker } = DatePicker;

const taxonomyOptions = [
  {
    value: 'home',
    label: 'Home',
    children: [
      {
        value: 'kitchen',
        label: 'Kitchen',
        children: [
          { value: 'coffee-makers', label: 'Coffee Makers' },
          { value: 'cookware', label: 'Cookware' },
          { value: 'cutlery', label: 'Cutlery' },
        ],
      },
      {
        value: 'lighting',
        label: 'Lighting',
        children: [
          { value: 'lamps', label: 'Lamps' },
        ],
      },
    ],
  },
  {
    value: 'electronics',
    label: 'Electronics',
    children: [
      {
        value: 'audio',
        label: 'Audio',
        children: [
          { value: 'headphones', label: 'Headphones' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['home', 'kitchen', 'coffee-makers'];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [taxonomyValue, setTaxonomyValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(taxonomyValue, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [taxonomyValue, onSuccess]);

  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      {/* Filter Bar */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
              Product taxonomy
            </label>
            <Cascader
              data-testid="product-taxonomy-cascader"
              style={{ width: 220 }}
              options={taxonomyOptions}
              value={taxonomyValue}
              onChange={(val) => setTaxonomyValue(val as string[])}
              placeholder="All categories"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
              Date range
            </label>
            <RangePicker style={{ width: 240 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
              Region
            </label>
            <Select
              style={{ width: 120 }}
              placeholder="Select"
              options={[
                { value: 'all', label: 'All' },
                { value: 'na', label: 'North America' },
                { value: 'eu', label: 'Europe' },
              ]}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
              Search
            </label>
            <Input.Search placeholder="Keywords" style={{ width: 160 }} />
          </div>
        </div>
      </Card>

      {/* Dashboard Charts (mock) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Sales Overview" style={{ height: 200 }}>
          <div style={{ color: '#999', textAlign: 'center', paddingTop: 50 }}>
            Chart placeholder
          </div>
        </Card>
        <Card title="Revenue by Region" style={{ height: 200 }}>
          <div style={{ color: '#999', textAlign: 'center', paddingTop: 50 }}>
            Chart placeholder
          </div>
        </Card>
        <Card title="Top Products" style={{ height: 200 }}>
          <div style={{ color: '#999', textAlign: 'center', paddingTop: 50 }}>
            Chart placeholder
          </div>
        </Card>
        <Card title="Inventory Status" style={{ height: 200 }}>
          <div style={{ color: '#999', textAlign: 'center', paddingTop: 50 }}>
            Chart placeholder
          </div>
        </Card>
      </div>
    </div>
  );
}
