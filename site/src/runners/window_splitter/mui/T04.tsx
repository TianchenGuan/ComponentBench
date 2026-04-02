'use client';

/**
 * window_splitter-mui-T14: Set sidebar between 20% and 25% (narrow range)
 * 
 * The page is a form_section layout labeled "Layout settings" with a few non-required 
 * MUI inputs above (theme selector, checkboxes). Within the section is a card titled 
 * "Primary splitter" containing a two-panel resizable layout: "Sidebar" (left) and 
 * "Content" (right). A compact readout beneath the panels shows current percentages.
 * 
 * Success: Sidebar (left) is within [20%, 25%]
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography, TextField, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [sidebarSize, setSidebarSize] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const sidebarFraction = sidebarSize / 100;
    // Success: Sidebar is within [20%, 25%] (0.20 to 0.25)
    if (!successFiredRef.current && sidebarFraction >= 0.195 && sidebarFraction <= 0.255) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sidebarSize, onSuccess]);

  return (
    <Box sx={{ width: 700 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Layout settings</Typography>
      
      {/* Form fields (non-functional) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField label="Theme" size="small" defaultValue="Default" />
        <TextField label="Density" size="small" defaultValue="Comfortable" />
      </Box>
      
      <FormGroup row sx={{ mb: 2 }}>
        <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Show sidebar" />
        <FormControlLabel control={<Checkbox size="small" />} label="Compact mode" />
      </FormGroup>

      <Card>
        <CardHeader title="Primary splitter" titleTypographyProps={{ variant: 'subtitle1' }} />
        <CardContent>
          <Box 
            sx={{ height: 280, border: '1px solid #e0e0e0', borderRadius: 1 }}
            data-testid="splitter-primary"
          >
            <Group 
              orientation="horizontal" 
              onLayoutChange={(layout) => {
                const val = layout['sidebar'];
                if (val !== undefined) setSidebarSize(val);
              }}
            >
              <Panel id="sidebar" defaultSize="50%" minSize="10%" maxSize="50%">
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#fafafa'
                }}>
                  <Typography fontWeight={500}>Sidebar</Typography>
                </Box>
              </Panel>
              <Separator style={{
                width: 8,
                background: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'col-resize',
              }}>
                <Box sx={{ 
                  width: 4, 
                  height: 24, 
                  borderLeft: '2px dotted #999',
                  borderRight: '2px dotted #999',
                }} />
              </Separator>
              <Panel id="content" minSize="10%">
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5'
                }}>
                  <Typography fontWeight={500}>Content</Typography>
                </Box>
              </Panel>
            </Group>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 1, textAlign: 'center' }}
          >
            Sidebar: {sidebarSize.toFixed(1)}% • Content: {(100 - sidebarSize).toFixed(1)}%
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
