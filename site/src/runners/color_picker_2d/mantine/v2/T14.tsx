'use client';

/**
 * color_picker_2d-mantine-v2-T14: Table — Gateway Tag fill matches target chip; Billing unchanged; row Save
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorInput, Stack, Table, Text } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance, parseRgba } from '../../types';

const GATEWAY_REF: RGBA = { r: 55, g: 160, b: 220, a: 0.75 };
const INITIAL_GW = 'rgba(180, 80, 80, 1)';
const INITIAL_BILL = 'rgba(100, 100, 180, 1)';
const BILL_RGBA: RGBA = { r: 100, g: 100, b: 180, a: 1 };

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T14({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [gw, setGw] = useState(INITIAL_GW);
  const [bill, setBill] = useState(INITIAL_BILL);

  const saveGateway = () => {
    if (done.current) return;
    const g = parseRgba(gw);
    const b = parseRgba(bill);
    if (
      g &&
      b &&
      isColorWithinTolerance(g, GATEWAY_REF, 25, 0.05) &&
      isColorWithinTolerance(b, BILL_RGBA, 2, 0.02)
    ) {
      done.current = true;
      onSuccess();
    }
  };

  const gwRgba = parseRgba(gw);
  const billRgba = parseRgba(bill);

  return (
    <div style={{ width: 520, position: 'relative', left: 20 }}>
      <Card padding="sm" withBorder bg="dark.8">
        <Table verticalSpacing="sm" withTableBorder={false}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td w={100}>
                <Text fw={600} c="gray.3">
                  Gateway
                </Text>
              </Table.Td>
              <Table.Td>
                <Stack gap="xs">
                  <ColorInput
                    label="Tag fill"
                    format="rgba"
                    value={gw}
                    onChange={setGw}
                    disallowInput
                    withPicker
                    data-testid="gateway-tag-fill"
                  />
                  <LiveChip rgba={gwRgba} />
                  <span
                    id="gateway-target-chip"
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: 36,
                      height: 22,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                          'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                        backgroundSize: '8px 8px',
                        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: rgbaCss(GATEWAY_REF),
                        borderRadius: 'inherit',
                      }}
                    />
                  </span>
                  <Button size="xs" onClick={saveGateway} data-testid="save-gateway-row">
                    Save
                  </Button>
                </Stack>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Text fw={600} c="gray.3">
                  Billing
                </Text>
              </Table.Td>
              <Table.Td>
                <Stack gap="xs">
                  <ColorInput
                    label="Tag fill"
                    format="rgba"
                    value={bill}
                    onChange={setBill}
                    disallowInput
                    withPicker
                    data-testid="billing-tag-fill"
                  />
                  <LiveChip rgba={billRgba} />
                  <Button size="xs" variant="default" data-testid="save-billing-row">
                    Save
                  </Button>
                </Stack>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}

function LiveChip({ rgba }: { rgba: RGBA | null }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: rgba ? rgbaCss(rgba) : '#333',
          borderRadius: 'inherit',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>live</span>
    </span>
  );
}
