'use client';

/**
 * resizable_columns-mantine-T09: Drawer: resize Notes in Secondary view and save
 * 
 * Layout: drawer_flow (drawer slides in).
 * 
 * Page initial view:
 * - A settings card with a button "Customize columns" (opens the drawer).
 * 
 * Drawer content:
 * - Title: "Customize columns"
 * - Three resizable table previews (instances=3) in an accordion:
 *   1) "Primary (Sales view)"
 *   2) "Secondary (Support view)" — target instance
 *   3) "Archived (Read-only view)"
 * - Each preview table has resizable header grips and a small per-table Width Monitor.
 * 
 * Secondary (Support view) table:
 * - Columns: Ticket, Owner, Priority, Notes.
 * - Notes column has a visible grip and a monitor line "Notes width: ###px".
 * 
 * Drawer footer buttons: "Save changes" (primary), "Cancel" (secondary)
 * 
 * Initial state: Secondary.Notes starts at 180px. Drawer is closed on load.
 * Success: In Secondary (Support view), Notes width is within ±5px of 260px AND "Save changes" clicked.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Text, Table, Box, Button, Group, Drawer, Accordion, Tooltip, Notification } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

interface ResizableHeaderProps {
  children: React.ReactNode;
  width: number;
  onResize: (width: number) => void;
  minWidth?: number;
}

function ResizableHeader({ children, width, onResize, minWidth = 60 }: ResizableHeaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);
  const startXRef = useRef(0);
  const startWidthRef = useRef(width);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidth;
  }, [currentWidth]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.max(minWidth, startWidthRef.current + delta);
      setCurrentWidth(newWidth);
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minWidth, onResize]);

  useEffect(() => {
    setCurrentWidth(width);
  }, [width]);

  return (
    <Table.Th style={{ width: currentWidth, position: 'relative', userSelect: isDragging ? 'none' : 'auto', fontSize: 12, padding: '6px 8px' }}>
      {children}
      <Tooltip label={`${Math.round(currentWidth)}px`} opened={isDragging} position="top">
        <Box
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: 'col-resize',
            background: isDragging ? 'rgba(0,0,0,0.1)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box style={{ width: 2, height: 14, background: '#ccc', borderRadius: 1 }} />
        </Box>
      </Tooltip>
    </Table.Th>
  );
}

const previewData = [
  { ticket: 'TKT-001', owner: 'John', priority: 'High', notes: 'Urgent customer issue' },
  { ticket: 'TKT-002', owner: 'Jane', priority: 'Medium', notes: 'Feature request' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftNotesWidth, setDraftNotesWidth] = useState(180);
  const [savedNotesWidth, setSavedNotesWidth] = useState(180);
  const [showToast, setShowToast] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (!successFiredRef.current && isWithinTolerance(savedNotesWidth, 260, 5)) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [savedNotesWidth, onSuccess]);

  const handleSave = () => {
    setSavedNotesWidth(draftNotesWidth);
    setShowToast(true);
    setDrawerOpen(false);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCancel = () => {
    setDraftNotesWidth(savedNotesWidth);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Settings Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={600} size="lg" mb="md">Table Settings</Text>
        <Button onClick={() => setDrawerOpen(true)} data-testid="rc-customize-columns">
          Customize columns
        </Button>
      </Card>

      {/* Drawer */}
      <Drawer
        opened={drawerOpen}
        onClose={handleCancel}
        title="Customize columns"
        position="right"
        size="lg"
        data-testid="rc-drawer"
      >
        <Accordion defaultValue="secondary">
          <Accordion.Item value="primary">
            <Accordion.Control>Primary (Sales view)</Accordion.Control>
            <Accordion.Panel>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ fontSize: 12 }}>Order</Table.Th>
                    <Table.Th style={{ fontSize: 12 }}>Customer</Table.Th>
                    <Table.Th style={{ fontSize: 12 }}>Total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td style={{ fontSize: 12 }}>ORD-001</Table.Td>
                    <Table.Td style={{ fontSize: 12 }}>Acme</Table.Td>
                    <Table.Td style={{ fontSize: 12 }}>$1,200</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="secondary" data-testid="rc-accordion-secondary">
            <Accordion.Control>Secondary (Support view)</Accordion.Control>
            <Accordion.Panel>
              <Text c="dimmed" size="xs" mb="xs" data-testid="rc-width-notes">
                Notes width: {Math.round(draftNotesWidth)}px
              </Text>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <ResizableHeader width={100} onResize={() => {}}>Ticket</ResizableHeader>
                    <ResizableHeader width={80} onResize={() => {}}>Owner</ResizableHeader>
                    <ResizableHeader width={80} onResize={() => {}}>Priority</ResizableHeader>
                    <ResizableHeader 
                      width={draftNotesWidth} 
                      onResize={(w) => setDraftNotesWidth(w)}
                    >
                      Notes
                    </ResizableHeader>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {previewData.map((row, i) => (
                    <Table.Tr key={i}>
                      <Table.Td style={{ fontSize: 12 }}>{row.ticket}</Table.Td>
                      <Table.Td style={{ fontSize: 12 }}>{row.owner}</Table.Td>
                      <Table.Td style={{ fontSize: 12 }}>{row.priority}</Table.Td>
                      <Table.Td style={{ fontSize: 12 }}>{row.notes}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="archived">
            <Accordion.Control>Archived (Read-only view)</Accordion.Control>
            <Accordion.Panel>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ fontSize: 12 }}>ID</Table.Th>
                    <Table.Th style={{ fontSize: 12 }}>Date</Table.Th>
                    <Table.Th style={{ fontSize: 12 }}>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td style={{ fontSize: 12 }}>ARC-001</Table.Td>
                    <Table.Td style={{ fontSize: 12 }}>2023-12-01</Table.Td>
                    <Table.Td style={{ fontSize: 12 }}>Archived</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} data-testid="rc-save-changes">Save changes</Button>
        </Group>
      </Drawer>

      {showToast && (
        <Notification
          color="green"
          title="Success"
          onClose={() => setShowToast(false)}
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        >
          Column layout saved
        </Notification>
      )}
    </>
  );
}
