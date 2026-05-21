'use client';

/**
 * feed_infinite_scroll-mui-T04: Orders Feed: search and open ORD-0924
 * 
 * Layout: form_section. The page resembles an admin page with a left column of unrelated
 * form controls and a right column containing the "Orders" feed.
 * The Orders feed is a scrollable MUI List with a header search TextField.
 * Submitting a search filters the feed and clicking an order row expands inline details.
 * 
 * Success: active_item_id equals ORD-0924 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  CircularProgress,
  LinearProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  details: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Refund requested',
    'Order shipped',
    'Payment pending',
    'Delivered',
    'Processing',
    'Cancelled',
    'Return initiated',
    'Out for delivery',
    'Awaiting pickup',
    'On hold',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `ORD-${String(900 + i).padStart(4, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
      details: `Order details for ${id}: Customer ID: CUST-${Math.floor(Math.random() * 10000)}. Total: $${(Math.random() * 500 + 50).toFixed(2)}. Items: ${Math.floor(Math.random() * 5) + 1}.`,
    });
  }
  return items;
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 100));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  // Filter items based on search
  const filteredItems = searchQuery
    ? items.filter(item => 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && activeItemId === 'ORD-0924') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeItemId, onSuccess]);

  const handleSearch = () => {
    setLoading(true);
    setSearchQuery(searchInput);
    setActiveItemId(null);
    setTimeout(() => setLoading(false), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleItemClick = (itemId: string) => {
    setActiveItemId(prev => prev === itemId ? null : itemId);
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, width: 900 }}>
      {/* Left column - form fields (clutter) */}
      <Paper elevation={1} sx={{ width: 300, p: 2, flexShrink: 0 }}>
        <Typography variant="h6" gutterBottom>
          Order Filters
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select defaultValue="" label="Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Date range"
          placeholder="Select date range"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Customer ID"
          placeholder="Enter customer ID"
        />
      </Paper>

      {/* Right column - Orders Feed */}
      <Paper 
        elevation={2} 
        sx={{ flex: 1, overflow: 'hidden' }}
        data-active-item-id={activeItemId}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" gutterBottom>
            Orders
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search orders"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            data-testid="orders-search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {loading && <LinearProgress />}
        <Box
          data-testid="feed-Orders"
          sx={{
            height: 350,
            overflow: 'auto',
          }}
        >
          <List disablePadding>
            {filteredItems.map((item) => (
              <Box key={item.id}>
                <ListItemButton
                  data-item-id={item.id}
                  aria-expanded={activeItemId === item.id}
                  onClick={() => handleItemClick(item.id)}
                  selected={activeItemId === item.id}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={
                      <Box>
                        <Typography component="span" fontWeight="bold" fontSize={14}>
                          {item.id}
                        </Typography>
                        <Typography component="span" fontSize={14}>
                          {' '}· {item.title}
                        </Typography>
                      </Box>
                    }
                    secondary={item.timestamp}
                  />
                </ListItemButton>
                <Collapse in={activeItemId === item.id}>
                  <Box 
                    data-expanded-for={item.id}
                    sx={{ 
                      px: 2, 
                      py: 1.5, 
                      bgcolor: 'grey.50',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold" display="block" mb={0.5}>
                      Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.details}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>
  );
}
