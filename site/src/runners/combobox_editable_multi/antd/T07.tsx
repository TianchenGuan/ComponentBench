'use client';

/**
 * combobox_editable_multi-antd-T07: Match release labels from preview
 *
 * Dark theme isolated card titled "Release manager". The card is split into two columns:
 * Left column (interactive):
 * - Ant Design Select in tags mode labeled "Release labels"
 * - Placeholder: "Add release labels"
 * - Initial selected tags: "canary"
 * Right column (reference, non-interactive):
 * - A read-only row labeled "Target selection" showing the desired labels as colored chips.
 * - The preview shows exactly three chips: "staging", "prod-hotfix", and "canary".
 * The dropdown suggestion list contains many environment-related options (canary, staging, production, prod-hotfix, hotfix, rollback, etc.).
 * To succeed, the selected tags in "Release labels" must exactly match the reference chips (order does not matter).
 *
 * Success: Selected values equal {staging, prod-hotfix, canary} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography, Tag, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  { value: 'canary', label: 'canary' },
  { value: 'staging', label: 'staging' },
  { value: 'production', label: 'production' },
  { value: 'prod-hotfix', label: 'prod-hotfix' },
  { value: 'hotfix', label: 'hotfix' },
  { value: 'rollback', label: 'rollback' },
  { value: 'beta', label: 'beta' },
  { value: 'alpha', label: 'alpha' },
  { value: 'nightly', label: 'nightly' },
  { value: 'release', label: 'release' },
];

const TARGET_SET = ['staging', 'prod-hotfix', 'canary'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['canary']);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Release manager" style={{ width: 600 }}>
      <Row gutter={24}>
        <Col span={12}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Release labels</Text>
          <Select
            data-testid="release-labels"
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add release labels"
            value={value}
            onChange={setValue}
            options={options}
          />
        </Col>
        <Col span={12}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Target selection</Text>
          <div data-testid="target-selection-preview" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Tag color="blue">staging</Tag>
            <Tag color="orange">prod-hotfix</Tag>
            <Tag color="green">canary</Tag>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
