'use client';

/**
 * select_with_search-mantine-T09: Scroll material list in an inventory table to pick Walnut
 *
 * Layout: table_cell scene. A table titled "Inventory" is centered on the page with multiple columns (Item, Category, Material, Qty).
 * Target component: in the first row, the "Material" cell contains a Mantine searchable Select (already visible as an input, not in edit mode).
 * Options: a long list of materials/woods (~90) in alphabetical order. The dropdown shows a scrollable list with a scrollbar.
 * Target option: "Walnut" appears far down the list and is not visible when the dropdown first opens.
 * Initial state: "Aluminum" is selected for Material in row 1.
 * Clutter (medium): other table cells and header controls are visible but do not affect success. Scrolling should occur inside the dropdown list, not the page.
 *
 * Success: The selected value of the "Material" Select equals "Walnut".
 */

import React, { useState } from 'react';
import { Card, Text, Select, Table, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';

// Long list of materials in alphabetical order
const materialOptions = [
  'Acacia', 'Acrylic', 'Alder', 'Aluminum', 'Ash', 'Bamboo', 'Basswood', 'Beech', 'Birch', 'Boxwood',
  'Brass', 'Bronze', 'Bubinga', 'Carbon Fiber', 'Cedar', 'Cherry', 'Chestnut', 'Chrome', 'Copper', 'Cork',
  'Cypress', 'Douglas Fir', 'Ebony', 'Elm', 'Eucalyptus', 'Fiberglass', 'Glass', 'Granite', 'Hickory', 'Holly',
  'Hornbeam', 'Ipe', 'Iron', 'Jarrah', 'Jatoba', 'Juniper', 'Kauri', 'Koa', 'Lacewood', 'Larch',
  'Leather', 'Limba', 'Linden', 'Locust', 'Mahogany', 'Mango', 'Maple', 'Marble', 'Meranti', 'Mesquite',
  'Narra', 'Nickel', 'Oak', 'Olive', 'Osage Orange', 'Padauk', 'Palm', 'Paulownia', 'Pecan', 'Pewter',
  'Pine', 'Plywood', 'Poplar', 'Purpleheart', 'Redwood', 'Resin', 'Rosewood', 'Rubber', 'Sapele', 'Sassafras',
  'Silicone', 'Silver', 'Spruce', 'Steel', 'Sycamore', 'Teak', 'Titanium', 'Tulipwood', 'Walnut', 'Wenge',
  'Willow', 'Yellowheart', 'Yew', 'Zebrawood', 'Zinc'
].map(m => ({ value: m, label: m }));

interface InventoryRow {
  id: string;
  item: string;
  category: string;
  material: string;
  qty: number;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<InventoryRow[]>([
    { id: '1', item: 'Desk Frame', category: 'Furniture', material: 'Aluminum', qty: 25 },
    { id: '2', item: 'Cabinet Door', category: 'Furniture', material: 'Oak', qty: 40 },
    { id: '3', item: 'Shelf Board', category: 'Storage', material: 'Pine', qty: 100 },
  ]);

  const handleMaterialChange = (rowId: string, newMaterial: string | null) => {
    setRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, material: newMaterial || '' } : row
    ));
    
    // Check success for row 1
    if (rowId === '1' && newMaterial === 'Walnut') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">Inventory</Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Material</Table.Th>
            <Table.Th>Qty</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.item}</Table.Td>
              <Table.Td>
                <Badge variant="light">{row.category}</Badge>
              </Table.Td>
              <Table.Td>
                <Select
                  data-testid={`material-select-row-${row.id}`}
                  size="xs"
                  searchable
                  data={materialOptions}
                  value={row.material}
                  onChange={(v) => handleMaterialChange(row.id, v)}
                  maxDropdownHeight={200}
                  style={{ width: 150 }}
                />
              </Table.Td>
              <Table.Td>{row.qty}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
