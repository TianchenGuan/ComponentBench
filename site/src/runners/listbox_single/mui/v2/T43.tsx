'use client';

/**
 * listbox_single-mui-v2-T43: Grouped export defaults: scroll to CSV exports and save
 *
 * A nested panel has a fixed-height MUI List with non-selectable section headers (Reports,
 * Exports, Logs). Only item rows are selectable. "CSV exports" is below the visible area under
 * "Exports". "Save defaults" commits the choice. Page is also scrollable, but the list has its
 * own scrollbar.
 *
 * Success: Export defaults = "csv_exports", "Save defaults" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, List, ListItemButton,
  ListItemText, ListSubheader, Divider, Box, Chip, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

interface SectionGroup {
  header: string;
  items: { value: string; label: string }[];
}

const groups: SectionGroup[] = [
  { header: 'Reports', items: [
    { value: 'daily_summary', label: 'Daily summary' },
    { value: 'weekly_digest', label: 'Weekly digest' },
    { value: 'monthly_review', label: 'Monthly review' },
    { value: 'quarterly_report', label: 'Quarterly report' },
  ]},
  { header: 'Exports', items: [
    { value: 'pdf_exports', label: 'PDF exports' },
    { value: 'csv_exports', label: 'CSV exports' },
    { value: 'json_exports', label: 'JSON exports' },
  ]},
  { header: 'Logs', items: [
    { value: 'audit_logs', label: 'Audit logs' },
    { value: 'error_logs', label: 'Error logs' },
    { value: 'access_logs', label: 'Access logs' },
  ]},
];

export default function T43({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('daily_summary');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && selected === 'csv_exports') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selected, onSuccess]);

  const handleSelect = (value: string) => {
    setSelected(value);
    setSaved(false);
  };

  return (
    <div style={{ padding: 24, minHeight: '120vh', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Export defaults</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Choose the default output when generating bulk data.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Chip label="Workspace: Production" size="small" />
            <Chip label="Format: auto" size="small" />
          </Stack>

          <List
            data-cb-listbox-root
            data-cb-selected-value={selected}
            sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}
            subheader={<li />}
          >
            {groups.map(group => (
              <li key={group.header}>
                <ul style={{ padding: 0 }}>
                  <ListSubheader sx={{ bgcolor: '#fafafa', lineHeight: '32px', fontSize: 12 }}>
                    {group.header}
                  </ListSubheader>
                  {group.items.map(item => (
                    <ListItemButton
                      key={item.value}
                      selected={selected === item.value}
                      onClick={() => handleSelect(item.value)}
                      data-cb-option-value={item.value}
                    >
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13 }} />
                    </ListItemButton>
                  ))}
                </ul>
              </li>
            ))}
          </List>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" size="small" onClick={() => setSaved(true)}>Save defaults</Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
