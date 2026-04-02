'use client';

/**
 * combobox_editable_single-mantine-T06: Scroll to select Norway inside a drawer
 *
 * The page shows a compact header with a button labeled "Advanced settings".
 * Clicking it opens a right-side drawer. Inside the drawer is an editable combobox
 * labeled "Country", implemented using Mantine Combobox primitives (a searchable dropdown pattern).
 * - Scene: drawer_flow layout, right-side drawer anchored, light theme, comfortable spacing, default scale.
 * - Component behavior: Clicking the Country input opens a scrollable dropdown list.
 * - Options (~40 countries): Argentina, Australia, etc.
 * - Initial state: empty.
 * - Distractors: two toggles and a Close icon in the drawer header.
 *
 * Success: The "Country" combobox value equals "Norway".
 */

import React, { useState } from 'react';
import { Card, Text, Button, Drawer, Switch, Stack, Combobox, InputBase, useCombobox, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const countries = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada',
  'Denmark', 'Finland', 'France', 'Germany', 'Iceland', 'India',
  'Italy', 'Japan', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
  'Portugal', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',
  'Chile', 'Colombia', 'Czech Republic', 'Egypt', 'Greece', 'Hungary',
  'Indonesia', 'Ireland', 'Israel', 'Malaysia', 'Philippines', 'Poland',
  'Singapore', 'South Africa', 'South Korea', 'Thailand',
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch('');
    },
  });

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  const options = filteredCountries.map((country) => (
    <Combobox.Option value={country} key={country}>
      {country}
    </Combobox.Option>
  ));

  const handleOptionSubmit = (val: string) => {
    setValue(val);
    combobox.closeDropdown();
    if (val === 'Norway') {
      onSuccess();
    }
  };

  return (
    <>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 300 }}>
        <Text fw={500} mb="md">Settings</Text>
        <Button onClick={() => setDrawerOpen(true)}>Advanced settings</Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Advanced settings"
        position="right"
        size="md"
      >
        <Stack gap="md">
          <div>
            <Text fw={500} size="sm" mb={8}>Country</Text>
            <Combobox
              store={combobox}
              onOptionSubmit={handleOptionSubmit}
            >
              <Combobox.Target>
                <InputBase
                  data-testid="country-combobox"
                  pointer
                  rightSection={<Combobox.Chevron />}
                  rightSectionPointerEvents="none"
                  onClick={() => combobox.toggleDropdown()}
                  value={value || ''}
                  placeholder="Select country"
                  readOnly
                />
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Search
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder="Search countries"
                />
                <ScrollArea.Autosize mah={200}>
                  <Combobox.Options>
                    {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                  </Combobox.Options>
                </ScrollArea.Autosize>
              </Combobox.Dropdown>
            </Combobox>
          </div>

          <Switch label="Enable notifications" />
          <Switch label="Auto-save drafts" />
        </Stack>
      </Drawer>
    </>
  );
}
