'use client';

/**
 * tags_input-antd-T05: Search then select two project tags in a form section
 *
 * The scene is a "New ticket" **form section** (not an isolated card): multiple labeled fields are stacked vertically.
 *
 * Relevant component:
 * - The third field is labeled "Tags" and uses Ant Design Select in **tags** mode with search enabled.
 * - The dropdown contains a longer list of existing project tags (≈25), including:
 *   Project Atlas, Project Beacon, Project Cascade, Project Delta, Project Echo, … (plus several similarly named items).
 * - When the dropdown is open, typing filters the option list (default AntD filtering by label).
 *
 * Initial state:
 * - The Tags field is empty.
 *
 * Distractors (clutter=medium):
 * - Above Tags: a TextInput labeled "Subject" (already filled) and a Priority Select (single-select).
 * - Below Tags: a large "Description" textarea and a "Submit" button (not required for success).
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): Project Atlas, Project Beacon.
 */

import React, { useRef, useEffect } from 'react';
import { Input, Select, Typography, Button } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;
const { TextArea } = Input;

const projectOptions = [
  'Project Atlas', 'Project Beacon', 'Project Cascade', 'Project Delta', 'Project Echo',
  'Project Falcon', 'Project Gamma', 'Project Horizon', 'Project Insight', 'Project Jupiter',
  'Project Keystone', 'Project Lambda', 'Project Mercury', 'Project Nova', 'Project Omega',
  'Project Phoenix', 'Project Quantum', 'Project Radiant', 'Project Saturn', 'Project Titan',
  'Project Unity', 'Project Vanguard', 'Project Wildfire', 'Project Xenon', 'Project Zenith'
].map(p => ({ value: p, label: p }));

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.trim());
    const requiredTags = ['Project Atlas', 'Project Beacon'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <div style={{ width: 450, padding: 24, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
      <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 16 }}>New ticket</Text>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Subject</Text>
        <Input defaultValue="Quarterly planning discussion" data-testid="subject-input" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Priority</Text>
        <Select
          style={{ width: '100%' }}
          defaultValue="medium"
          options={priorityOptions}
          data-testid="priority-select"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Tags</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Search and select tags..."
          value={tags}
          onChange={setTags}
          options={projectOptions}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          data-testid="tags-input"
          aria-label="Tags"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Description</Text>
        <TextArea rows={4} placeholder="Enter description..." data-testid="description-textarea" />
      </div>

      <Button type="primary">Submit</Button>
    </div>
  );
}
