'use client';

/**
 * hover_card-mantine-T04: Match Target Preview among three HoverCards (visual)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing).
 *
 * The page shows:
 * - A "Target Preview" box on the left containing a static avatar preview (image-only, no name).
 * - Three user avatars arranged in a row on the right. Each avatar has a small caption under it:
 *   * Candidate 1
 *   * Candidate 2
 *   * Candidate 3
 *
 * Each candidate avatar is wrapped in its own Mantine HoverCard (and they are grouped with HoverCard.Group so their open/close delays are synchronized).
 * - Each HoverCard.Dropdown contains the candidate's name and role.
 * - All dropdowns use the same size and styling; only the avatar image differs.
 *
 * Instances: 3 hover cards.
 * Initial state: all closed.
 * Guidance: visual (match by avatar image shown in Target Preview).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Avatar, Group, Stack, HoverCard, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const candidates = [
  { id: 1, name: 'Alex Kim', role: 'Developer', initials: 'AK', color: 'blue' },
  { id: 2, name: 'Sam Taylor', role: 'Designer', initials: 'ST', color: 'grape' },
  { id: 3, name: 'Jordan Lee', role: 'Manager', initials: 'JL', color: 'teal' },
];

// Target is Candidate 2 (grape/purple)
const TARGET_CANDIDATE = 2;

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [activeCandidate, setActiveCandidate] = useState<number | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeCandidate === TARGET_CANDIDATE && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeCandidate, onSuccess]);

  const targetCandidate = candidates.find(c => c.id === TARGET_CANDIDATE)!;

  return (
    <Group gap="xl" align="flex-start">
      {/* Target Preview */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 140 }} data-testid="target-preview" id="target-preview">
        <Text size="xs" c="dimmed" mb="sm">Target Preview</Text>
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar size="xl" radius="xl" color={targetCandidate.color}>
            {targetCandidate.initials}
          </Avatar>
        </Box>
      </Card>

      {/* Candidates */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 320 }}>
        <Text fw={600} size="lg" mb="md">Candidates</Text>
        <Group gap="lg">
          {candidates.map((candidate) => (
            <HoverCard 
              key={candidate.id}
              width={200} 
              shadow="md"
              onOpen={() => setActiveCandidate(candidate.id)}
              onClose={() => setActiveCandidate(null)}
            >
              <HoverCard.Target>
                <Stack 
                  align="center" 
                  gap={4}
                  style={{ cursor: 'pointer' }}
                  data-testid={`candidate-${candidate.id}-trigger`}
                  data-cb-instance={`Candidate ${candidate.id}`}
                >
                  <Avatar size="lg" radius="xl" color={candidate.color}>
                    {candidate.initials}
                  </Avatar>
                  <Text size="xs" c="dimmed">Candidate {candidate.id}</Text>
                </Stack>
              </HoverCard.Target>
              <HoverCard.Dropdown 
                data-testid={`hover-card-candidate-${candidate.id}`}
                data-cb-instance={`Candidate ${candidate.id}`}
              >
                <Group>
                  <Avatar size="md" radius="xl" color={candidate.color}>
                    {candidate.initials}
                  </Avatar>
                  <Stack gap={2}>
                    <Text size="sm" fw={600}>{candidate.name}</Text>
                    <Text size="xs" c="dimmed">{candidate.role}</Text>
                  </Stack>
                </Group>
              </HoverCard.Dropdown>
            </HoverCard>
          ))}
        </Group>
      </Card>
    </Group>
  );
}
