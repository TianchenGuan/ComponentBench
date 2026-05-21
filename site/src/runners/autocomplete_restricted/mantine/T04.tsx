'use client';

/**
 * autocomplete_restricted-mantine-T04: Searchable tech stack selection
 *
 * setup_description:
 * The page shows a "Developer profile" **form section** with several fields:
 * - Display name (text input)
 * - GitHub username (text input)
 * - **Primary language** (Mantine Select, searchable)  ← target
 * - Bio (textarea)
 *
 * Primary language Select details:
 * - Theme: light; spacing: comfortable; size: default.
 * - `searchable` is enabled, so typing filters the dropdown options.
 * - Options include ~25 programming languages, e.g., Java, JavaScript, Kotlin, Python, Ruby, Rust, Swift, TypeScript, etc.
 * - Restricted: only listed options can be selected as the final value.
 * - Selection commits immediately; no Save required.
 *
 * Other inputs are present as clutter but do not affect success.
 *
 * Success: The "Primary language" Select has selected value "Kotlin".
 */

import React, { useState } from 'react';
import { Card, Text, Select, TextInput, Textarea, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const languages = [
  'C', 'C++', 'C#', 'Clojure', 'Dart', 'Elixir', 'Erlang', 'Go', 'Haskell',
  'Java', 'JavaScript', 'Julia', 'Kotlin', 'Lua', 'Objective-C', 'Perl',
  'PHP', 'Python', 'R', 'Ruby', 'Rust', 'Scala', 'Swift', 'TypeScript', 'Zig'
].map(lang => ({ label: lang, value: lang }));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Kotlin') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Developer profile</Text>
      <Stack gap="md">
        <div>
          <Text fw={500} size="sm" mb={4}>Display name</Text>
          <TextInput placeholder="Enter your name" />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>GitHub username</Text>
          <TextInput placeholder="@username" />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>Primary language</Text>
          <Select
            data-testid="primary-language-select"
            placeholder="Select language"
            data={languages}
            value={value}
            onChange={handleChange}
            searchable
          />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>Bio</Text>
          <Textarea placeholder="Tell us about yourself" rows={3} />
        </div>
      </Stack>
    </Card>
  );
}
