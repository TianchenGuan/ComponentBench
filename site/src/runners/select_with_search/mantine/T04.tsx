'use client';

/**
 * select_with_search-mantine-T04: Set Destination airport to SFO (two selects)
 *
 * Layout: form_section centered titled "Flight".
 * Two Mantine searchable Selects appear in the form:
 *  - "Home airport" (initial value: JFK - New York)
 *  - "Destination airport" ← TARGET (initial value: empty)
 * Each Select supports filtering by typing in the search field when the dropdown is open.
 * Options: a medium list of airport codes formatted "CODE - City" (e.g., LAX - Los Angeles, SFO - San Francisco, SEA - Seattle, BOS - Boston, ORD - Chicago).
 * Clutter (low): additional non-target fields (Date, Seat class) appear, but they do not affect success.
 * Feedback: selecting an airport fills the Select input with the chosen label.
 *
 * Success: The selected value of the "Destination airport" Select equals "SFO - San Francisco".
 */

import React, { useState } from 'react';
import { Card, Text, Select, Grid, TextInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const airportOptions = [
  { value: 'JFK - New York', label: 'JFK - New York' },
  { value: 'LAX - Los Angeles', label: 'LAX - Los Angeles' },
  { value: 'SFO - San Francisco', label: 'SFO - San Francisco' },
  { value: 'SEA - Seattle', label: 'SEA - Seattle' },
  { value: 'BOS - Boston', label: 'BOS - Boston' },
  { value: 'ORD - Chicago', label: 'ORD - Chicago' },
  { value: 'ATL - Atlanta', label: 'ATL - Atlanta' },
  { value: 'DFW - Dallas', label: 'DFW - Dallas' },
  { value: 'MIA - Miami', label: 'MIA - Miami' },
  { value: 'DEN - Denver', label: 'DEN - Denver' },
];

const seatClassOptions = [
  { value: 'Economy', label: 'Economy' },
  { value: 'Business', label: 'Business' },
  { value: 'First', label: 'First' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [homeAirport, setHomeAirport] = useState<string | null>('JFK - New York');
  const [destAirport, setDestAirport] = useState<string | null>(null);
  const [seatClass, setSeatClass] = useState<string | null>('Economy');

  const handleDestChange = (newValue: string | null) => {
    setDestAirport(newValue);
    if (newValue === 'SFO - San Francisco') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Flight</Text>
      
      <Grid>
        <Grid.Col span={6}>
          <Select
            data-testid="home-airport-select"
            label="Home airport"
            searchable
            data={airportOptions}
            value={homeAirport}
            onChange={setHomeAirport}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            data-testid="destination-airport-select"
            label="Destination airport"
            placeholder="Select airport"
            searchable
            data={airportOptions}
            value={destAirport}
            onChange={handleDestChange}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Date"
            defaultValue="2026-03-15"
            readOnly
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Seat class"
            data={seatClassOptions}
            value={seatClass}
            onChange={setSeatClass}
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
}
