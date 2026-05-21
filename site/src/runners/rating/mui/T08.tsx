'use client';

/**
 * rating-mui-T08: Compact table: set Plan B SLA to 4.5 (MUI)
 * 
 * Scene details: theme=light, spacing=compact, scale=small, placement=center.
 * Layout: table_cell with compact spacing and small-sized rating icons.
 * A two-row table is displayed with rows "Plan A" and "Plan B".
 * In the "SLA rating" column, each row contains a MUI Rating component.
 * Configuration: max=5, precision=0.5 (half-star), size='small'.
 * Initial state: Plan A SLA rating = 5.0, Plan B SLA rating = 1.0.
 * Clutter: the table also contains a "Price" column and small info icons that are non-functional distractors.
 * The target instance is the rating control in the "Plan B" row.
 * 
 * Success: Target rating value equals 4.5 out of 5 on "Plan B - SLA rating".
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Rating, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import type { TaskComponentProps } from '../types';

interface PlanData {
  id: string;
  name: string;
  slaRating: number;
  price: string;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [plans, setPlans] = useState<PlanData[]>([
    { id: 'plan-a', name: 'Plan A', slaRating: 5.0, price: '$99/mo' },
    { id: 'plan-b', name: 'Plan B', slaRating: 1.0, price: '$49/mo' },
  ]);

  useEffect(() => {
    const planB = plans.find(p => p.id === 'plan-b');
    if (planB && planB.slaRating === 4.5) {
      onSuccess();
    }
  }, [plans, onSuccess]);

  const handleRatingChange = (id: string, newValue: number | null) => {
    setPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, slaRating: newValue ?? 0 } : plan
    ));
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Plans
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>SLA rating</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} data-row={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>
                    <Rating
                      value={plan.slaRating}
                      onChange={(_, newValue) => handleRatingChange(plan.id, newValue)}
                      precision={0.5}
                      size="small"
                      data-testid={`rating-${plan.id}-sla`}
                    />
                  </TableCell>
                  <TableCell>
                    {plan.price}
                    <IconButton size="small" disabled>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
