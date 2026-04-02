'use client';

/**
 * data_grid_row_selection-mui-T05: Scroll to a far row and select it
 *
 * The grid appears in an isolated card anchored at the top-right of the viewport.
 * It is a MUI X DataGrid with many rows (200 products) and built-in virtualization; only a small window of
 * rows is rendered at any time.
 * Spacing is comfortable and scale is default. Columns: Product ID, Name, Category.
 * Initial state: no row selected, and the scroll position is at the very top (showing low product IDs).
 * The target product ID 187 (Name: Pineapple) requires substantial scrolling within the DataGrid's internal
 * scroller to reach and select.
 *
 * Success: selected_row_ids equals [187]
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface ProductData {
  id: number;
  productId: number;
  name: string;
  category: string;
}

const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Beverages', 'Snacks'];
const productNames = [
  'Apple', 'Banana', 'Orange', 'Grape', 'Lemon', 'Lime', 'Mango', 'Peach', 'Pear', 'Plum',
  'Cherry', 'Melon', 'Kiwi', 'Fig', 'Apricot', 'Papaya', 'Guava', 'Coconut', 'Avocado', 'Blueberry',
];

// Generate 200 products
const productsData: ProductData[] = Array.from({ length: 200 }, (_, i) => {
  const id = i + 1;
  // Product 187 is Pineapple
  const name = id === 187 ? 'Pineapple' : productNames[i % productNames.length] + (id > 20 ? ` ${Math.floor(id / 20)}` : '');
  return {
    id,
    productId: id,
    name,
    category: categories[i % categories.length],
  };
});

const columns: GridColDef[] = [
  { field: 'productId', headerName: 'Product ID', width: 100 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'category', headerName: 'Category', width: 120 },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const selectedIds = Array.from(selectionModel.ids) as number[];

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedIds, [187])) {
      onSuccess();
    }
  }, [selectedIds, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Products
        </Typography>
        <div
          style={{ height: 400 }}
          data-testid="products-grid"
          data-selected-row-ids={JSON.stringify(selectedIds)}
        >
          <DataGrid
            rows={productsData}
            columns={columns}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            pageSizeOptions={[25, 50, 100]}
            disableColumnMenu
          />
        </div>
      </CardContent>
    </Card>
  );
}
