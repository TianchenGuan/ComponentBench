'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Text, Checkbox, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const names = [
  'On-call Engineer', 'Incident Commander', 'Engineering Manager',
  'Security Officer', 'SRE', 'Support Lead', 'QA Lead', 'Finance Partner',
];

const PAGER_TARGET = ['On-call Engineer', 'Security Officer', 'SRE'];
const CHAT_MUST_REMAIN = ['Support Lead'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T12({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [pagerChecked, setPagerChecked] = useState<string[]>([]);
  const [pagerLeft, setPagerLeft] = useState(not(names, ['Incident Commander', 'On-call Engineer']));
  const [pagerRight, setPagerRight] = useState(['Incident Commander', 'On-call Engineer']);
  const [chatChecked, setChatChecked] = useState<string[]>([]);
  const [chatLeft, setChatLeft] = useState(not(names, ['Support Lead']));
  const [chatRight, setChatRight] = useState(['Support Lead']);
  const [committed, setCommitted] = useState<{ pager: string[]; chat: string[] } | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (
      !successFired.current && committed &&
      setsEqual(committed.pager, PAGER_TARGET) &&
      setsEqual(committed.chat, CHAT_MUST_REMAIN)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleApply = () => {
    setCommitted({ pager: [...pagerRight], chat: [...chatRight] });
    setOpen(false);
  };

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
    <Paper withBorder p="xs" style={{ width: 200 }}>
      <Text fw={500} size="sm" mb={4}>{title}</Text>
      <ScrollArea h={180}>
        <Stack gap={2}>
          {items.map(v => (
            <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />
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
  ) => (
    <div style={{ marginBottom: 16 }}>
      <Text fw={600} size="sm" mb={8}>{label}</Text>
      <Group align="center" gap="sm">
        {renderList('Available', left, checked, toggle)}
        <Stack gap={4}>
          <Button size="xs" variant="default" onClick={moveRight}
            disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="xs" variant="default" onClick={moveLeft}
            disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        {renderList('Selected', right, checked, toggle)}
      </Group>
    </div>
  );

  const togglePager = makeToggle(setPagerChecked);
  const toggleChat = makeToggle(setChatChecked);

  return (
    <div style={{ padding: 24 }}>
      <Text fw={600} size="lg" mb="md">Recipient groups</Text>
      <Text size="sm" c="dimmed" mb="md">Configure notification recipient groups.</Text>
      <Button onClick={() => setOpen(true)}>Edit recipient groups</Button>
      <Modal opened={open} onClose={() => setOpen(false)} title="Edit recipient groups" size="lg">
        {renderTransfer('Chat recipients', chatLeft, chatRight, chatChecked, toggleChat,
          makeMove(chatChecked, chatLeft, setChatRight, setChatLeft, setChatChecked),
          makeMove(chatChecked, chatRight, setChatLeft, setChatRight, setChatChecked))}
        {renderTransfer('Pager recipients', pagerLeft, pagerRight, pagerChecked, togglePager,
          makeMove(pagerChecked, pagerLeft, setPagerRight, setPagerLeft, setPagerChecked),
          makeMove(pagerChecked, pagerRight, setPagerLeft, setPagerRight, setPagerChecked))}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleApply}>Apply recipients</Button>
        </Group>
      </Modal>
    </div>
  );
}
