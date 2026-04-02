'use client';

/**
 * select_with_search-mui-T07: Scroll the tag list to select Compliance
 *
 * Layout: dashboard with multiple cards and charts (clutter medium). The target card is labeled "Filters".
 * Component: inside the Filters card, there is one MUI Autocomplete labeled "Tag filter".
 * Options: a long list of tags (~80) in alphabetical order; the listbox is scrollable and shows about 8 items at a time.
 * Target option: "Compliance" (not visible initially; it appears after scrolling within the listbox).
 * Initial state: empty (no tag selected).
 * Interaction: click the input to open suggestions; then scroll inside the dropdown listbox to reveal "Compliance"; click to select.
 *
 * Success: The "Tag filter" Autocomplete value equals "Compliance".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Grid, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Long list of tags in alphabetical order
const tagOptions = [
  'Accounting', 'Administration', 'Advertising', 'Analytics', 'Architecture',
  'Audit', 'Automation', 'Banking', 'Benefits', 'Billing',
  'Blockchain', 'Branding', 'Budget', 'Business', 'Cloud',
  'Communication', 'Compensation', 'Compliance', 'Consulting', 'Content',
  'Contracts', 'Corporate', 'Customer', 'Data', 'Database',
  'Design', 'Development', 'Digital', 'Documentation', 'E-commerce',
  'Education', 'Email', 'Engineering', 'Enterprise', 'Environmental',
  'Equipment', 'Events', 'Executive', 'Facilities', 'Finance',
  'Governance', 'Growth', 'Hardware', 'Healthcare', 'Human Resources',
  'Immigration', 'Infrastructure', 'Innovation', 'Insurance', 'Integration',
  'Intellectual Property', 'Internal', 'International', 'Inventory', 'Investment',
  'IT', 'Knowledge', 'Leadership', 'Legal', 'Licensing',
  'Logistics', 'Maintenance', 'Management', 'Manufacturing', 'Marketing',
  'Medical', 'Mergers', 'Mobile', 'Network', 'Operations',
  'Optimization', 'Outsourcing', 'Payroll', 'Performance', 'Planning',
  'Policy', 'Privacy', 'Procurement', 'Product', 'Production',
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Compliance') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      
      <Grid container spacing={2}>
        {/* Filters card - target */}
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Filters</Typography>
              <Autocomplete
                data-testid="tag-autocomplete"
                options={tagOptions}
                value={value}
                onChange={handleChange}
                ListboxProps={{ style: { maxHeight: 200 } }}
                renderInput={(params) => (
                  <TextField {...params} label="Tag filter" placeholder="Select tag" size="small" />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Clutter - Revenue card */}
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Revenue</Typography>
              <Box sx={{ height: 80, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">Chart placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Clutter - Users card */}
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Users</Typography>
              <Box sx={{ height: 80, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">Chart placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Clutter - Table card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Recent Activity</Typography>
              <Box sx={{ height: 60, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">Table placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
