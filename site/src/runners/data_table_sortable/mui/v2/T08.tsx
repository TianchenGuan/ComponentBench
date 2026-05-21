'use client';

/**
 * data_table_sortable-mui-v2-T08: Accounts grid – horizontal scroll to Churn risk and sort descending
 *
 * A nested_scroll analytics panel with a wide DataGrid Pro titled "Accounts". Churn risk
 * is off-screen to the right at load. The grid footer and surrounding panel add clutter
 * so page scrolling and grid scrolling can be confused.
 *
 * Success: Churn risk sorted descending (one key only).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../../types';

interface AccountRow {
  id: string;
  accountName: string;
  industry: string;
  owner: string;
  arr: number;
  seats: number;
  healthScore: number;
  nps: number;
  discountRate: number;
  lastContact: string;
  churnRisk: number;
}

const data: AccountRow[] = [
  { id: '1', accountName: 'Acme Corp', industry: 'Manufacturing', owner: 'Li Wei', arr: 48000, seats: 120, healthScore: 88, nps: 72, discountRate: 5, lastContact: '2024-02-14', churnRisk: 12 },
  { id: '2', accountName: 'TechStart', industry: 'SaaS', owner: 'Maria G.', arr: 9600, seats: 30, healthScore: 72, nps: 60, discountRate: 10, lastContact: '2024-02-10', churnRisk: 35 },
  { id: '3', accountName: 'GlobalSys', industry: 'Consulting', owner: 'James K.', arr: 100000, seats: 250, healthScore: 55, nps: 42, discountRate: 8, lastContact: '2024-02-12', churnRisk: 58 },
  { id: '4', accountName: 'DataFlow', industry: 'Analytics', owner: 'Chen Y.', arr: 2400, seats: 10, healthScore: 90, nps: 80, discountRate: 0, lastContact: '2024-02-08', churnRisk: 5 },
  { id: '5', accountName: 'CloudNet', industry: 'Infrastructure', owner: 'Aisha B.', arr: 17600, seats: 55, healthScore: 81, nps: 65, discountRate: 12, lastContact: '2024-02-15', churnRisk: 18 },
  { id: '6', accountName: 'InnoLabs', industry: 'R&D', owner: 'David M.', arr: 72000, seats: 180, healthScore: 30, nps: 25, discountRate: 15, lastContact: '2024-02-01', churnRisk: 82 },
  { id: '7', accountName: 'QuickShip', industry: 'Logistics', owner: 'Sara T.', arr: 1920, seats: 8, healthScore: 68, nps: 55, discountRate: 3, lastContact: '2024-02-13', churnRisk: 40 },
  { id: '8', accountName: 'FinHub', industry: 'Finance', owner: 'Raj P.', arr: 12800, seats: 40, healthScore: 93, nps: 85, discountRate: 7, lastContact: '2024-02-06', churnRisk: 3 },
  { id: '9', accountName: 'MarketPro', industry: 'Marketing', owner: 'Li Wei', arr: 120000, seats: 300, healthScore: 76, nps: 62, discountRate: 5, lastContact: '2024-02-10', churnRisk: 22 },
  { id: '10', accountName: 'DesignWk', industry: 'Design', owner: 'Maria G.', arr: 1200, seats: 5, healthScore: 42, nps: 30, discountRate: 20, lastContact: '2024-02-01', churnRisk: 70 },
];

const columns: GridColDef[] = [
  { field: 'accountName', headerName: 'Account', width: 120, sortable: false },
  { field: 'industry', headerName: 'Industry', width: 110, sortable: false },
  { field: 'owner', headerName: 'Owner', width: 90, sortable: false },
  { field: 'arr', headerName: 'ARR', width: 90, type: 'number', sortable: false },
  { field: 'seats', headerName: 'Seats', width: 70, type: 'number', sortable: false },
  { field: 'healthScore', headerName: 'Health score', width: 110, type: 'number' },
  { field: 'nps', headerName: 'NPS', width: 70, type: 'number', sortable: false },
  { field: 'discountRate', headerName: 'Discount rate', width: 110, type: 'number', sortable: false },
  { field: 'lastContact', headerName: 'Last contact', width: 120, sortable: false },
  { field: 'churnRisk', headerName: 'Churn risk', width: 110, type: 'number' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      sortModel.length === 1 &&
      sortModel[0].field === 'churnRisk' &&
      sortModel[0].sort === 'desc'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [sortModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item, idx) => ({
    column_key: item.field === 'churnRisk' ? 'churn_risk' : item.field === 'healthScore' ? 'health_score' : item.field,
    direction: (item.sort || 'asc') as 'asc' | 'desc',
    priority: idx + 1,
  }));

  return (
    <div style={{ position: 'absolute', bottom: 24, left: 24, width: 680 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Accounts</Typography>
            <Chip label="Analytics" size="small" variant="outlined" />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            10 accounts · scroll right for churn metrics
          </Typography>
          <div style={{ height: 420, width: '100%' }}>
            <DataGrid
              rows={data}
              columns={columns}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              density="compact"
              data-testid="grid-accounts"
              data-sort-model={JSON.stringify(canonicalSortModel)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
