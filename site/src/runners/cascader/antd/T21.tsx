'use client';

/**
 * cascader-antd-T21: Lazy-loaded options (dark): select Hardware / Printers / Setup
 *
 * Theme: dark.
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Knowledge base category", configured with loadData for lazy loading.
 * Behavior: only the first column is populated initially. When a node is selected, the next column shows a loading
 * spinner briefly and then renders fetched children.
 * Option structure (as it appears after loading):
 *   - Hardware → Printers → Setup (target), Troubleshooting
 *   - Hardware → Monitors → Calibration
 *   - Software → VPN → Installation
 * Constraints: showSearch is disabled (not available with loadData).
 * Initial state: blank.
 * Feedback: a subtle loading indicator appears in the dropdown column while children load.
 *
 * Success: path_labels equal [Hardware, Printers, Setup], path_values equal ['hw','printers','setup']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

interface Option {
  value: string;
  label: string;
  isLeaf?: boolean;
  children?: Option[];
  loading?: boolean;
}

const TARGET_PATH = ['hw', 'printers', 'setup'];

// Simulated async data
const childData: Record<string, Option[]> = {
  hw: [
    { value: 'printers', label: 'Printers', isLeaf: false },
    { value: 'monitors', label: 'Monitors', isLeaf: false },
  ],
  printers: [
    { value: 'setup', label: 'Setup', isLeaf: true },
    { value: 'troubleshooting', label: 'Troubleshooting', isLeaf: true },
  ],
  monitors: [
    { value: 'calibration', label: 'Calibration', isLeaf: true },
  ],
  sw: [
    { value: 'vpn', label: 'VPN', isLeaf: false },
  ],
  vpn: [
    { value: 'installation', label: 'Installation', isLeaf: true },
  ],
};

export default function T21({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState<Option[]>([
    { value: 'hw', label: 'Hardware', isLeaf: false },
    { value: 'sw', label: 'Software', isLeaf: false },
  ]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const loadData = (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    setOptions([...options]);

    // Simulate async loading
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = childData[targetOption.value] || [];
      setOptions([...options]);
    }, 300);
  };

  return (
    <Card title="Knowledge Base" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Knowledge base category
        </label>
        <Cascader
          data-testid="kb-category-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          loadData={loadData}
          placeholder="Select category"
        />
      </div>
    </Card>
  );
}
