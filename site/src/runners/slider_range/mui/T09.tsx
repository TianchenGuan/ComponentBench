'use client';

/**
 * slider_range-mui-T09: Apply Price filter from table Filters panel (two sliders)
 * 
 * Layout: dashboard with a Products table and a toolbar above it.
 * The toolbar has a button labeled "Filters" that opens a popover panel titled "Filters".
 * Inside the Filters panel there are TWO range sliders (instances=2):
 * 1) "Price ($)" MUI range Slider: min=0, max=200, step=5, readout "Selected: $0 - $200".
 * 2) "Weight (kg)" MUI range Slider: min=0, max=50, step=1, readout "Selected: 0 - 50".
 * The panel footer includes "Reset" (restores defaults) and primary "Apply" (commits filters and closes panel). Table results update only after Apply.
 * 
 * Success: Target range is set to 50-150 USD on the Price slider (both thumbs), require_confirm: true with Apply.
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Slider, Popover, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import type { TaskComponentProps } from '../types';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  weight: number;
}

const allProducts: Product[] = [
  { id: 1, name: 'Widget A', category: 'Electronics', price: 45, weight: 5 },
  { id: 2, name: 'Gadget B', category: 'Electronics', price: 120, weight: 15 },
  { id: 3, name: 'Tool C', category: 'Hardware', price: 75, weight: 25 },
  { id: 4, name: 'Device D', category: 'Electronics', price: 180, weight: 10 },
  { id: 5, name: 'Item E', category: 'Misc', price: 30, weight: 3 },
  { id: 6, name: 'Product F', category: 'Hardware', price: 95, weight: 40 },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [pendingPrice, setPendingPrice] = useState<number[]>([0, 200]);
  const [pendingWeight, setPendingWeight] = useState<number[]>([0, 50]);
  const [appliedPrice, setAppliedPrice] = useState<number[]>([0, 200]);
  const [appliedWeight, setAppliedWeight] = useState<number[]>([0, 50]);

  useEffect(() => {
    if (appliedPrice[0] === 50 && appliedPrice[1] === 150) {
      onSuccess();
    }
  }, [appliedPrice, onSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    setAppliedPrice(pendingPrice);
    setAppliedWeight(pendingWeight);
    handleClose();
  };

  const handleReset = () => {
    setPendingPrice([0, 200]);
    setPendingWeight([0, 50]);
  };

  const filteredProducts = allProducts.filter(
    (p) =>
      p.price >= appliedPrice[0] && p.price <= appliedPrice[1] &&
      p.weight >= appliedWeight[0] && p.weight <= appliedWeight[1]
  );

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ width: 600 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Products</Typography>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleClick}
        >
          Filters
        </Button>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 3, width: 300 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Filters
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Price ($)
          </Typography>
          <Slider
            value={pendingPrice}
            onChange={(_, v) => setPendingPrice(v as number[])}
            min={0}
            max={200}
            step={5}
            valueLabelDisplay="auto"
            data-testid="price-filter-range"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
            Selected: ${pendingPrice[0]} - ${pendingPrice[1]}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Weight (kg)
          </Typography>
          <Slider
            value={pendingWeight}
            onChange={(_, v) => setPendingWeight(v as number[])}
            min={0}
            max={50}
            step={1}
            valueLabelDisplay="auto"
            data-testid="weight-filter-range"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
            Selected: {pendingWeight[0]} - {pendingWeight[1]}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" fullWidth onClick={handleReset}>
              Reset
            </Button>
            <Button variant="contained" fullWidth onClick={handleApply}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Weight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.weight} kg</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
