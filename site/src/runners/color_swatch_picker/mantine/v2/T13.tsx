'use client';

/**
 * color_swatch_picker-mantine-v2-T13: Long panel — Sidebar marker #12b886, Save marker colors
 */

import React, { useState, useEffect, useRef } from 'react';
import { Text, Button, Stack, TextInput, Switch, ColorInput, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES, EXTENDED_MANTINE_SWATCHES } from '../../types';

const TARGET = '#12b886';

const SWATCHES = Array.from(new Set([...EXTENDED_MANTINE_SWATCHES, ...MANTINE_SWATCHES, TARGET]));

export default function T13({ task: _task, onSuccess }: TaskComponentProps) {
  const doneRef = useRef(false);

  const INIT = '#868e96';
  const [draft, setDraft] = useState(INIT);
  const [committed, setCommitted] = useState(INIT);

  useEffect(() => {
    if (doneRef.current) return;
    if (hexMatches(committed, TARGET)) {
      doneRef.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const filler = Array.from({ length: 14 }, (_, i) => (
    <Stack key={i} gap="xs" mb="lg">
      <Text size="sm" fw={500}>
        Section {i + 1}
      </Text>
      <TextInput label="Label" placeholder="value" size="xs" />
      <Switch label="Enable" size="xs" />
    </Stack>
  ));

  return (
    <div style={{ padding: 8, maxWidth: 400 }}>
      <ScrollArea h={420} type="auto" offsetScrollbars>
        {filler}
        <Text size="sm" fw={600} mb="xs">
          Sidebar marker color
        </Text>
        <ColorInput
          label="Sidebar marker color"
          value={draft}
          onChange={setDraft}
          format="hex"
          swatches={SWATCHES}
          withPicker={false}
          disallowInput
          swatchesPerRow={4}
          popoverProps={{
            styles: {
              dropdown: { maxHeight: 200, overflowY: 'auto' },
            },
          }}
        />
      </ScrollArea>
      <Button mt="md" size="sm" onClick={() => setCommitted(draft)}>
        Save marker colors
      </Button>
      <div data-testid="sidebar-marker-committed" style={{ display: 'none' }}>
        {normalizeHex(committed)}
      </div>
    </div>
  );
}
