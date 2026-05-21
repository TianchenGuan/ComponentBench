'use client';

/**
 * cascader-antd-T04: Inline panel: select Engineering / Frontend / Web Platform
 *
 * Layout: isolated card centered on the page.
 * Component: an inline AntD Cascader.Panel labeled "Team routing" (always visible; no trigger input).
 * Panel layout: three adjacent columns are shown at once (Department → Team → Subteam).
 * Options (representative):
 *   - Engineering → Frontend → Web Platform, Design Systems
 *   - Engineering → Backend → Payments, Data
 *   - Operations → IT → Helpdesk
 * Initial state: nothing selected in the panel.
 * Distractors: none; the panel is the only interactive component in the card.
 *
 * Success: path_labels equal [Engineering, Frontend, Web Platform], path_values equal ['eng','fe','web-platform']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'eng',
    label: 'Engineering',
    children: [
      {
        value: 'fe',
        label: 'Frontend',
        children: [
          { value: 'web-platform', label: 'Web Platform' },
          { value: 'design-systems', label: 'Design Systems' },
        ],
      },
      {
        value: 'be',
        label: 'Backend',
        children: [
          { value: 'payments', label: 'Payments' },
          { value: 'data', label: 'Data' },
        ],
      },
    ],
  },
  {
    value: 'ops',
    label: 'Operations',
    children: [
      {
        value: 'it',
        label: 'IT',
        children: [
          { value: 'helpdesk', label: 'Helpdesk' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['eng', 'fe', 'web-platform'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Team Routing" style={{ width: 600 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Team routing
        </label>
        <div data-testid="team-routing-cascader-panel">
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
