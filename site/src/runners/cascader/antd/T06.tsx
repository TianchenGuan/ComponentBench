'use client';

/**
 * cascader-antd-T06: Two instances: set Primary office to North America / Canada / Vancouver
 *
 * Layout: isolated card centered on the page.
 * Components: two AntD Cascader inputs using the same options tree.
 *   1) "Primary office" (target)
 *   2) "Backup office" (distractor)
 * Options: Continent → Country → City:
 *   - North America → USA → Seattle, Austin
 *   - North America → Canada → Vancouver, Montreal
 *   - Europe → UK → London
 * Initial state: Primary office is blank; Backup office is preselected to "Europe / UK / London".
 * Distractors: the two fields are visually similar; only the label distinguishes them.
 *
 * Success: Primary office has path_labels [North America, Canada, Vancouver], path_values ['na','ca','vancouver']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'na',
    label: 'North America',
    children: [
      {
        value: 'usa',
        label: 'USA',
        children: [
          { value: 'seattle', label: 'Seattle' },
          { value: 'austin', label: 'Austin' },
        ],
      },
      {
        value: 'ca',
        label: 'Canada',
        children: [
          { value: 'vancouver', label: 'Vancouver' },
          { value: 'montreal', label: 'Montreal' },
        ],
      },
    ],
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'uk',
        label: 'UK',
        children: [
          { value: 'london', label: 'London' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['na', 'ca', 'vancouver'];
const BACKUP_INITIAL = ['europe', 'uk', 'london'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<string[]>([]);
  const [backupValue, setBackupValue] = useState<string[]>(BACKUP_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(primaryValue, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [primaryValue, onSuccess]);

  return (
    <Card title="Office Selection" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Primary office
        </label>
        <Cascader
          data-testid="cascader-primary-office"
          style={{ width: '100%' }}
          options={options}
          value={primaryValue}
          onChange={(val) => setPrimaryValue(val as string[])}
          placeholder="Please select"
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Backup office
        </label>
        <Cascader
          data-testid="cascader-backup-office"
          style={{ width: '100%' }}
          options={options}
          value={backupValue}
          onChange={(val) => setBackupValue(val as string[])}
          placeholder="Please select"
        />
      </div>
    </Card>
  );
}
