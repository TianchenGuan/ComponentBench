'use client';

/**
 * combobox_editable_multi-mantine-T04: Set exclude tags without touching include tags
 *
 * Layout is a filter form section with two similar Mantine TagsInput fields:
 * - "Include tags" (distractor): initial pills = important
 * - "Exclude tags" (target): initial pills = none
 * Both support free input and also show a small suggestions dropdown with a few common tags (important, spam, test, internal, external).
 * Other clutter: a Select "Sort by" and a Button "Run report" (not required).
 * The goal is to set ONLY Exclude tags to exactly {spam, test}.
 *
 * Success: Exclude tags selected values equal {spam, test} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput, Select, Button, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const suggestions = ['important', 'spam', 'test', 'internal', 'external'];

const TARGET_SET = ['spam', 'test'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [includeValue, setIncludeValue] = useState<string[]>(['important']);
  const [excludeValue, setExcludeValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(excludeValue, TARGET_SET)) {
      onSuccess();
    }
  }, [excludeValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Filter Settings</Text>
      
      <Stack gap="md">
        <div>
          <Text fw={500} size="sm" mb={8}>Include tags</Text>
          <TagsInput
            data-testid="include-tags"
            placeholder="Add include tags"
            data={suggestions}
            value={includeValue}
            onChange={setIncludeValue}
          />
        </div>
        
        <div>
          <Text fw={500} size="sm" mb={8}>Exclude tags</Text>
          <TagsInput
            data-testid="exclude-tags"
            placeholder="Add exclude tags"
            data={suggestions}
            value={excludeValue}
            onChange={setExcludeValue}
          />
        </div>
        
        <div>
          <Text fw={500} size="sm" mb={8}>Sort by</Text>
          <Select
            placeholder="Select sort order"
            data={['Date', 'Name', 'Priority', 'Status']}
          />
        </div>
        
        <Button>Run report</Button>
      </Stack>
    </Card>
  );
}
