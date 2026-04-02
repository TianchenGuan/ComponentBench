'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TagsInput, Button, Group, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const publicSuggestions = [
  'generic', 'retry', 'docs', 'qa', 'ops', 'release', 'nightly',
  'backend', 'frontend', 'infra', 'deploy', 'rollback', 'staging',
  'production', 'monitoring', 'alert', 'incident', 'postmortem',
];

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

export default function T08({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [headerTopics, setHeaderTopics] = useState<string[]>(['summary']);
  const [publicTopics, setPublicTopics] = useState<string[]>(['generic']);
  const [footerTopics, setFooterTopics] = useState<string[]>(['archived']);
  const [savedPublic, setSavedPublic] = useState<string[]>(['generic']);
  const [savedHeader, setSavedHeader] = useState<string[]>(['summary']);
  const [savedFooter, setSavedFooter] = useState<string[]>(['archived']);

  const handleApply = () => {
    setSavedPublic([...publicTopics]);
    setSavedHeader([...headerTopics]);
    setSavedFooter([...footerTopics]);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedPublic, ['ops', 'release', 'nightly']) &&
      setsEqual(savedHeader, ['summary']) &&
      setsEqual(savedFooter, ['archived'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedPublic, savedHeader, savedFooter, onSuccess]);

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 320,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: 16,
      }}
    >
      <Text fw={600} size="sm" mb="md">Topics Panel</Text>

      <TagsInput
        label="Header topics"
        size="xs"
        data={[]}
        value={headerTopics}
        onChange={setHeaderTopics}
        mb="sm"
      />

      <TagsInput
        label="Public topics"
        size="xs"
        data={publicSuggestions}
        value={publicTopics}
        onChange={setPublicTopics}
        withScrollArea={false}
        styles={{ dropdown: { maxHeight: 160, overflowY: 'auto' } }}
        mb="sm"
      />

      <TagsInput
        label="Footer topics"
        size="xs"
        data={[]}
        value={footerTopics}
        onChange={setFooterTopics}
        mb="md"
      />

      <Group>
        <Button size="xs" onClick={handleApply}>Apply topics</Button>
      </Group>
    </Box>
  );
}
