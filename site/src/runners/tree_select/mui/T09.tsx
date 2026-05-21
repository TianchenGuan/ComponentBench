'use client';

/**
 * tree_select-mui-T09: Match highlighted data source (dark theme)
 *
 * Theme: dark.
 * Layout: isolated_card centered titled "Connect a data source".
 * Target component: composite TreeSelect labeled "Data source"; empty on load.
 * Visual guidance: a small "Reference" card shows a static screenshot-style image with one leaf highlighted.
 * The highlighted target corresponds to "Warehouses → Snowflake".
 * Tree data:
 *   - Warehouses → (BigQuery, Snowflake, Redshift)
 *   - Databases → (Postgres, MySQL)
 *   - Files → (CSV, Parquet)
 *
 * Success: The Data source selection matches the node highlighted in the Reference card.
 * Canonical target is path [Warehouses, Snowflake] with value 'ds_warehouses_snowflake'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton, Box, createTheme, ThemeProvider } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const valueLabels: Record<string, string> = {
  ds_warehouses_bigquery: 'Warehouses / BigQuery',
  ds_warehouses_snowflake: 'Warehouses / Snowflake',
  ds_warehouses_redshift: 'Warehouses / Redshift',
  ds_databases_postgres: 'Databases / Postgres',
  ds_databases_mysql: 'Databases / MySQL',
  ds_files_csv: 'Files / CSV',
  ds_files_parquet: 'Files / Parquet',
};

const leafIds = new Set(Object.keys(valueLabels));

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (_event: React.SyntheticEvent, itemId: string | null) => {
    if (itemId && leafIds.has(itemId)) {
      setValue(itemId);
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!successFired.current && value === 'ds_warehouses_snowflake') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 450 }}>
        {/* Reference card */}
        <Card sx={{ bgcolor: '#1e1e1e' }} data-testid="reference-card">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Reference</Typography>
            <Box
              sx={{
                bgcolor: '#2d2d2d',
                borderRadius: 1,
                p: 1,
                fontFamily: 'monospace',
                fontSize: 12,
              }}
              data-testid="reference-card-highlight-1"
            >
              <Box sx={{ color: '#888', mb: 0.5 }}>▼ Warehouses</Box>
              <Box sx={{ color: '#888', ml: 2 }}>📁 BigQuery</Box>
              <Box
                sx={{
                  bgcolor: '#1976d2',
                  color: '#fff',
                  ml: 2,
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                }}
              >
                📁 Snowflake
              </Box>
              <Box sx={{ color: '#888', ml: 2 }}>📁 Redshift</Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Match the highlighted data source
            </Typography>
          </CardContent>
        </Card>

        {/* Main card */}
        <Card sx={{ bgcolor: '#1e1e1e' }} data-testid="tree-select-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>Connect a data source</Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Data source</Typography>
            <TextField
              fullWidth
              placeholder="Select a data source"
              value={value ? valueLabels[value] || value : ''}
              onClick={handleClick}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClick}>
                      <ArrowDropDownIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              data-testid="tree-select-datasource"
            />
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              slotProps={{ paper: { sx: { width: 350, maxHeight: 300, overflow: 'auto', bgcolor: '#2d2d2d' } } }}
            >
              <SimpleTreeView
                onSelectedItemsChange={handleSelect}
                sx={{ p: 1 }}
                data-testid="tree-view"
              >
                <TreeItem itemId="warehouses" label="Warehouses">
                  <TreeItem itemId="ds_warehouses_bigquery" label="BigQuery" />
                  <TreeItem itemId="ds_warehouses_snowflake" label="Snowflake" />
                  <TreeItem itemId="ds_warehouses_redshift" label="Redshift" />
                </TreeItem>
                <TreeItem itemId="databases" label="Databases">
                  <TreeItem itemId="ds_databases_postgres" label="Postgres" />
                  <TreeItem itemId="ds_databases_mysql" label="MySQL" />
                </TreeItem>
                <TreeItem itemId="files" label="Files">
                  <TreeItem itemId="ds_files_csv" label="CSV" />
                  <TreeItem itemId="ds_files_parquet" label="Parquet" />
                </TreeItem>
              </SimpleTreeView>
            </Popover>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
