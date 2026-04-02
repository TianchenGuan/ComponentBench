'use client';

/**
 * autocomplete_freeform-mantine-T05: Enter a custom country when two autocompletes exist
 *
 * setup_description:
 * A centered isolated card titled "Address" contains two Mantine Autocomplete inputs.
 *
 * Top input: labeled "City" with suggestions like Nairobi, Oslo, Paris.
 * Bottom input: labeled "Country" with suggestions like Kenya, Norway, France, but it still allows free input.
 *
 * Initial state: City is prefilled with "Oslo"; Country is empty. Both inputs look similar, so the agent must target the correct labeled instance. Feedback: the typed value appears in the Country input; suggestions may appear but are optional.
 *
 * Success: The Autocomplete labeled "Country" has displayed value "Wakanda" (case-insensitive, trimmed).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Autocomplete, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const cities = ['Nairobi', 'Oslo', 'Paris', 'London', 'Tokyo'];
const countries = ['Kenya', 'Norway', 'France', 'United Kingdom', 'Japan'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [cityValue, setCityValue] = useState('Oslo');
  const [countryValue, setCountryValue] = useState('');
  const successFired = useRef(false);

  const normalizedCountryValue = countryValue.trim().toLowerCase();
  const targetValue = 'wakanda';

  useEffect(() => {
    if (!successFired.current && normalizedCountryValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedCountryValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Address</Text>
      <Stack>
        <div>
          <Text fw={500} size="sm" mb={8}>City</Text>
          <Autocomplete
            data-testid="city"
            placeholder="Select city"
            data={cities}
            value={cityValue}
            onChange={setCityValue}
          />
        </div>
        <div>
          <Text fw={500} size="sm" mb={8}>Country</Text>
          <Autocomplete
            data-testid="country"
            placeholder="Select country"
            data={countries}
            value={countryValue}
            onChange={setCountryValue}
          />
        </div>
      </Stack>
    </Card>
  );
}
