'use client';

/**
 * virtual_list-mui-T01: Select a visible contact row
 *
 * Layout: isolated_card — a single MUI Paper centered with the title "Contacts".
 * Target component: a virtualized list (height ~400px, width ~360px) built with react-window
 * and rendered using MUI ListItemButton rows.
 * Row content: "Contact #### — <Full Name>" with a small secondary text (city) under the name.
 * Initial state: scrolled to top; no contact selected; helper text below reads "Selected: none".
 *
 * Success: Select row with key 'contact-0005'
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, ListItemButton, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';

interface ContactItem {
  key: string;
  id: string;
  name: string;
  city: string;
}

// Generate 200 contacts
const generateContacts = (): ContactItem[] => {
  const firstNames = ['Sam', 'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker'];
  const lastNames = ['Rivera', 'Kim', 'Chen', 'Patel', 'Smith', 'Johnson', 'Garcia', 'Martinez', 'Brown', 'Wilson'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Diego', 'Dallas', 'Austin', 'Seattle', 'Denver'];
  
  return Array.from({ length: 200 }, (_, i) => {
    const num = i + 1;
    let name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    // Special name for contact 5
    if (num === 5) name = 'Sam Rivera';
    return {
      key: `contact-${String(num).padStart(4, '0')}`,
      id: `Contact ${String(num).padStart(4, '0')}`,
      name,
      city: cities[i % cities.length],
    };
  });
};

const contacts = generateContacts();

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Check success condition
  useEffect(() => {
    if (selectedKey === 'contact-0005') {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = contacts[index];
    return (
      <ListItemButton
        style={style}
        selected={selectedKey === item.key}
        onClick={() => setSelectedKey(item.key)}
        data-item-key={item.key}
        aria-selected={selectedKey === item.key}
      >
        <ListItemText 
          primary={`${item.id} — ${item.name}`}
          secondary={item.city}
        />
      </ListItemButton>
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 360, p: 2 }} data-testid="vl-primary">
      <Typography variant="h6" gutterBottom>
        Contacts
      </Typography>
      <Paper variant="outlined" sx={{ mb: 1 }}>
        <FixedSizeList
          height={400}
          width="100%"
          itemSize={64}
          itemCount={contacts.length}
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      </Paper>
      <Typography variant="body2" color="text.secondary">
        Selected: {selectedKey ? contacts.find(c => c.key === selectedKey)?.id : 'none'}
      </Typography>
    </Paper>
  );
}
