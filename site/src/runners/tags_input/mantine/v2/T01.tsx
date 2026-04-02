'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TagsInput, Button, Drawer, Group, Text, Card, useMantineTheme, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const suggestions = ['release', 'notes', 'qa', 'docs', 'urgent', 'client'];

function setsEqual(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.toLowerCase().trim()));
  const sb = new Set(b.map(s => s.toLowerCase().trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

function Inner({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['todo']);
  const [savedTags, setSavedTags] = useState<string[]>(['todo']);

  const handleApply = () => {
    setSavedTags([...tags]);
    setDrawerOpen(false);
  };

  const handleCancel = () => {
    setTags([...savedTags]);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (!hasSucceeded.current && setsEqual(savedTags, ['urgent', 'client'])) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedTags, onSuccess]);

  return (
    <div style={{ padding: 24, background: '#1a1b1e', minHeight: '100vh' }}>
      <Card shadow="sm" p="lg" style={{ maxWidth: 400, background: '#25262b' }}>
        <Text c="dimmed" mb="md">Label management dashboard</Text>
        <Button onClick={() => setDrawerOpen(true)}>Edit labels</Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={handleCancel}
        title="Edit labels"
        position="right"
        size="sm"
      >
        <TagsInput
          label="Tags"
          placeholder="Type and press Enter…"
          data={suggestions}
          value={tags}
          onChange={setTags}
          mb="xl"
        />

        <Group>
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleApply}>Apply</Button>
        </Group>
      </Drawer>
    </div>
  );
}

export default function T01(props: TaskComponentProps) {
  return (
    <MantineProvider forceColorScheme="dark">
      <Inner {...props} />
    </MantineProvider>
  );
}
