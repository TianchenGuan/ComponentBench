'use client';

/**
 * virtual_list-mantine-v2-T04
 * Tag assignment modal: exact four-tag set and apply
 *
 * Mantine Modal with a dense virtualized checkbox list. Agent must check
 * exactly TAG-011, TAG-024, TAG-037, TAG-041 and click "Apply tags".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Button, Modal, Checkbox, Box } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../../types';

interface TagItem { key: string; code: string; label: string; }

const tagLabels = [
  'Paid', 'High priority', 'Customer visible', 'Follow-up', 'Internal only',
  'Customer-visible notes', 'High-priority billing', 'Archived', 'Pending review',
  'Auto-tagged', 'Manual review', 'Escalated', 'Resolved', 'Deferred',
  'Compliance', 'Beta feature', 'Public', 'Private', 'Draft', 'Final',
];

function buildTags(): TagItem[] {
  return Array.from({ length: 400 }, (_, i) => ({
    key: `tag-${String(i).padStart(3, '0')}`,
    code: `TAG-${String(i).padStart(3, '0')}`,
    label: tagLabels[i % tagLabels.length],
  }));
}

const tags = buildTags();
const TARGET_KEYS = new Set(['tag-011', 'tag-024', 'tag-037', 'tag-041']);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef(false);

  const virtualizer = useVirtualizer({
    count: tags.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 5,
  });

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => virtualizer.measure());
      return () => cancelAnimationFrame(id);
    }
  }, [open, virtualizer]);

  useEffect(() => {
    if (successRef.current) return;
    if (saved && checked.size === TARGET_KEYS.size && Array.from(TARGET_KEYS).every(k => checked.has(k))) {
      successRef.current = true;
      onSuccess();
    }
  }, [saved, checked, onSuccess]);

  const toggle = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setSaved(false);
  };

  return (
    <div style={{ padding: 16, maxWidth: 480 }}>
      <Paper shadow="xs" p="sm" mb="sm" withBorder>
        <Text fw={600} size="sm">Item tagging</Text>
        <Text size="xs" c="dimmed">Assign tags to this item for filtering and routing.</Text>
      </Paper>

      <Button variant="outline" onClick={() => { setOpen(true); setChecked(new Set()); setSaved(false); }}>
        Assign tags
      </Button>

      <Modal opened={open} onClose={() => setOpen(false)} title="Assign tags" size="md">
        <Text size="xs" c="dimmed" mb={6}>Selected: {checked.size}</Text>
        <Box ref={parentRef} style={{ height: 340, overflow: 'auto', border: '1px solid #e9ecef', borderRadius: 4 }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
            {virtualizer.getVirtualItems().map((vr: VirtualItem) => {
              const item = tags[vr.index];
              return (
                <div
                  key={item.key}
                  data-item-key={item.key}
                  onClick={() => toggle(item.key)}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%',
                    height: `${vr.size}px`,
                    transform: `translateY(${vr.start}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f5f5f5',
                    backgroundColor: checked.has(item.key) ? '#ebfbee' : 'transparent',
                    fontSize: 13,
                  }}
                >
                  <Checkbox checked={checked.has(item.key)} readOnly size="xs" />
                  <span>{item.code} {item.label}</span>
                </div>
              );
            })}
          </div>
        </Box>
        <Button fullWidth mt="sm" onClick={() => setSaved(true)}>Apply tags</Button>
      </Modal>
    </div>
  );
}
