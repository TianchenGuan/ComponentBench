'use client';

/**
 * menu_button-antd-T04: Set Secondary language to Spanish
 * 
 * Layout: form_section centered titled "Localization". Spacing is comfortable.
 * There are two menu buttons (instances=2):
 * 1) "Primary language: English" 
 * 2) "Secondary language: French"
 * 
 * Each has the same menu items: "English", "Spanish", "French".
 * Clutter (low): a non-functional text input labeled "Display name" and a Save button.
 * 
 * Initial state: Primary=English, Secondary=French.
 * Success: The "Secondary language" menu button has selected value "Spanish".
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const languages = ['English', 'Spanish', 'French'];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [primaryLang, setPrimaryLang] = useState('English');
  const [secondaryLang, setSecondaryLang] = useState('French');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (secondaryLang === 'Spanish' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [secondaryLang, successTriggered, onSuccess]);

  const primaryMenuItems = languages.map(lang => ({
    key: lang,
    label: lang,
  }));

  const secondaryMenuItems = languages.map(lang => ({
    key: lang,
    label: lang,
  }));

  return (
    <Card title="Localization" style={{ width: 450 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, color: '#666' }}>
            Primary language
          </label>
          <Dropdown
            menu={{
              items: primaryMenuItems,
              onClick: ({ key }) => setPrimaryLang(key),
              selectable: true,
              selectedKeys: [primaryLang],
            }}
            trigger={['click']}
          >
            <Button data-testid="menu-button-primary-language" style={{ width: '100%', textAlign: 'left' }}>
              Primary language: {primaryLang} <DownOutlined style={{ float: 'right', marginTop: 4 }} />
            </Button>
          </Dropdown>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, color: '#666' }}>
            Secondary language
          </label>
          <Dropdown
            menu={{
              items: secondaryMenuItems,
              onClick: ({ key }) => setSecondaryLang(key),
              selectable: true,
              selectedKeys: [secondaryLang],
            }}
            trigger={['click']}
          >
            <Button data-testid="menu-button-secondary-language" style={{ width: '100%', textAlign: 'left' }}>
              Secondary language: {secondaryLang} <DownOutlined style={{ float: 'right', marginTop: 4 }} />
            </Button>
          </Dropdown>
        </div>

        {/* Clutter: non-functional controls */}
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, color: '#666' }}>
            Display name
          </label>
          <Input placeholder="Enter display name" disabled />
        </div>

        <Button type="primary" disabled style={{ alignSelf: 'flex-start' }}>
          Save
        </Button>
      </div>
    </Card>
  );
}
