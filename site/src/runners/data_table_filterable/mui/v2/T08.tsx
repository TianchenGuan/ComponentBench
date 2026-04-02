'use client';

/**
 * data_table_filterable-mui-v2-T08: Accounts grid – hidden Country filter via column menu
 *
 * A wide MUI DataGrid Pro "Accounts" with many columns. Country is off-screen right and requires
 * horizontal scrolling. Filtering is accessed from the column-menu 3-dots icon. Target: Country
 * isAnyOf {Japan, Korea}. Logic operator = OR. Auto-apply (no confirm).
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps, FilterModel } from '../../types';

interface AccountRow {
  id: number;
  name: string;
  industry: string;
  revenue: number;
  employees: number;
  tier: string;
  owner: string;
  country: string;
}

const countryOptions = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Korea', 'Australia', 'Brazil', 'India'];

const accountsData: AccountRow[] = [
  { id: 1, name: 'Alpha Corp', industry: 'Tech', revenue: 5_000_000, employees: 200, tier: 'Enterprise', owner: 'Dana', country: 'USA' },
  { id: 2, name: 'Beta Ltd', industry: 'Finance', revenue: 12_000_000, employees: 800, tier: 'Enterprise', owner: 'Eric', country: 'UK' },
  { id: 3, name: 'Gamma KK', industry: 'Retail', revenue: 2_000_000, employees: 50, tier: 'SMB', owner: 'Yuki', country: 'Japan' },
  { id: 4, name: 'Delta GmbH', industry: 'Manufacturing', revenue: 8_000_000, employees: 400, tier: 'Mid-Market', owner: 'Hans', country: 'Germany' },
  { id: 5, name: 'Epsilon SA', industry: 'Tech', revenue: 1_500_000, employees: 30, tier: 'SMB', owner: 'Maria', country: 'Brazil' },
  { id: 6, name: 'Zeta Inc', industry: 'Healthcare', revenue: 20_000_000, employees: 1500, tier: 'Enterprise', owner: 'Dana', country: 'USA' },
  { id: 7, name: 'Eta Co', industry: 'Tech', revenue: 3_000_000, employees: 120, tier: 'Mid-Market', owner: 'Min', country: 'Korea' },
  { id: 8, name: 'Theta Pty', industry: 'Finance', revenue: 6_000_000, employees: 300, tier: 'Mid-Market', owner: 'Sam', country: 'Australia' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Account', width: 140 },
  { field: 'industry', headerName: 'Industry', width: 120 },
  { field: 'revenue', headerName: 'Revenue', width: 120, type: 'number' },
  { field: 'employees', headerName: 'Employees', width: 110, type: 'number' },
  { field: 'tier', headerName: 'Tier', width: 110 },
  { field: 'owner', headerName: 'Owner', width: 100 },
  { field: 'country', headerName: 'Country', width: 120, type: 'singleSelect', valueOptions: countryOptions },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const items = filterModel.items || [];
    if (items.length === 1) {
      const item = items[0];
      if (
        item.field === 'country' &&
        item.operator === 'isAnyOf' &&
        Array.isArray(item.value) &&
        item.value.length === 2 &&
        new Set(item.value).has('Japan') &&
        new Set(item.value).has('Korea')
      ) {
        successFiredRef.current = true;
        onSuccess();
      }
    }
  }, [filterModel, onSuccess]);

  const canonicalModel: FilterModel = {
    table_id: 'accounts',
    logic_operator: (filterModel.logicOperator?.toUpperCase() as 'AND' | 'OR') || 'OR',
    global_filter: null,
    column_filters: (filterModel.items || [])
      .filter(i => i.value !== undefined && i.value !== '')
      .map(i => ({
        column: i.field.charAt(0).toUpperCase() + i.field.slice(1),
        operator: i.operator === 'isAnyOf' ? 'isAnyOf' : ('equals' as const),
        value: i.value,
      })),
  };

  return (
    <div style={{ width: 600, padding: 16 }}>
      <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
        CRM &gt; Accounts
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Accounts</Typography>
          <div style={{ height: 400 }}>
            <DataGrid
              rows={accountsData}
              columns={columns}
              filterModel={filterModel}
              onFilterModelChange={setFilterModel}
              disableRowSelectionOnClick
              density="compact"
              data-testid="datagrid-accounts"
              data-filter-model={JSON.stringify(canonicalModel)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
