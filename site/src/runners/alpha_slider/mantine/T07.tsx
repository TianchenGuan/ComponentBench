'use client';

/**
 * alpha_slider-mantine-T07: Set Sidebar table-row opacity to 30%
 *
 * A small table (table_cell layout) shows per-area opacity controls:
 * - Two rows: "Header" and "Sidebar".
 * - Each row has a Mantine AlphaSlider embedded in the right-hand cell (instances=2 of the same canonical type).
 * - Sliders are compact to fit the table row height; each row also shows a tiny checkerboard preview square.
 * Initial state:
 * - Header alpha = 0.80
 * - Sidebar alpha = 0.50
 * Clutter:
 * - The table has only these two rows and minimal extra UI; the main challenge is selecting the correct row's slider.
 *
 * Success: The 'Sidebar' instance alpha is set to 0.30 (30% opacity). Alpha must be within ±0.01 of the target value.
 * The correct instance must be modified (Sidebar row).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, AlphaSlider, Table } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const HEADER_COLOR = '#228be6';
const SIDEBAR_COLOR = '#40c057';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [headerAlpha, setHeaderAlpha] = useState(0.8);
  const [sidebarAlpha, setSidebarAlpha] = useState(0.5);

  useEffect(() => {
    if (isAlphaWithinTolerance(sidebarAlpha, 0.3, 0.01)) {
      onSuccess();
    }
  }, [sidebarAlpha, onSuccess]);

  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%)
    `,
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Area Opacity</Text>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Area</Table.Th>
            <Table.Th>Preview</Table.Th>
            <Table.Th style={{ width: 200 }}>Opacity</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {/* Header row */}
          <Table.Tr data-testid="header-row">
            <Table.Td>Header</Table.Td>
            <Table.Td>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  position: 'relative',
                  ...checkerboardStyle,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: hexToRgba(HEADER_COLOR, headerAlpha),
                    borderRadius: 4,
                  }}
                />
              </div>
            </Table.Td>
            <Table.Td>
              <AlphaSlider
                color={HEADER_COLOR}
                value={headerAlpha}
                onChange={setHeaderAlpha}
                size="sm"
                data-testid="header-alpha-slider"
              />
            </Table.Td>
          </Table.Tr>

          {/* Sidebar row - TARGET */}
          <Table.Tr data-testid="sidebar-row">
            <Table.Td>Sidebar</Table.Td>
            <Table.Td>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  position: 'relative',
                  ...checkerboardStyle,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: hexToRgba(SIDEBAR_COLOR, sidebarAlpha),
                    borderRadius: 4,
                  }}
                />
              </div>
            </Table.Td>
            <Table.Td>
              <AlphaSlider
                color={SIDEBAR_COLOR}
                value={sidebarAlpha}
                onChange={setSidebarAlpha}
                size="sm"
                data-testid="sidebar-alpha-slider"
              />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}
