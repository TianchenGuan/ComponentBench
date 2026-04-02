'use client';

/**
 * data_table_filterable-mui-v2-T10: Contractors grid – filter region + sort seats, not Employees
 *
 * A compact settings_panel with two side-by-side MUI DataGrid instances: "Employees" and
 * "Contractors". Target: in the Contractors grid, filter Region to "EU" AND sort Seats ascending.
 * Employees must remain unfiltered and unsorted.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Stack } from '@mui/material';
import type { TaskComponentProps, FilterModel } from '../../types';

interface OrgRow {
  id: number;
  name: string;
  region: string;
  seats: number;
  status: string;
}

const regionOptions = ['NA', 'EU', 'APAC', 'LATAM'];

const employeesData: OrgRow[] = [
  { id: 1, name: 'Alpha Team', region: 'NA', seats: 25, status: 'Active' },
  { id: 2, name: 'Beta Team', region: 'EU', seats: 60, status: 'Active' },
  { id: 3, name: 'Gamma Team', region: 'APAC', seats: 40, status: 'Paused' },
  { id: 4, name: 'Delta Team', region: 'LATAM', seats: 15, status: 'Active' },
];

const contractorsData: OrgRow[] = [
  { id: 101, name: 'Vendor A', region: 'EU', seats: 80, status: 'Active' },
  { id: 102, name: 'Vendor B', region: 'NA', seats: 30, status: 'Active' },
  { id: 103, name: 'Vendor C', region: 'EU', seats: 120, status: 'Active' },
  { id: 104, name: 'Vendor D', region: 'APAC', seats: 55, status: 'Paused' },
  { id: 105, name: 'Vendor E', region: 'EU', seats: 45, status: 'Active' },
  { id: 106, name: 'Vendor F', region: 'LATAM', seats: 70, status: 'Active' },
];

function makeCols(): GridColDef[] {
  return [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'region', headerName: 'Region', width: 100, type: 'singleSelect', valueOptions: regionOptions },
    { field: 'seats', headerName: 'Seats', width: 90, type: 'number' },
    { field: 'status', headerName: 'Status', width: 100 },
  ];
}

function toCanonical(tableId: string, fm: GridFilterModel): FilterModel {
  return {
    table_id: tableId,
    logic_operator: (fm.logicOperator?.toUpperCase() as 'AND' | 'OR') || 'OR',
    global_filter: null,
    column_filters: (fm.items || [])
      .filter(i => i.value !== undefined && i.value !== '')
      .map(i => ({
        column: i.field.charAt(0).toUpperCase() + i.field.slice(1),
        operator: i.operator === '>' ? '>' as any : ('equals' as const),
        value: typeof i.value === 'number' ? String(i.value) : i.value,
      })),
  };
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [empFilter, setEmpFilter] = useState<GridFilterModel>({ items: [] });
  const [conFilter, setConFilter] = useState<GridFilterModel>({ items: [] });
  const [empSort, setEmpSort] = useState<GridSortModel>([]);
  const [conSort, setConSort] = useState<GridSortModel>([]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const conItems = conFilter.items || [];
    const hasRegionEU = conItems.some(i => i.field === 'region' && i.operator === 'is' && i.value === 'EU');
    const hasSeatsAsc = conSort.some(s => s.field === 'seats' && s.sort === 'asc');
    const empUntouched =
      !(empFilter.items || []).some(i => i.value !== undefined && i.value !== '') &&
      empSort.length === 0;
    if (hasRegionEU && hasSeatsAsc && empUntouched) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [conFilter, conSort, empFilter, empSort, onSuccess]);

  return (
    <div style={{ width: 960, padding: 16 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Organization Settings</Typography>
      <Stack direction="row" spacing={2}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>Employees</Typography>
            <div style={{ height: 300 }}>
              <DataGrid
                rows={employeesData}
                columns={makeCols()}
                filterModel={empFilter}
                onFilterModelChange={setEmpFilter}
                sortModel={empSort}
                onSortModelChange={setEmpSort}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: false } }}
                disableRowSelectionOnClick
                density="compact"
                data-testid="datagrid-employees"
                data-filter-model={JSON.stringify(toCanonical('employees', empFilter))}
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>Contractors</Typography>
            <div style={{ height: 300 }}>
              <DataGrid
                rows={contractorsData}
                columns={makeCols()}
                filterModel={conFilter}
                onFilterModelChange={setConFilter}
                sortModel={conSort}
                onSortModelChange={setConSort}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: false } }}
                disableRowSelectionOnClick
                density="compact"
                data-testid="datagrid-contractors"
                data-filter-model={JSON.stringify(toCanonical('contractors', conFilter))}
              />
            </div>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}
