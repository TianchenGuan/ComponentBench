'use client';

/**
 * color_swatch_picker-antd-T10: Expand Brand colors preset group
 *
 * Layout: isolated_card centered on the page.
 * A ColorPicker with two collapsible preset groups: Brand colors (collapsed) and Neutrals (expanded).
 *
 * Initial state: Brand colors group is collapsed.
 * Success: Popover is open AND Brand colors group is expanded.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Collapse, theme } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../types';

const { Text } = Typography;
const { Panel } = Collapse;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677ff');
  const [isOpen, setIsOpen] = useState(false);
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (isOpen && brandExpanded) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [isOpen, brandExpanded, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleCollapseChange = (keys: string | string[]) => {
    const expandedKeys = Array.isArray(keys) ? keys : [keys];
    setBrandExpanded(expandedKeys.includes('brand'));
  };

  return (
    <div ref={containerRef}>
      <Card 
        title="Preset Groups" 
        style={{ width: 400 }}
        data-testid="preset-groups-card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Accent color</Text>
          <div data-testid="accent-color">
            <ColorPicker
              value={color}
              onChange={setColor}
              showText
              open={isOpen}
              onOpenChange={setIsOpen}
              panelRender={() => (
                <div style={{ padding: 8, minWidth: 280 }} data-testid="accent-color-popover">
                  <Collapse
                    onChange={handleCollapseChange}
                    defaultActiveKey={['neutrals']}
                    ghost
                    style={{ background: token.colorBgContainer }}
                  >
                    <Panel 
                      header="Brand colors" 
                      key="brand"
                      data-testid="brand-colors-group"
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {BRAND_SWATCHES.map((swatch) => (
                          <div
                            key={swatch.color}
                            onClick={() => setColor(swatch.color)}
                            title={`${swatch.name} (${swatch.color})`}
                            style={{
                              width: 24,
                              height: 24,
                              backgroundColor: swatch.color,
                              borderRadius: 4,
                              cursor: 'pointer',
                              border: '1px solid #d9d9d9',
                            }}
                          />
                        ))}
                      </div>
                    </Panel>
                    <Panel 
                      header="Neutrals" 
                      key="neutrals"
                      data-testid="neutrals-group"
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {NEUTRAL_SWATCHES.map((swatch) => (
                          <div
                            key={swatch.color}
                            onClick={() => setColor(swatch.color)}
                            title={`${swatch.name} (${swatch.color})`}
                            style={{
                              width: 24,
                              height: 24,
                              backgroundColor: swatch.color,
                              borderRadius: 4,
                              cursor: 'pointer',
                              border: '1px solid #d9d9d9',
                            }}
                          />
                        ))}
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              )}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
