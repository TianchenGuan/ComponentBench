'use client';

/**
 * checkbox-mui-T09: Scroll to enable Export reports (long permissions list)
 *
 * Layout: form section titled "Permissions".
 * The section contains four Material UI Checkbox rows, but the page is tall enough that the last row starts below the fold.
 * Checkbox rows (top to bottom):
 *   - "View reports" (initially checked)
 *   - "Edit reports" (initially unchecked)
 *   - "Export data" (initially unchecked)
 *   - "Export reports" (initially unchecked)  ← target, initially off-screen near the bottom
 * You must scroll the page to reveal "Export reports". There is no Save/Apply button; checkbox state commits immediately.
 * Clutter: a few non-interactive paragraphs and dividers separate the rows.
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [viewReports, setViewReports] = useState(true);
  const [editReports, setEditReports] = useState(false);
  const [exportData, setExportData] = useState(false);
  const [exportReports, setExportReports] = useState(false);

  const handleExportReportsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setExportReports(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Permissions
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={viewReports}
                onChange={(e) => setViewReports(e.target.checked)}
                data-testid="cb-view-reports"
              />
            }
            label="View reports"
          />
          
          <Typography variant="body2" color="text.secondary">
            Basic read-only access to generated reports and dashboards.
          </Typography>

          <Divider />

          <FormControlLabel
            control={
              <Checkbox
                checked={editReports}
                onChange={(e) => setEditReports(e.target.checked)}
                data-testid="cb-edit-reports"
              />
            }
            label="Edit reports"
          />
          
          <Typography variant="body2" color="text.secondary">
            Ability to modify report configurations and settings.
          </Typography>

          <Divider />

          {/* Spacer to push content below fold */}
          <Box sx={{ height: 150 }} />

          <FormControlLabel
            control={
              <Checkbox
                checked={exportData}
                onChange={(e) => setExportData(e.target.checked)}
                data-testid="cb-export-data"
              />
            }
            label="Export data"
          />
          
          <Typography variant="body2" color="text.secondary">
            Download raw data in CSV or JSON format.
          </Typography>

          <Divider />

          {/* More spacer */}
          <Box sx={{ height: 150 }} />

          {/* Target checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={exportReports}
                onChange={handleExportReportsChange}
                data-testid="cb-export-reports"
              />
            }
            label="Export reports"
          />
          
          <Typography variant="body2" color="text.secondary">
            Download formatted reports as PDF or Excel files.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
