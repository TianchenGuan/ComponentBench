'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TagsInput, Button, Group, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const suggestions = ['gamma', 'delta', 'legacy', 'alpha', 'beta'];

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

export default function T05({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [facetTags, setFacetTags] = useState<string[]>(['old', 'temp', 'unused']);
  const [savedFacets] = useState<string[]>(['pinned']);
  const [savedFacetTags, setSavedFacetTags] = useState<string[]>(['old', 'temp', 'unused']);
  const [savedSavedFacets] = useState<string[]>(['pinned']);

  const handleSave = () => {
    setSavedFacetTags([...facetTags]);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedFacetTags, ['alpha', 'beta']) &&
      setsEqual(savedSavedFacets, ['pinned'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedFacetTags, savedSavedFacets, onSuccess]);

  return (
    <Box p="md" style={{ maxWidth: 360 }}>
      <Box
        style={{
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: 16,
        }}
      >
        <Text fw={600} size="sm" mb="md">Facet Configuration</Text>

        <TagsInput
          label="Facet tags"
          data={suggestions}
          value={facetTags}
          onChange={setFacetTags}
          clearable
          mb="md"
        />

        <TagsInput
          label="Saved facets"
          value={savedFacets}
          readOnly
          mb="md"
        />

        <Group>
          <Button size="sm" onClick={handleSave}>Save facets</Button>
        </Group>
      </Box>
    </Box>
  );
}
