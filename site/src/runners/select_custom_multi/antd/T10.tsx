'use client';

/**
 * select_custom_multi-antd-T10: Edit Team B members in a crowded table
 *
 * Scene context: theme=light, spacing=comfortable, layout=table_cell, placement=center, scale=default, instances=1, guidance=text, clutter=high.
 * Layout: table cell editor (clutter: high). The page shows a data table titled "Project staffing".
 * Rows: Team A, Team B, Team C. Only the Team B row has an editable Members cell.
 * Target component: the Members cell for row "Team B" uses an Ant Design multi-select (tags display) rendered inside the table cell.
 * The table cell is narrow; when more than 2 members are selected, the cell shows two tags plus a "+N" overflow indicator.
 * Clicking inside the Team B Members cell focuses it and opens the dropdown anchored to the cell.
 * Dropdown options (15 people): Alex, Alexa, Alice, Alicia, Ben, Benny, Cara, Carol, Dan, Dana, Eli, Ellie, Frank, Frankie, Gia.
 * Initial state (Team B Members): Alice, Dan, Eli are preselected.
 * Other rows (Team A / Team C) show read-only text lists of members (not editable multi-selects).
 * No explicit Save button; changes apply immediately when tags are added/removed.
 *
 * Success: The selected values in the Team B Members multi-select are exactly: Alice, Dana, Ellie, Frankie (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography, Table } from 'antd';
import type { TaskComponentProps } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

const memberOptions = [
  'Alex', 'Alexa', 'Alice', 'Alicia', 'Ben', 'Benny', 
  'Cara', 'Carol', 'Dan', 'Dana', 'Eli', 'Ellie', 
  'Frank', 'Frankie', 'Gia'
].map(name => ({ label: name, value: name }));

interface TeamRow {
  key: string;
  team: string;
  members: string[];
  editable: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [teamBMembers, setTeamBMembers] = useState<string[]>(['Alice', 'Dan', 'Eli']);

  useEffect(() => {
    const targetSet = new Set(['Alice', 'Dana', 'Ellie', 'Frankie']);
    const currentSet = new Set(teamBMembers);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [teamBMembers, onSuccess]);

  const data: TeamRow[] = [
    { key: 'A', team: 'Team A', members: ['Alex', 'Ben', 'Cara'], editable: false },
    { key: 'B', team: 'Team B', members: teamBMembers, editable: true },
    { key: 'C', team: 'Team C', members: ['Frank', 'Gia'], editable: false },
  ];

  const columns: ColumnsType<TeamRow> = [
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
      width: 100,
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members: string[], record: TeamRow) => {
        if (record.editable) {
          return (
            <Select
              mode="multiple"
              data-testid="team-b-members-select"
              style={{ width: '100%', minWidth: 200 }}
              value={teamBMembers}
              onChange={setTeamBMembers}
              options={memberOptions}
              maxTagCount={2}
            />
          );
        }
        return <Text>{members.join(', ')}</Text>;
      },
    },
  ];

  return (
    <Card title="Project staffing" style={{ width: 500 }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
