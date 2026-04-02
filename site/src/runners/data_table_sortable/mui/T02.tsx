'use client';

/**
 * data_table_sortable-mui-T12: Contacts - sort Last name A→Z (DataGrid)
 *
 * Single MUI X DataGrid in an isolated card titled "Contacts".
 * - Columns: First name, Last name, Email, Company.
 * - Mixed guidance: hint chip "A→Z" shown next to "Last name".
 * - Initial state: unsorted.
 *
 * Distractors: disabled "Add contact" button.
 * Success: Last name sorted ascending.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../types';

interface ContactData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

const contactsData: ContactData[] = [
  { id: '1', firstName: 'Alice', lastName: 'Anderson', email: 'alice@acme.com', company: 'Acme Corp' },
  { id: '2', firstName: 'Bob', lastName: 'Baker', email: 'bob@tech.io', company: 'TechStart' },
  { id: '3', firstName: 'Carol', lastName: 'Chen', email: 'carol@global.com', company: 'Global Systems' },
  { id: '4', firstName: 'David', lastName: 'Davis', email: 'david@cloud.net', company: 'CloudNet' },
  { id: '5', firstName: 'Emma', lastName: 'Edwards', email: 'emma@data.co', company: 'DataFlow' },
  { id: '6', firstName: 'Frank', lastName: 'Foster', email: 'frank@inno.com', company: 'Innovate Labs' },
  { id: '7', firstName: 'Grace', lastName: 'Garcia', email: 'grace@quick.com', company: 'QuickShip' },
  { id: '8', firstName: 'Henry', lastName: 'Hill', email: 'henry@finance.com', company: 'FinanceHub' },
  { id: '9', firstName: 'Iris', lastName: 'Ito', email: 'iris@market.com', company: 'MarketPro' },
  { id: '10', firstName: 'Jack', lastName: 'Johnson', email: 'jack@design.com', company: 'DesignWorks' },
];

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 130, sortable: false },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  { field: 'email', headerName: 'Email', width: 200, sortable: false },
  { field: 'company', headerName: 'Company', width: 150, sortable: false },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  // Check success condition
  useEffect(() => {
    if (sortModel.length === 1 && sortModel[0].field === 'lastName' && sortModel[0].sort === 'asc') {
      onSuccess();
    }
  }, [sortModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field === 'lastName' ? 'last_name' : item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Contacts
            </Typography>
            <Chip label="Last name A→Z" size="small" variant="outlined" />
          </Box>
          <Button disabled variant="outlined">Add contact</Button>
        </Box>
        <div style={{ height: 400 }}>
          <DataGrid
            rows={contactsData}
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            data-testid="grid-contacts"
            data-sort-model={JSON.stringify(canonicalSortModel)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
