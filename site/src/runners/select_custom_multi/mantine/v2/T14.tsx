'use client';

/**
 * select_custom_multi-mantine-v2-T14: Team C skills compact row repair
 *
 * Table cell layout, compact spacing, small scale, off-center, high clutter.
 * Staffing table with 3 rows (Team A, B, C). Only Team C has an editable Mantine MultiSelect
 * in the Skills cell. Team A/B are read-only.
 * Options: Python, Python ETL, SQL, SQL Legacy, Airflow, Airflow 1.x, Docker, Kubernetes, dbt.
 * Initial Team C: [Python ETL, SQL]. Target: [Python, SQL, Airflow, Docker].
 * Row-local "Save row" for Team C commits the change.
 *
 * Success: Team C skills = {Python, SQL, Airflow, Docker}, Save row clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, MultiSelect, Button, Badge, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const skillOptions = [
  'Python', 'Python ETL', 'SQL', 'SQL Legacy', 'Airflow', 'Airflow 1.x',
  'Docker', 'Kubernetes', 'dbt',
];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [teamCSkills, setTeamCSkills] = useState<string[]>(['Python ETL', 'SQL']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(teamCSkills, ['Python', 'SQL', 'Airflow', 'Docker'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, teamCSkills, onSuccess]);

  const cellStyle: React.CSSProperties = {
    padding: '6px 8px',
    borderBottom: '1px solid #dee2e6',
    fontSize: 12,
  };

  return (
    <div style={{ padding: 16 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 640 }}>
        <Group justify="space-between" mb="sm">
          <Text fw={600} size="lg">Staffing</Text>
          <Group gap="xs">
            <Badge variant="light" size="sm">Filter: Active</Badge>
            <Badge variant="light" size="sm">Sort: Name</Badge>
          </Group>
        </Group>

        <div style={{ border: '1px solid #dee2e6', borderRadius: 4, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ ...cellStyle, textAlign: 'left', width: 90 }}>Team</th>
                <th style={{ ...cellStyle, textAlign: 'left', width: 70 }}>Status</th>
                <th style={{ ...cellStyle, textAlign: 'left' }}>Skills</th>
                <th style={{ ...cellStyle, width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>Team A</td>
                <td style={cellStyle}><Badge size="xs" color="green" variant="light">Active</Badge></td>
                <td style={cellStyle}><Text size="xs" c="dimmed">React, TypeScript, Node.js</Text></td>
                <td style={cellStyle}></td>
              </tr>
              <tr>
                <td style={cellStyle}>Team B</td>
                <td style={cellStyle}><Badge size="xs" color="green" variant="light">Active</Badge></td>
                <td style={cellStyle}><Text size="xs" c="dimmed">Go, Kubernetes, Terraform</Text></td>
                <td style={cellStyle}></td>
              </tr>
              <tr style={{ background: '#f0f4ff' }}>
                <td style={cellStyle}><Text fw={600} size="xs">Team C</Text></td>
                <td style={cellStyle}><Badge size="xs" color="yellow" variant="light">Review</Badge></td>
                <td style={cellStyle}>
                  <MultiSelect
                    searchable
                    clearable
                    size="xs"
                    data={skillOptions}
                    value={teamCSkills}
                    onChange={(v) => { setTeamCSkills(v); setSaved(false); }}
                    placeholder="Select skills"
                    style={{ minWidth: 200 }}
                  />
                </td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <Button size="xs" data-testid="save-row-team-c" onClick={() => setSaved(true)}>
                    Save row
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
