'use client';

/**
 * toggle_button_group_multi-mui-T19: Scroll to optional integrations and select
 *
 * Layout: settings_panel centered in the viewport.
 *
 * The page is an "Integrations" settings screen with a left navigation list and 
 * a scrollable main content area. In the main area there are two multi-select 
 * toggle button groups (same canonical type):
 *
 * 1) "Core integrations" (visible on load)
 *    - Options: GitHub, Slack, Jira, Google Drive
 *    - Initial state: GitHub and Slack selected
 * 2) "Optional integrations" (below the fold; requires scrolling to reach)
 *    - Options: Notion, Figma, Zapier, Linear, Asana
 *    - Initial state: Figma selected
 *
 * Both groups use MUI ToggleButtonGroup (multiple selection) with medium-sized buttons. 
 * Each section also contains descriptive text and a "Learn more" link (non-blocking distractors).
 *
 * Clutter (medium):
 * - A search input "Search integrations…"
 * - Several unrelated switches (e.g., "Enable webhooks") between the two sections
 *
 * No Apply/Save control; changes apply immediately.
 * Target ONLY the "Optional integrations" group.
 *
 * Success: Optional integrations → Notion, Zapier, Linear (require_correct_instance: true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, Typography, Box, TextField, Switch, 
  FormControlLabel, Divider, Link 
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

const CORE_OPTIONS = ['GitHub', 'Slack', 'Jira', 'Google Drive'];
const OPTIONAL_OPTIONS = ['Notion', 'Figma', 'Zapier', 'Linear', 'Asana'];
const TARGET_SET = new Set(['Notion', 'Zapier', 'Linear']);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [coreIntegrations, setCoreIntegrations] = useState<string[]>(['GitHub', 'Slack']);
  const [optionalIntegrations, setOptionalIntegrations] = useState<string[]>(['Figma']);
  const [enableWebhooks, setEnableWebhooks] = useState(true);
  const successFiredRef = useRef(false);

  // Initial state for non-target group
  const coreInitial = useRef(['GitHub', 'Slack']);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check if optional integrations has the target set
    const optionalSet = new Set(optionalIntegrations);
    const optionalMatches = optionalSet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => optionalSet.has(v));

    // Check if core integrations is unchanged
    const coreUnchanged = JSON.stringify([...coreIntegrations].sort()) === 
      JSON.stringify([...coreInitial.current].sort());

    if (optionalMatches && coreUnchanged) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [optionalIntegrations, coreIntegrations, onSuccess]);

  return (
    <Box sx={{ display: 'flex', width: 800 }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 180, 
        bgcolor: 'grey.50', 
        borderRight: '1px solid',
        borderColor: 'divider',
        p: 2,
      }}>
        <Typography variant="subtitle2" gutterBottom>
          Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">General</Typography>
          <Typography variant="body2" color="primary">Integrations</Typography>
          <Typography variant="body2" color="text.secondary">Security</Typography>
        </Box>
      </Box>

      {/* Main content */}
      <Box 
        sx={{ 
          flex: 1, 
          p: 3, 
          maxHeight: 400, 
          overflowY: 'auto',
          bgcolor: 'background.paper',
        }}
        data-testid="settings-scroll-area"
      >
        <Typography variant="h5" gutterBottom>
          Integrations
        </Typography>

        <TextField
          size="small"
          placeholder="Search integrations…"
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.500' }} /> }}
          sx={{ mb: 3, width: 250 }}
          data-testid="search-integrations"
        />

        {/* Core integrations */}
        <Card variant="outlined" sx={{ mb: 3 }} data-testid="core-integrations-section">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Core integrations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Essential integrations for your workflow.{' '}
              <Link href="#" underline="hover">Learn more</Link>
            </Typography>

            <ToggleButtonGroup
              value={coreIntegrations}
              onChange={(_, v) => setCoreIntegrations(v)}
              aria-label="core integrations"
              sx={{ flexWrap: 'wrap', gap: 1 }}
              data-testid="core-integrations-group"
              data-section="Core integrations"
            >
              {CORE_OPTIONS.map(opt => (
                <ToggleButton 
                  key={opt} 
                  value={opt} 
                  aria-label={opt}
                  data-testid={`core-${opt.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {opt}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        {/* Distractor switches */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={<Switch checked={enableWebhooks} onChange={(e) => setEnableWebhooks(e.target.checked)} />}
            label="Enable webhooks"
          />
        </Box>

        {/* Filler content to require scrolling */}
        <Card variant="outlined" sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              API Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure API access and rate limits. No changes needed for this task.
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        {/* Optional integrations (TARGET) */}
        <Card variant="outlined" sx={{ mb: 3 }} data-testid="optional-integrations-section">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Optional integrations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Additional tools you can connect.{' '}
              <Link href="#" underline="hover">Learn more</Link>
            </Typography>
            <Typography variant="body2" color="primary" sx={{ mb: 2, fontSize: 12 }}>
              Select: Notion, Zapier, Linear
            </Typography>

            <ToggleButtonGroup
              value={optionalIntegrations}
              onChange={(_, v) => setOptionalIntegrations(v)}
              aria-label="optional integrations"
              sx={{ flexWrap: 'wrap', gap: 1 }}
              data-testid="optional-integrations-group"
              data-section="Optional integrations"
            >
              {OPTIONAL_OPTIONS.map(opt => (
                <ToggleButton 
                  key={opt} 
                  value={opt} 
                  aria-label={opt}
                  data-testid={`optional-${opt.toLowerCase()}`}
                >
                  {opt}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
