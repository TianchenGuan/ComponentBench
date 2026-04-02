'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, Checkbox, Group, Stack, Paper, ScrollArea, Table } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const apacItems = ['Dashboard', 'Runbook', 'Alert channel', 'On-call rota', 'Notes', 'Wiki', 'Chat'];
const emeaItems = ['Dashboard', 'Status page', 'Runbook', 'Alert channel', 'Wiki', 'Chat'];

const APAC_TARGET = ['Dashboard', 'Runbook', 'Alert channel', 'On-call rota'];
const EMEA_MUST_REMAIN = ['Dashboard', 'Status page'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T16({ onSuccess }: TaskComponentProps) {
  const [apacChecked, setApacChecked] = useState<string[]>([]);
  const [apacLeft, setApacLeft] = useState(not(apacItems, ['Dashboard', 'Alert channel', 'Notes']));
  const [apacRight, setApacRight] = useState(['Dashboard', 'Alert channel', 'Notes']);
  const [emeaChecked, setEmeaChecked] = useState<string[]>([]);
  const [emeaLeft, setEmeaLeft] = useState(not(emeaItems, ['Dashboard', 'Status page']));
  const [emeaRight, setEmeaRight] = useState(['Dashboard', 'Status page']);
  const [committedApac, setCommittedApac] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (
      !successFired.current && committedApac &&
      setsEqual(committedApac, APAC_TARGET) &&
      setsEqual(emeaRight, EMEA_MUST_REMAIN)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedApac, emeaRight, onSuccess]);

  const makeToggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (v: string) => setter(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const makeMove = (
    checked: string[], pane: string[],
    setTo: React.Dispatch<React.SetStateAction<string[]>>,
    setFrom: React.Dispatch<React.SetStateAction<string[]>>,
    setChecked: React.Dispatch<React.SetStateAction<string[]>>,
  ) => () => {
    const sel = checked.filter(v => pane.includes(v));
    setTo(prev => [...prev, ...sel]);
    setFrom(prev => not(prev, sel));
    setChecked(prev => not(prev, sel));
  };

  const renderList = (title: string, items: string[], checked: string[], toggle: (v: string) => void) => (
    <Paper withBorder p="xs" style={{ width: 180, background: '#25262b' }}>
      <Text fw={500} size="xs" mb={4} c="gray.3">{title}</Text>
      <ScrollArea h={160}>
        <Stack gap={2}>
          {items.map(v => (
            <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="xs" />
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  const renderTransfer = (
    label: string,
    left: string[], right: string[], checked: string[],
    toggle: (v: string) => void,
    moveRight: () => void, moveLeft: () => void,
    saveId: string, onSave: () => void,
  ) => (
    <div style={{ padding: '8px 16px' }}>
      <Text fw={500} size="sm" c="gray.3" mb={4}>{label}</Text>
      <Group align="center" gap="xs">
        {renderList('Hidden', left, checked, toggle)}
        <Stack gap={4}>
          <Button size="compact-xs" variant="default" onClick={moveRight}
            disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="compact-xs" variant="default" onClick={moveLeft}
            disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        {renderList('Visible', right, checked, toggle)}
      </Group>
      <Button size="xs" mt={8} data-testid={saveId} onClick={onSave}>Save row</Button>
    </div>
  );

  const toggleApac = makeToggle(setApacChecked);
  const toggleEmea = makeToggle(setEmeaChecked);

  return (
    <div style={{ background: '#1a1b1e', minHeight: '100vh', padding: 16, paddingLeft: 40 }}>
      <Text fw={600} size="lg" c="gray.2" mb="md">Regional resources</Text>
      <Table withTableBorder withColumnBorders style={{ maxWidth: 600 }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ color: '#c1c2c5' }}>Region</Table.Th>
            <Table.Th style={{ color: '#c1c2c5' }}>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr style={{ background: '#25262b' }}>
            <Table.Td style={{ color: '#c1c2c5' }}>EMEA</Table.Td>
            <Table.Td style={{ color: '#c1c2c5' }}>Active</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={2} style={{ background: '#2c2e33', padding: 0 }}>
              {renderTransfer('Visible resources', emeaLeft, emeaRight, emeaChecked, toggleEmea,
                makeMove(emeaChecked, emeaLeft, setEmeaRight, setEmeaLeft, setEmeaChecked),
                makeMove(emeaChecked, emeaRight, setEmeaLeft, setEmeaRight, setEmeaChecked),
                'save-row-emea', () => {})}
            </Table.Td>
          </Table.Tr>
          <Table.Tr style={{ background: '#25262b' }}>
            <Table.Td style={{ color: '#c1c2c5' }}>APAC</Table.Td>
            <Table.Td style={{ color: '#c1c2c5' }}>Active</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={2} style={{ background: '#2c2e33', padding: 0 }}>
              {renderTransfer('Visible resources', apacLeft, apacRight, apacChecked, toggleApac,
                makeMove(apacChecked, apacLeft, setApacRight, setApacLeft, setApacChecked),
                makeMove(apacChecked, apacRight, setApacLeft, setApacRight, setApacChecked),
                'save-row-apac', () => setCommittedApac([...apacRight]))}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  );
}
