'use client';

/**
 * table_static-mui-T05: Choose the correct table and match a mixed reference
 *
 * A single centered card contains two read-only MUI Table instances stacked vertically with clear headings:
 * "Pending reviews" on top and "Approved reviews" below. Both tables have similar columns (Review ID, Rating, Reason) and
 * visually similar star ratings. A small reference card sits directly above the Pending reviews table showing a 2-star visual
 * and the text reason "Spam" (mixed guidance). Only one row in the Pending reviews table matches both cues; the Approved
 * reviews table may contain similar-looking rows as a distractor. Rows are single-select; initial state: no row selected
 * in Pending reviews.
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface ReviewData {
  key: string;
  reviewId: string;
  rating: number;
  reason: string;
}

const pendingReviewsData: ReviewData[] = [
  { key: 'REV-1180', reviewId: 'REV-1180', rating: 1, reason: 'Off-topic' },
  { key: 'REV-1181', reviewId: 'REV-1181', rating: 3, reason: 'Spam' },
  { key: 'REV-1182', reviewId: 'REV-1182', rating: 2, reason: 'Spam' },
  { key: 'REV-1183', reviewId: 'REV-1183', rating: 2, reason: 'Inappropriate' },
  { key: 'REV-1184', reviewId: 'REV-1184', rating: 4, reason: 'Duplicate' },
];

const approvedReviewsData: ReviewData[] = [
  { key: 'REV-1170', reviewId: 'REV-1170', rating: 5, reason: 'Helpful' },
  { key: 'REV-1171', reviewId: 'REV-1171', rating: 2, reason: 'Spam' }, // Distractor
  { key: 'REV-1172', reviewId: 'REV-1172', rating: 4, reason: 'Detailed' },
  { key: 'REV-1173', reviewId: 'REV-1173', rating: 3, reason: 'Good feedback' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [pendingSelectedKey, setPendingSelectedKey] = useState<string | null>(null);
  const [approvedSelectedKey, setApprovedSelectedKey] = useState<string | null>(null);

  const handlePendingRowClick = (record: ReviewData) => {
    setPendingSelectedKey(record.key);
    if (record.key === 'REV-1182') {
      onSuccess();
    }
  };

  const handleApprovedRowClick = (record: ReviewData) => {
    setApprovedSelectedKey(record.key);
  };

  const renderTable = (
    data: ReviewData[],
    selectedKey: string | null,
    onRowClick: (record: ReviewData) => void,
    instanceLabel: string
  ) => (
    <TableContainer component={Paper} variant="outlined" data-cb-instance={instanceLabel}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Review ID</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Reason</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.key}
              onClick={() => onRowClick(row)}
              aria-selected={selectedKey === row.key}
              data-row-key={row.key}
              sx={{
                cursor: 'pointer',
                backgroundColor: selectedKey === row.key ? 'action.selected' : undefined,
                '&:hover': {
                  backgroundColor: selectedKey === row.key ? 'action.selected' : 'action.hover',
                },
              }}
            >
              <TableCell>{row.reviewId}</TableCell>
              <TableCell>
                <Rating value={row.rating} readOnly size="small" />
              </TableCell>
              <TableCell>{row.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Card sx={{ width: 550 }}>
      <CardContent>
        {/* Reference card */}
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            backgroundColor: 'grey.100',
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'grey.400',
          }}
          data-reference-id="ref-2star-spam"
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Reference: Match this review
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Rating value={2} readOnly size="small" />
            <Typography variant="body2">Spam</Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
          Pending reviews
        </Typography>
        {renderTable(pendingReviewsData, pendingSelectedKey, handlePendingRowClick, 'Pending reviews')}

        <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 3, mb: 1 }}>
          Approved reviews
        </Typography>
        {renderTable(approvedReviewsData, approvedSelectedKey, handleApprovedRowClick, 'Approved reviews')}
      </CardContent>
    </Card>
  );
}
