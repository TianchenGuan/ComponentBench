'use client';

/**
 * slider_single-mui-T06: Set Pro plan Discount to 15% in pricing table
 * 
 * Layout: table_cell view centered on the viewport showing a two-row Pricing table.
 * Rows: "Basic plan" and "Pro plan". Each row has a "Discount" column containing a Material UI Slider.
 * Slider configuration (both rows): min=0, max=30, step=1 with a small percent readout ("XX%") shown at the right edge of each cell.
 * Initial state: Basic=5%, Pro=10%.
 * The sliders are compact because they are in table cells; thumbs are small and close to other table content.
 * Clutter: table header includes a search field and sort dropdown (not required) and there are other non-slider columns (Price, Seats).
 * Changes apply immediately without Apply/Cancel.
 * 
 * Success: The slider in the 'Pro plan' row under 'Discount' equals 15. The correct instance is required: only the Pro plan slider counts.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Slider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [basicDiscount, setBasicDiscount] = useState(5);
  const [proDiscount, setProDiscount] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (proDiscount === 15) {
      onSuccess();
    }
  }, [proDiscount, onSuccess]);

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pricing
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search plans..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell sx={{ width: 200 }}>Discount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Basic plan</TableCell>
                <TableCell>$9/mo</TableCell>
                <TableCell>5</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Slider
                      value={basicDiscount}
                      onChange={(_, v) => setBasicDiscount(v as number)}
                      min={0}
                      max={30}
                      step={1}
                      size="small"
                      sx={{ flex: 1 }}
                      data-testid="slider-discount-basic"
                    />
                    <Typography variant="body2" sx={{ minWidth: 35 }}>
                      {basicDiscount}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pro plan</TableCell>
                <TableCell>$29/mo</TableCell>
                <TableCell>20</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Slider
                      value={proDiscount}
                      onChange={(_, v) => setProDiscount(v as number)}
                      min={0}
                      max={30}
                      step={1}
                      size="small"
                      sx={{ flex: 1 }}
                      data-testid="slider-discount-pro"
                    />
                    <Typography variant="body2" sx={{ minWidth: 35 }}>
                      {proDiscount}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
