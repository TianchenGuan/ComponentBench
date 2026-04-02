'use client';

/**
 * autocomplete_freeform-antd-v2-T03: Table row city binding with diacritic near-misses
 *
 * Deployment table with three rows (Service A, B, C). Service B and C have editable
 * "Rollout city" AutoCompletes with confusable diacritic options. Select `San José (CR)`
 * for Service B via suggestion, then click the row-local "Save". Service C stays `São Paulo`.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AutoComplete, Button, Card, Table, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const citySuggestions = [
  { value: 'San Jose' },
  { value: 'San José' },
  { value: 'San José (CR)' },
  { value: 'Santo Domingo' },
  { value: 'São Paulo' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [serviceBCity, setServiceBCity] = useState('');
  const [serviceBFromSuggestion, setServiceBFromSuggestion] = useState(false);
  const [serviceCCity, setServiceCCity] = useState('São Paulo');
  const [savedB, setSavedB] = useState(false);
  const successFired = useRef(false);

  const handleSaveB = useCallback(() => {
    setSavedB(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !savedB) return;
    if (
      serviceBCity === 'San José (CR)' &&
      serviceBFromSuggestion &&
      serviceCCity === 'São Paulo'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [savedB, serviceBCity, serviceBFromSuggestion, serviceCCity, onSuccess]);

  const columns = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 120,
      render: (name: string) => <Text strong>{name}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
    { title: 'Rollout city', dataIndex: 'city', key: 'city', width: 220,
      render: (_: unknown, record: { service: string }) => {
        if (record.service === 'Service A') return <Text type="secondary">N/A</Text>;
        if (record.service === 'Service B') {
          return (
            <AutoComplete
              data-testid="city-service-b"
              size="small"
              style={{ width: '100%' }}
              options={citySuggestions}
              value={serviceBCity}
              onChange={(val) => { setServiceBCity(val); setServiceBFromSuggestion(false); }}
              onSelect={(val) => { setServiceBCity(val); setServiceBFromSuggestion(true); }}
              placeholder="Select city"
              filterOption={(input, option) =>
                option!.value.toLowerCase().includes(input.toLowerCase())
              }
            />
          );
        }
        return (
          <AutoComplete
            data-testid="city-service-c"
            size="small"
            style={{ width: '100%' }}
            options={citySuggestions}
            value={serviceCCity}
            onChange={setServiceCCity}
            placeholder="Select city"
            filterOption={(input, option) =>
              option!.value.toLowerCase().includes(input.toLowerCase())
            }
          />
        );
      },
    },
    { title: 'Action', key: 'action', width: 80,
      render: (_: unknown, record: { service: string }) => {
        if (record.service === 'Service A') return null;
        if (record.service === 'Service B') {
          return <Button size="small" type="primary" data-testid="save-service-b" onClick={handleSaveB}>Save</Button>;
        }
        return <Button size="small">Save</Button>;
      },
    },
  ];

  const data = [
    { key: 'a', service: 'Service A', status: 'active' },
    { key: 'b', service: 'Service B', status: 'pending' },
    { key: 'c', service: 'Service C', status: 'active' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Deployment Table" style={{ maxWidth: 640 }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
