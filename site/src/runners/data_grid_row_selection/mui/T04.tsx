'use client';

/**
 * data_grid_row_selection-mui-T04: Quick filter then select a city
 *
 * A centered isolated card titled "Cities" contains a MUI X DataGrid with a toolbar enabled.
 * The toolbar includes a single search input labeled "Search…" (quick filter) that filters visible rows as
 * you type.
 * Spacing is comfortable and scale is default. The grid contains 30 rows and uses standard DataGrid
 * scrolling (all rows are reachable in the same view with scroll).
 * Columns: City ID, City, Country. Initial state: no row selected and the search box is empty.
 * The target row has City ID 17 and City "Dover". There are distractors like "Dover Heights" and
 * "Dovercourt" to encourage using the ID for disambiguation.
 *
 * Success: selected_row_ids equals [17]
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface CityData {
  id: number;
  cityId: number;
  city: string;
  country: string;
}

const citiesData: CityData[] = [
  { id: 1, cityId: 1, city: 'New York', country: 'USA' },
  { id: 2, cityId: 2, city: 'Los Angeles', country: 'USA' },
  { id: 3, cityId: 3, city: 'Chicago', country: 'USA' },
  { id: 4, cityId: 4, city: 'Houston', country: 'USA' },
  { id: 5, cityId: 5, city: 'Phoenix', country: 'USA' },
  { id: 6, cityId: 6, city: 'London', country: 'UK' },
  { id: 7, cityId: 7, city: 'Manchester', country: 'UK' },
  { id: 8, cityId: 8, city: 'Birmingham', country: 'UK' },
  { id: 9, cityId: 9, city: 'Liverpool', country: 'UK' },
  { id: 10, cityId: 10, city: 'Bristol', country: 'UK' },
  { id: 11, cityId: 11, city: 'Paris', country: 'France' },
  { id: 12, cityId: 12, city: 'Lyon', country: 'France' },
  { id: 13, cityId: 13, city: 'Marseille', country: 'France' },
  { id: 14, cityId: 14, city: 'Toulouse', country: 'France' },
  { id: 15, cityId: 15, city: 'Dover Heights', country: 'Australia' },
  { id: 16, cityId: 16, city: 'Dovercourt', country: 'UK' },
  { id: 17, cityId: 17, city: 'Dover', country: 'UK' },
  { id: 18, cityId: 18, city: 'Dover Plains', country: 'USA' },
  { id: 19, cityId: 19, city: 'Berlin', country: 'Germany' },
  { id: 20, cityId: 20, city: 'Munich', country: 'Germany' },
  { id: 21, cityId: 21, city: 'Hamburg', country: 'Germany' },
  { id: 22, cityId: 22, city: 'Frankfurt', country: 'Germany' },
  { id: 23, cityId: 23, city: 'Tokyo', country: 'Japan' },
  { id: 24, cityId: 24, city: 'Osaka', country: 'Japan' },
  { id: 25, cityId: 25, city: 'Kyoto', country: 'Japan' },
  { id: 26, cityId: 26, city: 'Sydney', country: 'Australia' },
  { id: 27, cityId: 27, city: 'Melbourne', country: 'Australia' },
  { id: 28, cityId: 28, city: 'Brisbane', country: 'Australia' },
  { id: 29, cityId: 29, city: 'Toronto', country: 'Canada' },
  { id: 30, cityId: 30, city: 'Vancouver', country: 'Canada' },
];

const columns: GridColDef[] = [
  { field: 'cityId', headerName: 'City ID', width: 90 },
  { field: 'city', headerName: 'City', flex: 1 },
  { field: 'country', headerName: 'Country', width: 120 },
];

function CustomToolbar() {
  return (
    <Box sx={{ p: 1 }}>
      <GridToolbarQuickFilter placeholder="Search…" data-testid="quick-filter" />
    </Box>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const selectedIds = Array.from(selectionModel.ids) as number[];

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedIds, [17])) {
      onSuccess();
    }
  }, [selectedIds, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Cities
        </Typography>
        <div
          style={{ height: 500 }}
          data-testid="cities-grid"
          data-selected-row-ids={JSON.stringify(selectedIds)}
        >
          <DataGrid
            rows={citiesData}
            columns={columns}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
            slots={{ toolbar: CustomToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            hideFooter
            disableColumnMenu
          />
        </div>
      </CardContent>
    </Card>
  );
}
