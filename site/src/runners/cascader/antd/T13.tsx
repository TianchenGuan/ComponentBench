'use client';

/**
 * cascader-antd-T13: Form section: set Department to Engineering / Platform / Infrastructure
 *
 * Layout: form section (a realistic intake form) centered on the page.
 * Clutter: low — there are several non-required fields.
 * Components on the form:
 *   - Text input: "Project name" (pre-filled)
 *   - Select: "Priority" (default set)
 *   - Cascader (target): "Department"
 * Department options: Division → Group → Team:
 *   - Engineering → Platform → Infrastructure (target), Developer Experience
 *   - Engineering → Product → Web, Mobile
 *   - Sales → Enterprise → North America
 * Initial state: Department is blank.
 * Behavior: Department cascader commits on leaf click; no Save/Submit is required for this task.
 *
 * Success: path_labels equal [Engineering, Platform, Infrastructure], path_values equal ['eng','platform','infra']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader, Input, Select } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const departmentOptions = [
  {
    value: 'eng',
    label: 'Engineering',
    children: [
      {
        value: 'platform',
        label: 'Platform',
        children: [
          { value: 'infra', label: 'Infrastructure' },
          { value: 'devex', label: 'Developer Experience' },
        ],
      },
      {
        value: 'product',
        label: 'Product',
        children: [
          { value: 'web', label: 'Web' },
          { value: 'mobile', label: 'Mobile' },
        ],
      },
    ],
  },
  {
    value: 'sales',
    label: 'Sales',
    children: [
      {
        value: 'enterprise',
        label: 'Enterprise',
        children: [
          { value: 'na', label: 'North America' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['eng', 'platform', 'infra'];

export default function T13({ onSuccess }: TaskComponentProps) {
  const [departmentValue, setDepartmentValue] = useState<string[]>([]);
  const [projectName] = useState('Q4 Platform Migration');
  const [priority] = useState('high');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(departmentValue, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [departmentValue, onSuccess]);

  return (
    <Card title="Project Intake Form" style={{ width: 500 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Project name
        </label>
        <Input
          value={projectName}
          readOnly
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Priority
        </label>
        <Select
          value={priority}
          style={{ width: '100%' }}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          disabled
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Department
        </label>
        <Cascader
          data-testid="department-cascader"
          style={{ width: '100%' }}
          options={departmentOptions}
          value={departmentValue}
          onChange={(val) => setDepartmentValue(val as string[])}
          placeholder="Select department"
        />
      </div>
    </Card>
  );
}
