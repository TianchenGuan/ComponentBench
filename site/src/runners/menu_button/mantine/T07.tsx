'use client';

/**
 * menu_button-mantine-T07: Select New Zealand from long country list
 * 
 * Layout: isolated_card placed near the bottom-left of the viewport.
 * Spacing is compact and component scale is small.
 * There is one menu button labeled "Choose country: United States".
 * 
 * Opening the menu shows a constrained-height dropdown with a scrollable list of countries.
 * The target "New Zealand" appears far down the list, requiring scrolling.
 * 
 * Initial state: United States is selected.
 * Success: The selected country equals "New Zealand".
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text, ScrollArea } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia',
  'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile',
  'China', 'Colombia', 'Denmark', 'Egypt', 'Finland',
  'France', 'Germany', 'Greece', 'Hungary', 'India',
  'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan',
  'Kenya', 'Malaysia', 'Mexico', 'Netherlands', 'New Caledonia',
  'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden',
  'Switzerland', 'Thailand', 'Turkey', 'United Kingdom', 'United States',
  'Vietnam',
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedCountry === 'New Zealand' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedCountry, successTriggered, onSuccess]);

  const handleSelect = (country: string) => {
    setSelectedCountry(country);
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 280 }}>
      <Text fw={600} size="sm" mb="sm">Location</Text>
      
      <Menu>
        <Menu.Target>
          <Button
            variant="default"
            size="xs"
            rightSection={<IconChevronDown size={14} />}
            data-testid="menu-button-choose-country"
          >
            Choose country: {selectedCountry}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <ScrollArea.Autosize mah={200}>
            {countries.map(country => (
              <Menu.Item
                key={country}
                onClick={() => handleSelect(country)}
                style={{ fontSize: 12 }}
              >
                {country}
              </Menu.Item>
            ))}
          </ScrollArea.Autosize>
        </Menu.Dropdown>
      </Menu>
    </Card>
  );
}
