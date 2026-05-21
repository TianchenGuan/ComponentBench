'use client';

/**
 * select_custom_multi-antd-T05: Set Primary skills (React + TypeScript + GraphQL)
 *
 * Scene context: theme=light, spacing=comfortable, layout=form_section, placement=center, scale=default, instances=2, guidance=text, clutter=none.
 * Layout: a minimal form section titled "Profile" centered on the page.
 * Target components: two Ant Design multi-selects (tags display), stacked vertically:
 *   1) "Primary skills" (this is the target instance for the task)
 *   2) "Secondary skills" (distractor instance)
 * Both share the same option list of 10 skills: HTML, CSS, JavaScript, React, TypeScript, Node.js, GraphQL, Python, Docker, SQL.
 * Initial state:
 *   - Primary skills has one preselected tag: HTML.
 *   - Secondary skills has two preselected tags: CSS and SQL (distractors).
 * No other form inputs are included in this section (clutter: none). Selecting/deselecting skills updates the tags immediately; there is no Save button.
 *
 * Success: Only 'Primary skills' is evaluated. The selected values are exactly: React, TypeScript, GraphQL (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const skillOptions = [
  { label: 'HTML', value: 'HTML' },
  { label: 'CSS', value: 'CSS' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'React', value: 'React' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'GraphQL', value: 'GraphQL' },
  { label: 'Python', value: 'Python' },
  { label: 'Docker', value: 'Docker' },
  { label: 'SQL', value: 'SQL' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primarySkills, setPrimarySkills] = useState<string[]>(['HTML']);
  const [secondarySkills, setSecondarySkills] = useState<string[]>(['CSS', 'SQL']);

  useEffect(() => {
    const targetSet = new Set(['React', 'TypeScript', 'GraphQL']);
    const currentSet = new Set(primarySkills);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [primarySkills, onSuccess]);

  return (
    <Card title="Profile" style={{ width: 500 }}>
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary skills</Text>
        <Select
          mode="multiple"
          data-testid="primary-skills-select"
          style={{ width: '100%' }}
          placeholder="Select primary skills"
          value={primarySkills}
          onChange={setPrimarySkills}
          options={skillOptions}
        />
      </div>
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Secondary skills</Text>
        <Select
          mode="multiple"
          data-testid="secondary-skills-select"
          style={{ width: '100%' }}
          placeholder="Select secondary skills"
          value={secondarySkills}
          onChange={setSecondarySkills}
          options={skillOptions}
        />
      </div>
    </Card>
  );
}
