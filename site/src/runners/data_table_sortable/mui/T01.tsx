'use client';

/**
 * data_table_sortable-mui-T11: Nutrition - sort Calories ascending (TableSortLabel)
 *
 * Baseline scene using Material UI Table with a clickable sort label in the header.
 * - Layout: isolated card centered.
 * - Columns: Dessert, Calories, Fat (g), Carbs (g), Protein (g).
 * - Initial state: unsorted.
 *
 * Success: Calories sorted ascending.
 */

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import type { TaskComponentProps, SortModel } from '../types';

interface NutritionData {
  id: string;
  dessert: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
}

const nutritionData: NutritionData[] = [
  { id: '1', dessert: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
  { id: '2', dessert: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
  { id: '3', dessert: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
  { id: '4', dessert: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
  { id: '5', dessert: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
  { id: '6', dessert: 'Jelly Bean', calories: 375, fat: 0.0, carbs: 94, protein: 0.0 },
  { id: '7', dessert: 'Lollipop', calories: 392, fat: 0.2, carbs: 98, protein: 0.0 },
  { id: '8', dessert: 'Honeycomb', calories: 408, fat: 3.2, carbs: 87, protein: 6.5 },
  { id: '9', dessert: 'Donut', calories: 452, fat: 25.0, carbs: 51, protein: 4.9 },
  { id: '10', dessert: 'KitKat', calories: 518, fat: 26.0, carbs: 65, protein: 7.0 },
];

type SortDirection = 'asc' | 'desc' | undefined;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<SortDirection>(undefined);

  const handleSort = (column: string) => {
    if (orderBy === column) {
      if (order === 'asc') {
        setOrder('desc');
      } else if (order === 'desc') {
        setOrder(undefined);
        setOrderBy(null);
      } else {
        setOrder('asc');
      }
    } else {
      setOrderBy(column);
      setOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy || !order) return nutritionData;
    return [...nutritionData].sort((a, b) => {
      const aVal = a[orderBy as keyof NutritionData];
      const bVal = b[orderBy as keyof NutritionData];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [orderBy, order]);

  // Check success condition
  useEffect(() => {
    if (orderBy === 'calories' && order === 'asc') {
      onSuccess();
    }
  }, [orderBy, order, onSuccess]);

  const sortModel: SortModel = orderBy && order
    ? [{ column_key: orderBy, direction: order, priority: 1 }]
    : [];

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Nutrition
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table
            size="medium"
            data-testid="table-nutrition"
            data-sort-model={JSON.stringify(sortModel)}
          >
            <TableHead>
              <TableRow>
                <TableCell>Dessert</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'calories'}
                    direction={orderBy === 'calories' ? order || 'asc' : 'asc'}
                    onClick={() => handleSort('calories')}
                    aria-sort={orderBy === 'calories' ? (order === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    Calories
                  </TableSortLabel>
                </TableCell>
                <TableCell>Fat (g)</TableCell>
                <TableCell>Carbs (g)</TableCell>
                <TableCell>Protein (g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.dessert}</TableCell>
                  <TableCell>{row.calories}</TableCell>
                  <TableCell>{row.fat}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
