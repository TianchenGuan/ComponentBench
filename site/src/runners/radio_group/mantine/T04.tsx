'use client';

/**
 * radio_group-mantine-T04: Locale: set Region to EU (two groups)
 *
 * A centered isolated card titled "Locale" contains two Mantine Radio.Group components stacked with clear section labels:
 * 1) "Language" options: English, Spanish, French (initial: English)
 * 2) "Region" options: US, EU, APAC (initial: US)
 * Both groups use similar styling and spacing.
 * A small summary area at the bottom shows "Language: … / Region: …" updating immediately on selection changes.
 * No Save button is present.
 *
 * Success: For the "Region" Radio.Group instance, the selected value equals "eu" (label "EU").
 */

import React, { useState } from 'react';
import { Card, Text, Radio, Stack, Divider, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [language, setLanguage] = useState<string>('english');
  const [region, setRegion] = useState<string>('us');

  const handleRegionChange = (value: string) => {
    setRegion(value);
    if (value === 'eu') {
      onSuccess();
    }
  };

  const languageLabels: Record<string, string> = { english: 'English', spanish: 'Spanish', french: 'French' };
  const regionLabels: Record<string, string> = { us: 'US', eu: 'EU', apac: 'APAC' };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={600} size="lg" mb="md">Locale</Text>

      {/* Language group */}
      <div data-instance="Language">
        <Radio.Group
          data-canonical-type="radio_group"
          data-selected-value={language}
          value={language}
          onChange={setLanguage}
          label="Language"
        >
          <Stack gap="xs" mt="xs">
            <Radio value="english" label="English" />
            <Radio value="spanish" label="Spanish" />
            <Radio value="french" label="French" />
          </Stack>
        </Radio.Group>
      </div>

      <Divider my="md" />

      {/* Region group */}
      <div data-instance="Region">
        <Radio.Group
          data-canonical-type="radio_group"
          data-selected-value={region}
          value={region}
          onChange={handleRegionChange}
          label="Region"
        >
          <Stack gap="xs" mt="xs">
            <Radio value="us" label="US" />
            <Radio value="eu" label="EU" />
            <Radio value="apac" label="APAC" />
          </Stack>
        </Radio.Group>
      </div>

      <Group gap="xs" mt="md">
        <Text size="sm" c="dimmed">
          Language: {languageLabels[language]} / Region: {regionLabels[region]}
        </Text>
      </Group>
    </Card>
  );
}
