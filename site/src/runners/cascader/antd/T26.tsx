'use client';

/**
 * cascader-antd-T26: Three instances: set Tertiary route to EU-West / Ireland / Zone 2
 *
 * Layout: isolated card centered on the page.
 * Components: three AntD Cascader inputs in a row, each labeled:
 *   - Primary route
 *   - Secondary route
 *   - Tertiary route (target)
 * Options: Region → Country → Zone:
 *   - US-East → USA → Zone 1, Zone 2
 *   - EU-West → Ireland → Zone 1, Zone 2 (target)
 *   - APAC → Singapore → Zone 1
 * Initial state:
 *   - Primary route preselected: US-East / USA / Zone 1
 *   - Secondary route preselected: APAC / Singapore / Zone 1
 *   - Tertiary route blank
 * Distractors: three nearly identical inputs placed close together.
 *
 * Success: Tertiary route has path_labels [EU-West, Ireland, Zone 2], path_values ['eu-west','ie','zone-2']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'us-east',
    label: 'US-East',
    children: [
      {
        value: 'usa',
        label: 'USA',
        children: [
          { value: 'zone-1', label: 'Zone 1' },
          { value: 'zone-2', label: 'Zone 2' },
        ],
      },
    ],
  },
  {
    value: 'eu-west',
    label: 'EU-West',
    children: [
      {
        value: 'ie',
        label: 'Ireland',
        children: [
          { value: 'zone-1', label: 'Zone 1' },
          { value: 'zone-2', label: 'Zone 2' },
        ],
      },
    ],
  },
  {
    value: 'apac',
    label: 'APAC',
    children: [
      {
        value: 'sg',
        label: 'Singapore',
        children: [
          { value: 'zone-1', label: 'Zone 1' },
        ],
      },
    ],
  },
];

const PRIMARY_INITIAL = ['us-east', 'usa', 'zone-1'];
const SECONDARY_INITIAL = ['apac', 'sg', 'zone-1'];
const TARGET_PATH = ['eu-west', 'ie', 'zone-2'];

export default function T26({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<string[]>(PRIMARY_INITIAL);
  const [secondaryValue, setSecondaryValue] = useState<string[]>(SECONDARY_INITIAL);
  const [tertiaryValue, setTertiaryValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(tertiaryValue, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [tertiaryValue, onSuccess]);

  return (
    <Card title="Route Configuration" style={{ width: 600 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
            Primary route
          </label>
          <Cascader
            data-testid="route-primary-cascader"
            style={{ width: '100%' }}
            options={options}
            value={primaryValue}
            onChange={(val) => setPrimaryValue(val as string[])}
            placeholder="Select"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
            Secondary route
          </label>
          <Cascader
            data-testid="route-secondary-cascader"
            style={{ width: '100%' }}
            options={options}
            value={secondaryValue}
            onChange={(val) => setSecondaryValue(val as string[])}
            placeholder="Select"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
            Tertiary route
          </label>
          <Cascader
            data-testid="route-tertiary-cascader"
            style={{ width: '100%' }}
            options={options}
            value={tertiaryValue}
            onChange={(val) => setTertiaryValue(val as string[])}
            placeholder="Select"
          />
        </div>
      </div>
    </Card>
  );
}
