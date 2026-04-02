'use client';

/**
 * cascader-antd-v2-T19: Four-instance high-clutter routing panel — edit only Backup route
 *
 * High-contrast settings panel with four Cascaders: Primary route (prefilled
 * North America / USA / Seattle), Secondary route (Europe / Germany / Berlin),
 * Archive route (Asia / Japan / Tokyo), and Backup route (empty, target).
 * Set Backup route to North America / Canada / Vancouver, then click "Save panel".
 * All other routes must remain unchanged.
 *
 * Success: Backup path equals [North America, Canada, Vancouver], others unchanged,
 *          "Save panel" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Switch, Tag, Segmented, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'north-america',
    label: 'North America',
    children: [
      {
        value: 'usa',
        label: 'USA',
        children: [
          { value: 'seattle', label: 'Seattle' },
          { value: 'portland', label: 'Portland' },
          { value: 'new-york', label: 'New York' },
        ],
      },
      {
        value: 'canada',
        label: 'Canada',
        children: [
          { value: 'vancouver', label: 'Vancouver' },
          { value: 'toronto', label: 'Toronto' },
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
        value: 'germany',
        label: 'Germany',
        children: [
          { value: 'berlin', label: 'Berlin' },
          { value: 'munich', label: 'Munich' },
        ],
      },
      {
        value: 'uk',
        label: 'UK',
        children: [
          { value: 'london', label: 'London' },
        ],
      },
    ],
  },
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'japan',
        label: 'Japan',
        children: [
          { value: 'tokyo', label: 'Tokyo' },
          { value: 'osaka', label: 'Osaka' },
        ],
      },
    ],
  },
];

const PRIMARY_INITIAL = ['north-america', 'usa', 'seattle'];
const SECONDARY_INITIAL = ['europe', 'germany', 'berlin'];
const ARCHIVE_INITIAL = ['asia', 'japan', 'tokyo'];
const TARGET_PATH = ['north-america', 'canada', 'vancouver'];

export default function T19({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<string[]>(PRIMARY_INITIAL);
  const [secondaryValue, setSecondaryValue] = useState<string[]>(SECONDARY_INITIAL);
  const [backupValue, setBackupValue] = useState<string[]>([]);
  const [archiveValue, setArchiveValue] = useState<string[]>(ARCHIVE_INITIAL);
  const successFired = useRef(false);

  const handleSave = () => {
    if (
      !successFired.current &&
      pathEquals(backupValue, TARGET_PATH) &&
      pathEquals(primaryValue, PRIMARY_INITIAL) &&
      pathEquals(secondaryValue, SECONDARY_INITIAL) &&
      pathEquals(archiveValue, ARCHIVE_INITIAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider
      theme={{ algorithm: theme.darkAlgorithm, token: { colorBgBase: '#000' } }}
      componentSize="small"
    >
      <div style={{ background: '#000', minHeight: '100vh', padding: 24 }}>
        <div style={{ maxWidth: 540, margin: '0 0 0 80px' }}>
          <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag color="green">CDN Active</Tag>
            <Tag>Region: Global</Tag>
            <Segmented options={['Overview', 'Routes', 'Logs']} defaultValue="Routes" size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#ccc' }}>Auto-failover</span>
            <Switch defaultChecked size="small" />
          </div>

          <Card
            title="Route Configuration"
            size="small"
            style={{ background: '#111', borderColor: '#333' }}
          >
            {[
              { label: 'Primary route', val: primaryValue, set: setPrimaryValue },
              { label: 'Secondary route', val: secondaryValue, set: setSecondaryValue },
              { label: 'Backup route', val: backupValue, set: setBackupValue },
              { label: 'Archive route', val: archiveValue, set: setArchiveValue },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', marginBottom: 2, fontWeight: 500, fontSize: 12, color: '#ccc' }}>
                  {item.label}
                </label>
                <Cascader
                  style={{ width: '100%' }}
                  options={options}
                  value={item.val}
                  onChange={(val) => item.set(val as string[])}
                  placeholder="Select route"
                />
              </div>
            ))}
            <Button type="primary" style={{ marginTop: 8 }} onClick={handleSave}>
              Save panel
            </Button>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
