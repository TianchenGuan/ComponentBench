'use client';

/**
 * context_menu-mantine-v2-T14: Delta row — Columns toggles exact set
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Table, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../../types';


type ColState = {
  Owner: boolean;
  Status: boolean;
  'Due date': boolean;
  Tags: boolean;
};

const initialDelta: ColState = {
  Owner: false,
  Status: true,
  'Due date': false,
  Tags: true,
};

const targetDelta: ColState = {
  Owner: true,
  Status: false,
  'Due date': true,
  Tags: false,
};

const ROWS: { name: string; initial: ColState }[] = [
  { name: 'Alpha', initial: { Owner: true, Status: true, 'Due date': true, Tags: false } },
  { name: 'Beta', initial: { Owner: false, Status: false, 'Due date': true, Tags: true } },
  { name: 'Gamma', initial: { Owner: true, Status: false, 'Due date': false, Tags: true } },
  { name: 'Delta', initial: initialDelta },
];

function colMatch(s: ColState, t: ColState) {
  return (
    s.Owner === t.Owner &&
    s.Status === t.Status &&
    s['Due date'] === t['Due date'] &&
    s.Tags === t.Tags
  );
}

export default function T14({ onSuccess }: TaskComponentProps) {
  const [colByRow, setColByRow] = useState<Record<string, ColState>>(() =>
    Object.fromEntries(ROWS.map((r) => [r.name, { ...r.initial }]))
  );
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (colMatch(colByRow['Delta'], targetDelta)) {
      done.current = true;
      onSuccess();
    }
  }, [colByRow, onSuccess]);

  return (
    <Paper shadow="sm" p="md" radius="md" w={460} maw="100%">
      <Text fw={600} size="sm" mb="sm">
        Tasks
      </Text>
      <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs" fz="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Row</Table.Th>
            <Table.Th>Summary</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {ROWS.map((r) => (
            <TableRowMenu
              key={r.name}
              name={r.name}
              cols={colByRow[r.name]}
              setCols={(updater) =>
                setColByRow((prev) => ({
                  ...prev,
                  [r.name]: typeof updater === 'function' ? updater(prev[r.name]) : updater,
                }))
              }
            />
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}

function TableRowMenu({
  name,
  cols,
  setCols,
}: {
  name: string;
  cols: ColState;
  setCols: (u: ColState | ((p: ColState) => ColState)) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [showColumnsSub, setShowColumnsSub] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  const keys = Object.keys(cols) as (keyof ColState)[];

  return (
    <Table.Tr>
      <Table.Td style={{ width: 120 }}>
        <Menu
          opened={opened}
          onChange={setOpened}
          closeOnItemClick={false}
          trigger="click-hover"
          closeDelay={200}
          position="bottom-start"
        >
          <Menu.Target>
            <Text
              size="sm"
              fw={600}
              onContextMenu={handleContextMenu}
              style={{ cursor: 'context-menu' }}
              data-testid={`table-row-${name.toLowerCase()}`}
              data-open-target={name}
              data-checked-items={JSON.stringify(cols)}
            >
              {name}
            </Text>
          </Menu.Target>
          <Menu.Dropdown data-testid="context-menu-overlay">
            <Menu.Item onClick={() => setOpened(false)}>View details</Menu.Item>
            <Menu.Item closeMenuOnClick={false} onClick={() => setShowColumnsSub(!showColumnsSub)}>Columns →</Menu.Item>
            {showColumnsSub && (
              <>
                {keys.map((k) => (
                  <Menu.Item
                    key={k}
                    pl={28}
                    closeMenuOnClick={false}
                    onClick={() => setCols((c) => ({ ...c, [k]: !c[k] }))}
                    leftSection={
                      <Checkbox
                        size="xs"
                        checked={cols[k]}
                        onChange={() => {}}
                        tabIndex={-1}
                        styles={{ input: { pointerEvents: 'none' } }}
                      />
                    }
                  >
                    {k}
                  </Menu.Item>
                ))}
              </>
            )}
            <Menu.Item onClick={() => setOpened(false)}>Export row</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          Sample work item
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}
