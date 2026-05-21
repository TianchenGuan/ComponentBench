'use client';

/**
 * cascader-antd-T28: Modal flow: set Allowed destinations to Asia / Singapore / Downtown
 *
 * Layout: modal flow.
 * Clutter: low — a simple page with a single primary button and a modal dialog.
 * Entry point: a button labeled "Edit shipping rule". Clicking it opens a modal.
 * Inside the modal:
 *   - A short description paragraph
 *   - The target AntD Cascader labeled "Allowed destinations"
 *   - Modal footer buttons: Cancel and Save (these are NOT required for task success)
 * Cascader options: Region → Country → Area:
 *   - Asia → Singapore → Downtown (target), Airport
 *   - Europe → Germany → Berlin
 *   - Americas → USA → New York
 * Initial state: Allowed destinations is blank.
 * Behavior: selection commits on leaf click within the cascader dropdown.
 *
 * Success: path_labels equal [Asia, Singapore, Downtown], path_values equal ['asia','sg','downtown']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'sg',
        label: 'Singapore',
        children: [
          { value: 'downtown', label: 'Downtown' },
          { value: 'airport', label: 'Airport' },
        ],
      },
    ],
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'de',
        label: 'Germany',
        children: [
          { value: 'berlin', label: 'Berlin' },
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
        ],
      },
    ],
  },
];

const TARGET_PATH = ['asia', 'sg', 'downtown'];

export default function T28({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Shipping Configuration" style={{ width: 400 }}>
      <p style={{ marginBottom: 16, color: '#666' }}>
        Configure shipping rules for your store.
      </p>
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Edit shipping rule
      </Button>

      <Modal
        title="Edit Shipping Rule"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={() => setModalOpen(false)}>
            Save
          </Button>,
        ]}
        data-testid="edit-shipping-modal"
      >
        <p style={{ marginBottom: 16, color: '#666' }}>
          Select the allowed destinations for this shipping rule.
        </p>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Allowed destinations
          </label>
          <Cascader
            data-testid="allowed-destinations-cascader"
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[])}
            placeholder="Select destinations"
          />
        </div>
      </Modal>
    </Card>
  );
}
