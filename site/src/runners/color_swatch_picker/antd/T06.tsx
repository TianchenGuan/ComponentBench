'use client';

/**
 * color_swatch_picker-antd-T06: Set label color in a form section
 *
 * Layout: form_section centered on the page.
 * A form with several fields including a ColorPicker labeled "Label color".
 *
 * Initial state: Label color is #52c41a (Green).
 * Success: Label color equals #f5222d (Red).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Input, Select, Switch, Button, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES, STATUS_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#f5222d';

const presets = [
  {
    label: 'Brand',
    colors: BRAND_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
  {
    label: 'Neutrals',
    colors: NEUTRAL_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
  {
    label: 'Status',
    colors: STATUS_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [labelColor, setLabelColor] = useState<Color | string>('#52c41a');
  const [projectName, setProjectName] = useState('My Project');
  const [category, setCategory] = useState('development');
  const [isPublic, setIsPublic] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentHex = typeof labelColor === 'object' && 'toHexString' in labelColor
    ? labelColor.toHexString()
    : String(labelColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(currentHex, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [currentHex, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <div ref={containerRef}>
      <Card 
        title="Project Details" 
        style={{ width: 450 }}
        data-testid="project-details-form"
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text style={{ display: 'block', marginBottom: 4 }}>Project name</Text>
            <Input 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          
          <div>
            <Text style={{ display: 'block', marginBottom: 4 }}>Category</Text>
            <Select
              value={category}
              onChange={setCategory}
              style={{ width: '100%' }}
              options={[
                { value: 'development', label: 'Development' },
                { value: 'design', label: 'Design' },
                { value: 'marketing', label: 'Marketing' },
              ]}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text>Public project</Text>
            <Switch checked={isPublic} onChange={setIsPublic} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Label color</Text>
            <div data-testid="label-color">
              <ColorPicker
                value={labelColor}
                onChange={setLabelColor}
                showText
                presets={presets}
                panelRender={(panel, { components: { Presets } }) => (
                  <div>
                    <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
                    <Presets />
                  </div>
                )}
                getPopupContainer={() => containerRef.current || document.body}
              />
            </div>
          </div>
          
          <Button onClick={() => {
            setProjectName('My Project');
            setCategory('development');
            setIsPublic(false);
          }}>
            Reset form
          </Button>
        </Space>
        <div data-testid="label-color-value" style={{ display: 'none' }}>
          {normalizeHex(currentHex)}
        </div>
      </Card>
    </div>
  );
}
