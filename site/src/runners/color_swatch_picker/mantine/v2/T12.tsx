'use client';

/**
 * color_swatch_picker-mantine-v2-T12: Billing row Accent #7950f2, save-billing-row
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, ColorInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../../types';

const TARGET = '#7950f2';

const SWATCHES = [...MANTINE_SWATCHES, '#845ef7', '#7950f2', '#7048e8', '#e64980', '#be4bdb'];

const INIT_GW = '#228be6';
const INIT_BILL = '#868e96';

export default function T12({ task: _task, onSuccess }: TaskComponentProps) {
  const doneRef = useRef(false);

  const [dGw, setDGw] = useState(INIT_GW);
  const [dBill, setDBill] = useState(INIT_BILL);
  const [cGw, setCGw] = useState(INIT_GW);
  const [cBill, setCBill] = useState(INIT_BILL);

  useEffect(() => {
    if (doneRef.current) return;
    if (hexMatches(cBill, TARGET) && hexMatches(cGw, INIT_GW)) {
      doneRef.current = true;
      onSuccess();
    }
  }, [cBill, cGw, onSuccess]);

  return (
    <div style={{ padding: 8, maxWidth: 560 }}>
      <Text size="sm" c="dimmed" mb="sm">
        Compact service table — save is row-local.
      </Text>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Service</Table.Th>
            <Table.Th>Accent</Table.Th>
            <Table.Th w={100} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Gateway</Table.Td>
            <Table.Td>
              <ColorInput
                value={dGw}
                onChange={setDGw}
                format="hex"
                swatches={SWATCHES}
                withPicker={false}
                disallowInput
                swatchesPerRow={6}
                size="xs"
              />
            </Table.Td>
            <Table.Td>
              <Button
                size="xs"
                variant="default"
                onClick={() => {
                  setCGw(dGw);
                }}
              >
                Save
              </Button>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Billing</Table.Td>
            <Table.Td>
              <ColorInput
                value={dBill}
                onChange={setDBill}
                format="hex"
                swatches={SWATCHES}
                withPicker={false}
                disallowInput
                swatchesPerRow={6}
                size="xs"
              />
            </Table.Td>
            <Table.Td>
              <Button
                size="xs"
                data-testid="save-billing-row"
                onClick={() => {
                  setCBill(dBill);
                }}
              >
                Save
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <div data-testid="billing-accent-committed" style={{ display: 'none' }}>
        {normalizeHex(cBill)}
      </div>
    </div>
  );
}
