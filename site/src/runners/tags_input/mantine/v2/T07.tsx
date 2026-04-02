'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TagsInput, Button, Group, Text, Box, Popover } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const librarySuggestions = ['Vue', 'Solid', 'Ember', 'React', 'Angular', 'Svelte'];

function setsEqualCaseSensitive(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.trim()));
  const sb = new Set(b.map(s => s.trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [libraryTags, setLibraryTags] = useState<string[]>(['Vue']);
  const [internalTags] = useState<string[]>(['do-not-edit']);
  const [savedLibrary, setSavedLibrary] = useState<string[]>(['Vue']);
  const [savedInternal] = useState<string[]>(['do-not-edit']);

  const handleApply = () => {
    setSavedLibrary([...libraryTags]);
    setPopoverOpen(false);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqualCaseSensitive(savedLibrary, ['React', 'Angular', 'Svelte']) &&
      setsEqualCaseSensitive(savedInternal, ['do-not-edit'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedLibrary, savedInternal, onSuccess]);

  return (
    <Box p="md">
      <Popover opened={popoverOpen} onChange={setPopoverOpen} position="bottom-start" width={320}>
        <Popover.Target>
          <Button onClick={() => setPopoverOpen(o => !o)}>Edit libraries</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <TagsInput
            label="Library tags"
            size="sm"
            data={librarySuggestions}
            value={libraryTags}
            onChange={setLibraryTags}
            comboboxProps={{ withinPortal: false }}
            mb="sm"
          />

          <TagsInput
            label="Internal tags"
            size="sm"
            value={internalTags}
            readOnly
            mb="md"
          />

          <Group>
            <Button size="sm" onClick={handleApply}>Apply libraries</Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
