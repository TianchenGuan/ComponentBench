'use client';

/**
 * tree_select-mui-T08: Scroll to PagerDuty integration
 *
 * Spacing/scale: compact spacing and small scale.
 * Layout: isolated_card centered titled "Add integration".
 * Target component: composite TreeSelect labeled "Integration"; initial value empty.
 * Popover contents: A scrollable container with a large list of integrations (≈120 leaves).
 * Tree data:
 *   - Integrations → Monitoring (≈40 leaves), CI/CD (≈30 leaves), Chat (≈20 leaves)
 *
 * Success: Integration committed selection equals leaf path [Integrations, Monitoring, PagerDuty] with value 'integration_monitoring_pagerduty'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

// Generate monitoring integrations (PagerDuty near bottom alphabetically)
const monitoringItems = [
  'AppDynamics', 'AWS CloudWatch', 'Azure Monitor', 'Datadog', 'Dynatrace',
  'Elastic APM', 'Grafana', 'Honeycomb', 'InfluxDB', 'Instana',
  'Jaeger', 'Kibana', 'Lightstep', 'Logz.io', 'Loki',
  'Mezmo', 'New Relic', 'Observe', 'OpenTelemetry', 'OpsGenie',
  'PagerDuty', 'Prometheus', 'Rollbar', 'Sentry', 'SignalFx',
  'Splunk', 'Stackdriver', 'Sumo Logic', 'Tempo', 'Thundra',
  'VictorOps', 'Wavefront', 'Zipkin',
].map((name) => ({
  id: `integration_monitoring_${name.toLowerCase().replace(/[^a-z]/g, '')}`,
  label: name,
}));

const cicdItems = [
  'ArgoCD', 'AWS CodePipeline', 'Azure DevOps', 'Bamboo', 'Bitbucket Pipelines',
  'BuildKite', 'CircleCI', 'CodeShip', 'Drone', 'GitHub Actions',
  'GitLab CI', 'GoCD', 'Harness', 'Jenkins', 'JFrog',
  'Octopus', 'Puppet', 'Semaphore', 'Spinnaker', 'TeamCity',
  'Travis CI', 'Waypoint', 'Wercker',
].map((name) => ({
  id: `integration_cicd_${name.toLowerCase().replace(/[^a-z]/g, '')}`,
  label: name,
}));

const chatItems = [
  'Discord', 'Google Chat', 'Mattermost', 'Microsoft Teams', 'Rocket.Chat',
  'Slack', 'Telegram', 'Twist', 'Webex', 'Workplace',
  'Yammer', 'Zulip',
].map((name) => ({
  id: `integration_chat_${name.toLowerCase().replace(/[^a-z]/g, '')}`,
  label: name,
}));

const allLeafIds = new Set([
  ...monitoringItems.map((i) => i.id),
  ...cicdItems.map((i) => i.id),
  ...chatItems.map((i) => i.id),
]);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (_event: React.SyntheticEvent, itemId: string | null) => {
    if (itemId && allLeafIds.has(itemId)) {
      setValue(itemId);
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!successFired.current && value === 'integration_monitoring_pagerduty') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  // Find display label from value
  const getLabel = (id: string | null): string => {
    if (!id) return '';
    const all = [...monitoringItems, ...cicdItems, ...chatItems];
    const found = all.find((i) => i.id === id);
    return found ? found.label : id;
  };

  return (
    <Card sx={{ width: 380 }} data-testid="tree-select-card">
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Add integration</Typography>
        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 13 }}>Integration</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Select an integration"
          value={getLabel(value)}
          onClick={handleClick}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClick}>
                  <ArrowDropDownIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          data-testid="tree-select-integration"
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { sx: { width: 350, maxHeight: 280, overflow: 'auto' } } }}
        >
          <SimpleTreeView
            onSelectedItemsChange={handleSelect}
            sx={{ p: 0.5, fontSize: 13 }}
            data-testid="tree-view"
          >
            <TreeItem itemId="integrations" label="Integrations" sx={{ '& .MuiTreeItem-label': { fontSize: 13 } }}>
              <TreeItem itemId="monitoring" label="Monitoring" sx={{ '& .MuiTreeItem-label': { fontSize: 13 } }}>
                {monitoringItems.map((item) => (
                  <TreeItem key={item.id} itemId={item.id} label={item.label} sx={{ '& .MuiTreeItem-label': { fontSize: 12 } }} />
                ))}
              </TreeItem>
              <TreeItem itemId="cicd" label="CI/CD" sx={{ '& .MuiTreeItem-label': { fontSize: 13 } }}>
                {cicdItems.map((item) => (
                  <TreeItem key={item.id} itemId={item.id} label={item.label} sx={{ '& .MuiTreeItem-label': { fontSize: 12 } }} />
                ))}
              </TreeItem>
              <TreeItem itemId="chat" label="Chat" sx={{ '& .MuiTreeItem-label': { fontSize: 13 } }}>
                {chatItems.map((item) => (
                  <TreeItem key={item.id} itemId={item.id} label={item.label} sx={{ '& .MuiTreeItem-label': { fontSize: 12 } }} />
                ))}
              </TreeItem>
            </TreeItem>
          </SimpleTreeView>
        </Popover>
      </CardContent>
    </Card>
  );
}
