'use client';

/**
 * data_table_sortable-mui-v2-T10: Leads dashboard – match the visual ordering preview
 *
 * Dashboard panel with three cards: "Leads" (DataGrid), "Accounts", and "Contacts".
 * Only Leads has a Reference preview card showing Win probability header with a downward
 * arrow and a tiny top-three ordering. Accounts and Contacts have similar numeric columns.
 *
 * Success: Leads sorted Win probability descending. Accounts and Contacts remain unsorted.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper,
} from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';
import type { TaskComponentProps, SortModel } from '../../types';

interface LeadRow { id: string; name: string; company: string; winProbability: number; lastContact: string; }
interface SimpleRow { id: string; name: string; value: number; date: string; }

const leadsData: LeadRow[] = [
  { id: '1', name: 'Deal Alpha', company: 'Acme', winProbability: 92, lastContact: '2024-02-14' },
  { id: '2', name: 'Deal Beta', company: 'TechStart', winProbability: 55, lastContact: '2024-02-10' },
  { id: '3', name: 'Deal Gamma', company: 'GlobalSys', winProbability: 78, lastContact: '2024-02-12' },
  { id: '4', name: 'Deal Delta', company: 'DataFlow', winProbability: 100, lastContact: '2024-02-08' },
  { id: '5', name: 'Deal Epsilon', company: 'CloudNet', winProbability: 84, lastContact: '2024-02-15' },
  { id: '6', name: 'Deal Zeta', company: 'InnoLabs', winProbability: 30, lastContact: '2024-02-01' },
  { id: '7', name: 'Deal Eta', company: 'QuickShip', winProbability: 67, lastContact: '2024-02-13' },
  { id: '8', name: 'Deal Theta', company: 'FinHub', winProbability: 45, lastContact: '2024-02-06' },
];

const accountsData: SimpleRow[] = [
  { id: '1', name: 'Acme Corp', value: 48000, date: '2024-02-14' },
  { id: '2', name: 'TechStart', value: 9600, date: '2024-02-10' },
  { id: '3', name: 'GlobalSys', value: 100000, date: '2024-02-12' },
  { id: '4', name: 'DataFlow', value: 2400, date: '2024-02-08' },
];

const contactsData: SimpleRow[] = [
  { id: '1', name: 'Alice Chen', value: 15, date: '2024-02-14' },
  { id: '2', name: 'Bob Torres', value: 8, date: '2024-02-10' },
  { id: '3', name: 'Carol Diaz', value: 22, date: '2024-02-12' },
  { id: '4', name: 'Dan Okafor', value: 5, date: '2024-02-08' },
];

type Dir = 'asc' | 'desc' | undefined;

function SimpleTable({ title, data: rows, testId, sortModel, onSortModel }: {
  title: string; data: SimpleRow[]; testId: string;
  sortModel: SortModel; onSortModel: (m: SortModel) => void;
}) {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<Dir>(undefined);

  const handleSort = (col: string) => {
    if (orderBy === col) {
      if (order === 'asc') { setOrder('desc'); }
      else if (order === 'desc') { setOrder(undefined); setOrderBy(null); }
      else { setOrder('asc'); }
    } else { setOrderBy(col); setOrder('asc'); }
  };

  useEffect(() => {
    const m: SortModel = orderBy && order ? [{ column_key: orderBy, direction: order, priority: 1 }] : [];
    onSortModel(m);
  }, [orderBy, order, onSortModel]);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" data-testid={testId} data-sort-model={JSON.stringify(sortModel)}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === 'value'} direction={orderBy === 'value' ? order || 'asc' : 'asc'} onClick={() => handleSort('value')}>
                    Value
                  </TableSortLabel>
                </TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.value}</TableCell>
                  <TableCell>{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [leadOrderBy, setLeadOrderBy] = useState<string | null>(null);
  const [leadOrder, setLeadOrder] = useState<Dir>(undefined);
  const [accSort, setAccSort] = useState<SortModel>([]);
  const [conSort, setConSort] = useState<SortModel>([]);
  const successFired = useRef(false);

  const handleLeadSort = (col: string) => {
    if (leadOrderBy === col) {
      if (leadOrder === 'asc') setLeadOrder('desc');
      else if (leadOrder === 'desc') { setLeadOrder(undefined); setLeadOrderBy(null); }
      else setLeadOrder('asc');
    } else { setLeadOrderBy(col); setLeadOrder('asc'); }
  };

  const sortedLeads = React.useMemo(() => {
    if (!leadOrderBy || !leadOrder) return leadsData;
    return [...leadsData].sort((a, b) => {
      const aV = a[leadOrderBy as keyof LeadRow];
      const bV = b[leadOrderBy as keyof LeadRow];
      if (typeof aV === 'number' && typeof bV === 'number') return leadOrder === 'asc' ? aV - bV : bV - aV;
      return 0;
    });
  }, [leadOrderBy, leadOrder]);

  useEffect(() => {
    if (successFired.current) return;
    const leadOk = leadOrderBy === 'winProbability' && leadOrder === 'desc';
    if (leadOk && accSort.length === 0 && conSort.length === 0) {
      successFired.current = true;
      onSuccess();
    }
  }, [leadOrderBy, leadOrder, accSort, conSort, onSuccess]);

  const leadSortModel: SortModel = leadOrderBy && leadOrder
    ? [{ column_key: leadOrderBy === 'winProbability' ? 'win_probability' : leadOrderBy, direction: leadOrder, priority: 1 }]
    : [];

  return (
    <div style={{ position: 'absolute', top: 24, left: 24, width: 960 }}>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Card>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Leads</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small" data-testid="grid-leads" data-sort-model={JSON.stringify(leadSortModel)}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>
                        <TableSortLabel active={leadOrderBy === 'winProbability'} direction={leadOrderBy === 'winProbability' ? leadOrder || 'asc' : 'asc'} onClick={() => handleLeadSort('winProbability')}>
                          Win probability
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel active={leadOrderBy === 'lastContact'} direction={leadOrderBy === 'lastContact' ? leadOrder || 'asc' : 'asc'} onClick={() => handleLeadSort('lastContact')}>
                          Last contact
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedLeads.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.company}</TableCell>
                        <TableCell>{r.winProbability}%</TableCell>
                        <TableCell>{r.lastContact}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={2}>
          <Card sx={{ bgcolor: 'grey.100', height: '100%' }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Reference preview</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, fontWeight: 600, fontSize: 12 }}>
                <span>Win probability</span>
                <ArrowDownward sx={{ fontSize: 12 }} />
              </Box>
              <Box sx={{ fontSize: 11, mt: 0.5, lineHeight: 1.6 }}>
                <div>1. Deal Delta — 100%</div>
                <div>2. Deal Alpha — 92%</div>
                <div>3. Deal Epsilon — 84%</div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={2.5}>
          <SimpleTable title="Accounts" data={accountsData} testId="table-accounts" sortModel={accSort} onSortModel={setAccSort} />
        </Grid>
        <Grid item xs={2.5}>
          <SimpleTable title="Contacts" data={contactsData} testId="table-contacts" sortModel={conSort} onSortModel={setConSort} />
        </Grid>
      </Grid>
    </div>
  );
}
