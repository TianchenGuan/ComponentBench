'use client';

/**
 * virtual_list-mui-T03: Scroll until a specific row is visible
 *
 * Layout: isolated_card — centered Paper titled "Contacts".
 * Target component: virtualized list (react-window) with 500 contacts; only visible rows are mounted.
 * Initial state: scrolled to the top (Contact 0001…); no selection.
 *
 * Success: Contact 0035 (key 'contact-0035') is visible (at least 60% in viewport)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paper, Typography, ListItemButton, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';

interface ContactItem {
  key: string;
  id: string;
  name: string;
}

// Generate 500 contacts
const generateContacts = (): ContactItem[] => {
  const firstNames = ['Amina', 'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker'];
  const lastNames = ['Yusuf', 'Kim', 'Chen', 'Patel', 'Smith', 'Johnson', 'Garcia', 'Martinez', 'Brown', 'Wilson'];
  
  return Array.from({ length: 500 }, (_, i) => {
    const num = i + 1;
    let name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    // Special name for contact 35
    if (num === 35) name = 'Amina Yusuf';
    return {
      key: `contact-${String(num).padStart(4, '0')}`,
      id: `Contact ${String(num).padStart(4, '0')}`,
      name,
    };
  });
};

const contacts = generateContacts();

export default function T03({ onSuccess }: TaskComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  const checkVisibility = useCallback(() => {
    if (hasCompleted) return;
    
    const targetElement = containerRef.current?.querySelector('[data-item-key="contact-0035"]');
    if (!targetElement) return;

    const listEl = listRef.current;
    if (!listEl) return;

    const itemRect = targetElement.getBoundingClientRect();
    const containerRect = listEl.getBoundingClientRect();
    
    const visibleTop = Math.max(itemRect.top, containerRect.top);
    const visibleBottom = Math.min(itemRect.bottom, containerRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const itemHeight = itemRect.height;
    
    if (itemHeight > 0 && visibleHeight / itemHeight >= 0.6) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [hasCompleted, onSuccess]);

  useEffect(() => {
    const interval = setInterval(checkVisibility, 100);
    return () => clearInterval(interval);
  }, [checkVisibility]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = contacts[index];
    return (
      <ListItemButton
        style={style}
        data-item-key={item.key}
      >
        <ListItemText primary={`${item.id} — ${item.name}`} />
      </ListItemButton>
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 360, p: 2 }} data-testid="vl-primary" ref={containerRef}>
      <Typography variant="h6" gutterBottom>
        Contacts
      </Typography>
      <Paper variant="outlined" ref={listRef}>
        <FixedSizeList
          height={400}
          width="100%"
          itemSize={48}
          itemCount={contacts.length}
          overscanCount={5}
          onScroll={checkVisibility}
        >
          {Row}
        </FixedSizeList>
      </Paper>
    </Paper>
  );
}
