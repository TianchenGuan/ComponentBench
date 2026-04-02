'use client';

/**
 * cascader-antd-v2-T08: Modal shipping rule with deep destination leaf
 *
 * A button "Edit shipping rule" opens a modal. Inside: one Cascader labeled
 * "Allowed destinations". The destination tree has several three-level branches
 * under Asia, including Airport, Downtown, and Harbor under Singapore.
 * Select Asia / Singapore / Downtown, then click "Save rule".
 *
 * Success: path equals [Asia, Singapore, Downtown], "Save rule" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Modal, Cascader, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'singapore',
        label: 'Singapore',
        children: [
          { value: 'airport', label: 'Airport' },
          { value: 'downtown', label: 'Downtown' },
          { value: 'harbor', label: 'Harbor' },
        ],
      },
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
    ],
  },
  {
    value: 'americas',
    label: 'Americas',
    children: [
      {
        value: 'usa',
        label: 'USA',
        children: [
          { value: 'new-york', label: 'New York' },
          { value: 'los-angeles', label: 'Los Angeles' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['asia', 'singapore', 'downtown'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleSave = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Shipping Configuration" style={{ width: 460, margin: '0 auto' }}>
        <Typography.Paragraph type="secondary">
          Configure shipping rules and allowed destinations for your store.
        </Typography.Paragraph>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Edit shipping rule
        </Button>
      </Card>

      <Modal
        title="Edit Shipping Rule"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save rule</Button>
          </div>
        }
      >
        <p style={{ marginBottom: 16, color: '#666' }}>
          Select the allowed destinations for this shipping rule.
        </p>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Allowed destinations
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[])}
            placeholder="Select destinations"
          />
        </div>
      </Modal>
    </div>
  );
}
