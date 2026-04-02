'use client';

/**
 * slider_range-mui-v2-T25: Products filter panel — set Price and Apply
 *
 * Dashboard toolbar + Products table; Filters opens a popover with Price (0–200, step 5)
 * and Weight (0–50, step 1). Committed state updates only on Apply.
 *
 * Success: Applied Price is 50–150, Weight remains 0–50, Apply clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Popover,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../../types';

export default function T25({ onSuccess }: TaskComponentProps) {
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [draftPrice, setDraftPrice] = useState<number[]>([40, 160]);
  const [draftWeight, setDraftWeight] = useState<number[]>([0, 50]);
  const [appliedPrice, setAppliedPrice] = useState<number[]>([40, 160]);
  const [appliedWeight, setAppliedWeight] = useState<number[]>([0, 50]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      appliedPrice[0] === 50 &&
      appliedPrice[1] === 150 &&
      appliedWeight[0] === 0 &&
      appliedWeight[1] === 50
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [appliedPrice, appliedWeight, onSuccess]);

  const handleApply = () => {
    setAppliedPrice([...draftPrice]);
    setAppliedWeight([...draftWeight]);
  };

  const handleReset = () => {
    setDraftPrice([0, 200]);
    setDraftWeight([0, 50]);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 720 }}>
      <Card variant="outlined">
        <Toolbar variant="dense" sx={{ gap: 1, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder="Search products"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            data-testid="filters-trigger"
          >
            Filters
          </Button>
          <IconButton size="small" aria-label="export">
            <FileDownloadOutlinedIcon fontSize="small" />
          </IconButton>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            <Chip size="small" label="In stock" variant="outlined" />
            <Chip size="small" label="New" variant="outlined" />
            <Chip size="small" label="Sale" color="warning" variant="outlined" />
          </Stack>
        </Toolbar>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Applied: Price ${appliedPrice[0]}–${appliedPrice[1]} · Weight {appliedWeight[0]}–{appliedWeight[1]} kg
          </Typography>
          <Table size="small" data-testid="products-table">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {['A-100', 'B-220', 'C-305', 'D-412'].map((sku, i) => (
                <TableRow key={sku}>
                  <TableCell>{sku}</TableCell>
                  <TableCell>{['Desk lamp', 'USB hub', 'Monitor arm', 'Webcam'][i]}</TableCell>
                  <TableCell align="right">${49 + i * 23}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 2, width: 320 } } }}
        data-testid="filters-popover"
      >
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          Filters
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Price ($)
        </Typography>
        <Box sx={{ px: 1, mb: 2 }}>
          <Slider
            value={draftPrice}
            onChange={(_e, v) => setDraftPrice(v as number[])}
            min={0}
            max={200}
            step={5}
            valueLabelDisplay="auto"
            data-testid="price-range-filter"
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Weight (kg)
        </Typography>
        <Box sx={{ px: 1, mb: 2 }}>
          <Slider
            value={draftWeight}
            onChange={(_e, v) => setDraftWeight(v as number[])}
            min={0}
            max={50}
            step={1}
            valueLabelDisplay="auto"
            data-testid="weight-range-filter"
          />
        </Box>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={handleReset}>
            Reset
          </Button>
          <Button size="small" variant="contained" onClick={handleApply} data-testid="filters-apply">
            Apply
          </Button>
        </Stack>
      </Popover>
    </Box>
  );
}
