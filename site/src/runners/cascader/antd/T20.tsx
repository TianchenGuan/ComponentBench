'use client';

/**
 * cascader-antd-T20: Settings panel: choose Access scope in inline panel (4 levels)
 *
 * Layout: settings panel with multiple sections.
 * Clutter: low — there are a few toggles and helper texts, but only one cascader panel.
 * Target component: an inline AntD Cascader.Panel labeled "Access scope".
 * Panel structure: four columns visible as you drill down (Scope → Region → Site → Zone).
 * Options (representative):
 *   - Organization → North America → Seattle → Zone 1, Zone 2
 *   - Organization → Europe → Dublin → Zone 1, Zone 2 (target)
 *   - Team only → (no further levels)
 * Initial state: no selection.
 * Distractors: nearby switches like "Enable SSO" and "Read-only mode" are present but irrelevant.
 *
 * Success: path_labels equal [Organization, Europe, Dublin, Zone 2], path_values equal ['org','eu','dublin','zone-2']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader, Switch } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'org',
    label: 'Organization',
    children: [
      {
        value: 'na',
        label: 'North America',
        children: [
          {
            value: 'seattle',
            label: 'Seattle',
            children: [
              { value: 'zone-1', label: 'Zone 1' },
              { value: 'zone-2', label: 'Zone 2' },
            ],
          },
        ],
      },
      {
        value: 'eu',
        label: 'Europe',
        children: [
          {
            value: 'dublin',
            label: 'Dublin',
            children: [
              { value: 'zone-1', label: 'Zone 1' },
              { value: 'zone-2', label: 'Zone 2' },
            ],
          },
        ],
      },
    ],
  },
  {
    value: 'team-only',
    label: 'Team only',
  },
];

const TARGET_PATH = ['org', 'eu', 'dublin', 'zone-2'];

export default function T20({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const [ssoEnabled] = useState(false);
  const [readOnly] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Security Settings" style={{ width: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 500 }}>Enable SSO</div>
            <div style={{ fontSize: 12, color: '#888' }}>Single sign-on for all users</div>
          </div>
          <Switch checked={ssoEnabled} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 500 }}>Read-only mode</div>
            <div style={{ fontSize: 12, color: '#888' }}>Prevent all write operations</div>
          </div>
          <Switch checked={readOnly} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Access scope
        </label>
        <div data-testid="access-scope-cascader-panel">
          <Cascader.Panel
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[])}
          />
        </div>
      </div>
    </Card>
  );
}
