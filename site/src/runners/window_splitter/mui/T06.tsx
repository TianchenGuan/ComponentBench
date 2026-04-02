'use client';

/**
 * window_splitter-mui-T16: Scroll to Resizable Preview and set it to 70%
 * 
 * The page is a long settings_panel view with multiple collapsible sections and 
 * helper text. At load, the "Resizable Preview" section is below the fold, so the 
 * splitter is not initially visible. Within that section is a card titled "Primary 
 * splitter" containing a two-pane resizable layout: "Live Preview" (left) and 
 * "Config" (right).
 * 
 * Success: Live Preview (left) is 70% ±3%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Switch, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [livePreviewSize, setLivePreviewSize] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const livePreviewFraction = livePreviewSize / 100;
    // Success: Live Preview (left) is 70% ±3% (0.67 to 0.73)
    if (!successFiredRef.current && livePreviewFraction >= 0.67 && livePreviewFraction <= 0.73) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [livePreviewSize, onSuccess]);

  return (
    <Box sx={{ width: 700, maxHeight: 600, overflowY: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Settings</Typography>
      
      {/* Spacer sections to push Resizable Preview below fold */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>General Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ py: 2 }}>
            <FormControlLabel control={<Switch defaultChecked />} label="Enable notifications" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Configure your general application preferences here. These settings apply globally.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>Appearance</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ py: 2 }}>
            <FormControlLabel control={<Switch />} label="Dark mode" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Customize the look and feel of the application. Choose from light, dark, or system themes.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>Privacy</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ py: 2 }}>
            <FormControlLabel control={<Switch defaultChecked />} label="Analytics" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Manage your privacy settings and data collection preferences.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Target section: Resizable Preview */}
      <Box id="section-resizable-preview" data-testid="section-resizable-preview" sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Resizable Preview</Typography>
        <Card>
          <CardHeader title="Primary splitter" titleTypographyProps={{ variant: 'subtitle1' }} />
          <CardContent>
            <Box 
              sx={{ height: 250, border: '1px solid #e0e0e0', borderRadius: 1 }}
              data-testid="splitter-primary"
            >
              <Group 
                orientation="horizontal" 
                onLayoutChange={(layout) => {
                  const val = layout['livePreview'];
                  if (val !== undefined) setLivePreviewSize(val);
                }}
              >
                <Panel id="livePreview" defaultSize="50%" minSize="10%" maxSize="90%">
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                    <Typography fontWeight={500}>Live Preview</Typography>
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
                  <Box sx={{ width: 4, height: 24, borderLeft: '2px dotted #999', borderRight: '2px dotted #999' }} />
                </Separator>
                <Panel id="config" minSize="10%">
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography fontWeight={500}>Config</Typography>
                  </Box>
                </Panel>
              </Group>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Live Preview: {livePreviewSize.toFixed(0)}% • Config: {(100 - livePreviewSize).toFixed(0)}%
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
