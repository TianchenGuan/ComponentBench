'use client';

/**
 * cascader-antd-v2-T21: Search exact repeated-name branch inside modal selector
 *
 * Dark modal flow. "Choose office city" button opens a modal with a Cascader
 * "Office city" with showSearch. Typing "Santo" reveals matched paths including
 * Brazil / São Paulo / Santo André, Brazil / São Paulo / Santo Amaro, and
 * Dominican Republic / Santo Domingo / Zona Colonial. Select the Santo André path,
 * then click "Save city".
 *
 * Success: path equals [Brazil, São Paulo, Santo André], "Save city" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Modal, Cascader, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'brazil',
    label: 'Brazil',
    children: [
      {
        value: 'sao-paulo',
        label: 'São Paulo',
        children: [
          { value: 'santo-andre', label: 'Santo André' },
          { value: 'santo-amaro', label: 'Santo Amaro' },
          { value: 'campinas', label: 'Campinas' },
        ],
      },
      {
        value: 'rio-de-janeiro',
        label: 'Rio de Janeiro',
        children: [
          { value: 'copacabana', label: 'Copacabana' },
        ],
      },
    ],
  },
  {
    value: 'dominican-republic',
    label: 'Dominican Republic',
    children: [
      {
        value: 'santo-domingo',
        label: 'Santo Domingo',
        children: [
          { value: 'zona-colonial', label: 'Zona Colonial' },
          { value: 'piantini', label: 'Piantini' },
        ],
      },
    ],
  },
  {
    value: 'colombia',
    label: 'Colombia',
    children: [
      {
        value: 'bogota',
        label: 'Bogotá',
        children: [
          { value: 'chapinero', label: 'Chapinero' },
        ],
      },
    ],
  },
  {
    value: 'argentina',
    label: 'Argentina',
    children: [
      {
        value: 'buenos-aires',
        label: 'Buenos Aires',
        children: [
          { value: 'palermo', label: 'Palermo' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['brazil', 'sao-paulo', 'santo-andre'];

export default function T21({ onSuccess }: TaskComponentProps) {
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
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ background: '#141414', minHeight: '100vh', padding: 24 }}>
        <Card
          title="Office Management"
          style={{ width: 420, margin: '0 auto', background: '#1f1f1f', borderColor: '#333' }}
        >
          <p style={{ color: '#999', marginBottom: 16 }}>
            Select the city for your regional office location.
          </p>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Choose office city
          </Button>
        </Card>

        <Modal
          title="Choose Office City"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>Save city</Button>
            </div>
          }
        >
          <p style={{ marginBottom: 16, color: '#999' }}>
            Use search to quickly find the target city.
          </p>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Office city
            </label>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={value}
              onChange={(val) => setValue(val as string[])}
              placeholder="Search city..."
              showSearch
            />
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
