'use client';

/**
 * number_input_spinbutton-mui-T08: Edit Team B seats in table
 * 
 * The UI is a compact table with three rows: Team A, Team B, Team C.
 * The "Seats" column is editable via an inline MUI Number Field in each row (3 instances):
 * - Team A seats: 6
 * - Team B seats: 9 (TARGET)
 * - Team C seats: 4
 * Each cell uses small scale to fit the table; step=1, min=1, max=50.
 * When you edit a row's Seats, a "Done" icon button (checkmark) appears in that same row; clicking it commits the change. A "Revert" icon appears as a distractor.
 * The table header includes a search box and a sort button (clutter), but these do not affect success.
 * 
 * Success: The numeric value of the target number input (Team B / Seats) is 12, and the Done button for that row has been clicked.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, TextField, Typography, Box, IconButton, 
  Table, TableBody, TableCell, TableHead, TableRow, InputAdornment 
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import type { TaskComponentProps } from '../types';

interface TeamRow {
  id: string;
  name: string;
  seats: number;
  originalSeats: number;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [teams, setTeams] = useState<TeamRow[]>([
    { id: 'team-a', name: 'Team A', seats: 6, originalSeats: 6 },
    { id: 'team-b', name: 'Team B', seats: 9, originalSeats: 9 },
    { id: 'team-c', name: 'Team C', seats: 4, originalSeats: 4 },
  ]);
  const [teamBSaved, setTeamBSaved] = useState(false);

  useEffect(() => {
    const teamB = teams.find(t => t.id === 'team-b');
    if (teamB && teamB.seats === 12 && teamBSaved) {
      onSuccess();
    }
  }, [teams, teamBSaved, onSuccess]);

  const handleSeatsChange = (id: string, value: number) => {
    setTeams(prev => prev.map(team =>
      team.id === id ? { ...team, seats: value } : team
    ));
    if (id === 'team-b') {
      setTeamBSaved(false);
    }
  };

  const handleDone = (id: string) => {
    setTeams(prev => prev.map(team =>
      team.id === id ? { ...team, originalSeats: team.seats } : team
    ));
    if (id === 'team-b') {
      setTeamBSaved(true);
    }
  };

  const handleRevert = (id: string) => {
    setTeams(prev => prev.map(team =>
      team.id === id ? { ...team, seats: team.originalSeats } : team
    ));
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Teams</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 150 }}
            />
            <IconButton size="small">
              <SortIcon />
            </IconButton>
          </Box>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => {
              const isDirty = team.seats !== team.originalSeats;
              return (
                <TableRow key={team.id} data-row={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={team.seats}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v) && v >= 1 && v <= 50) {
                          handleSeatsChange(team.id, v);
                        }
                      }}
                      inputProps={{ 
                        min: 1, 
                        max: 50, 
                        step: 1,
                        'data-testid': `${team.id}-seats-input`
                      }}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    {isDirty && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleDone(team.id)}
                          data-testid={`${team.id}-done-btn`}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => handleRevert(team.id)}
                          data-testid={`${team.id}-revert-btn`}
                        >
                          <UndoIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
