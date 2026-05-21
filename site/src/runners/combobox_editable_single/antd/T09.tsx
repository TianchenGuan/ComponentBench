'use client';

/**
 * combobox_editable_single-antd-T09: Select Newark (EWR) in a modal flight editor
 *
 * The page shows a small "Flight details" summary card with a primary button labeled "Edit flight".
 * Clicking it opens a modal dialog that contains the target combobox.
 * - Scene: modal_flow layout, center placement, light theme, comfortable spacing, default scale.
 * - Target component: inside the modal, an editable combobox labeled "Departure airport".
 * - Options (~18 airports) with several "New…" distractors.
 * - Initial state: empty.
 * - Distractors: Date field, Seat preference dropdown, Cancel/Close buttons.
 *
 * Success: The "Departure airport" combobox value equals "Newark (EWR)".
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography, Button, Modal, DatePicker, Select, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title, Paragraph } = Typography;

const airports = [
  { value: 'Newark (EWR)' },
  { value: 'New Orleans (MSY)' },
  { value: 'New York (JFK)' },
  { value: 'New York (LGA)' },
  { value: 'Newport News (PHF)' },
  { value: 'Boston (BOS)' },
  { value: 'Los Angeles (LAX)' },
  { value: 'San Francisco (SFO)' },
  { value: 'Seattle (SEA)' },
  { value: 'Denver (DEN)' },
  { value: 'Dallas (DFW)' },
  { value: 'Chicago (ORD)' },
  { value: 'Miami (MIA)' },
  { value: 'Atlanta (ATL)' },
  { value: 'Houston (IAH)' },
  { value: 'Phoenix (PHX)' },
  { value: 'Washington (DCA)' },
  { value: 'Philadelphia (PHL)' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [departureAirport, setDepartureAirport] = useState('');

  const handleAirportSelect = (selectedValue: string) => {
    setDepartureAirport(selectedValue);
    if (selectedValue === 'Newark (EWR)') {
      onSuccess();
    }
  };

  const handleAirportBlur = () => {
    if (departureAirport === 'Newark (EWR)') {
      onSuccess();
    }
  };

  return (
    <>
      <Card style={{ width: 350 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Flight details</Title>
        <Paragraph style={{ color: '#666' }}>
          Flight: AA1234<br />
          Date: March 15, 2025<br />
          Status: Confirmed
        </Paragraph>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Edit flight
        </Button>
      </Card>

      <Modal
        title="Flight details"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>Cancel</Button>,
        ]}
        width={450}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Departure airport</Text>
          <AutoComplete
            data-testid="departure-airport"
            style={{ width: '100%' }}
            options={airports}
            placeholder="Select airport"
            value={departureAirport}
            onChange={setDepartureAirport}
            onSelect={handleAirportSelect}
            onBlur={handleAirportBlur}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Date</Text>
          <DatePicker style={{ width: '100%' }} />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Seat preference</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Select preference"
            options={[
              { value: 'window', label: 'Window' },
              { value: 'aisle', label: 'Aisle' },
              { value: 'middle', label: 'Middle' },
            ]}
          />
        </div>
      </Modal>
    </>
  );
}
