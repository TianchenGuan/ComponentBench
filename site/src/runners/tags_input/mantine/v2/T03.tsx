'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TagsInput, Button, Group, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

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

export default function T03({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [audienceTags, setAudienceTags] = useState<string[]>([]);
  const [internalTags] = useState<string[]>(['internal', 'do-not-edit']);
  const [savedAudience, setSavedAudience] = useState<string[]>([]);
  const [savedInternal] = useState<string[]>(['internal', 'do-not-edit']);

  const validationError = audienceTags.length !== 3 ? 'Exactly 3 tags required' : null;

  const handleApply = () => {
    setSavedAudience([...audienceTags]);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedAudience, ['alpha', 'beta', 'gamma']) &&
      setsEqual(savedInternal, ['internal', 'do-not-edit'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedAudience, savedInternal, onSuccess]);

  return (
    <Box p="md" style={{ maxWidth: 400 }}>
      <Text fw={600} mb="md">Tag Configuration</Text>

      <TagsInput
        label="Audience tags"
        placeholder="Type and press Enter to add"
        acceptValueOnBlur={false}
        value={audienceTags}
        onChange={setAudienceTags}
        error={validationError}
        mb="md"
      />

      <TagsInput
        label="Internal tags"
        value={internalTags}
        readOnly
        mb="md"
      />

      <Group>
        <Button
          disabled={audienceTags.length !== 3}
          onClick={handleApply}
        >
          Apply audience
        </Button>
      </Group>
    </Box>
  );
}
