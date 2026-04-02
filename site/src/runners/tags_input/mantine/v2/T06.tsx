'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TagsInput, Button, Group, Text, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const campaignSuggestions = [
  'archive', 'release', 'qa', 'docs', 'featured', 'staff-pick', '2026',
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

export default function T06({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [audienceTags, setAudienceTags] = useState<string[]>(['newsletter']);
  const [campaignTags, setCampaignTags] = useState<string[]>(['draft']);
  const [internalTags, setInternalTags] = useState<string[]>(['private']);
  const [savedCampaign, setSavedCampaign] = useState<string[]>(['draft']);
  const [savedAudience, setSavedAudience] = useState<string[]>(['newsletter']);
  const [savedInternal, setSavedInternal] = useState<string[]>(['private']);

  const handleApply = () => {
    setSavedCampaign([...campaignTags]);
    setSavedAudience([...audienceTags]);
    setSavedInternal([...internalTags]);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedCampaign, ['featured', 'staff-pick', '2026']) &&
      setsEqual(savedAudience, ['newsletter']) &&
      setsEqual(savedInternal, ['private'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedCampaign, savedAudience, savedInternal, onSuccess]);

  return (
    <Box p="md" style={{ maxWidth: 400 }}>
      <Text fw={600} mb="sm">Campaign Settings</Text>

      <Text size="sm" mb="xs">Target badges:</Text>
      <Group mb="md" gap="xs">
        <Badge color="blue">featured</Badge>
        <Badge color="teal">staff-pick</Badge>
        <Badge color="grape">2026</Badge>
      </Group>

      <TagsInput
        label="Audience tags"
        size="sm"
        data={[]}
        value={audienceTags}
        onChange={setAudienceTags}
        mb="sm"
      />

      <TagsInput
        label="Campaign tags"
        size="sm"
        data={campaignSuggestions}
        value={campaignTags}
        onChange={setCampaignTags}
        mb="sm"
      />

      <TagsInput
        label="Internal tags"
        size="sm"
        data={[]}
        value={internalTags}
        onChange={setInternalTags}
        mb="md"
      />

      <Button onClick={handleApply}>Apply campaign</Button>
    </Box>
  );
}
