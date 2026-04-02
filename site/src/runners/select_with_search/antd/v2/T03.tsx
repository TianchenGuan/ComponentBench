'use client';

/**
 * select_with_search-antd-v2-T03: Drawer language picker with visible-only long list and apply
 *
 * "Report settings" opens a right-side Ant Design Drawer. Inside: one Select labeled "Report language"
 * with showSearch and ~120 alphabetized language options. Dropdown renders inside the drawer parent.
 * Zulu is near the end and not initially visible. Initial: English.
 * Success: Report language = "Zulu", Apply settings clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Select, Typography, Space, Card, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const languages = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani',
  'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Burmese',
  'Catalan', 'Cebuano', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Croatian', 'Czech',
  'Danish', 'Dutch',
  'English', 'Esperanto', 'Estonian',
  'Filipino', 'Finnish', 'French',
  'Galician', 'Georgian', 'German', 'Greek', 'Gujarati',
  'Haitian Creole', 'Hausa', 'Hawaiian', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian',
  'Icelandic', 'Igbo', 'Indonesian', 'Irish', 'Italian',
  'Japanese', 'Javanese',
  'Kannada', 'Kazakh', 'Khmer', 'Kinyarwanda', 'Korean', 'Kurdish', 'Kyrgyz',
  'Lao', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish',
  'Macedonian', 'Malagasy', 'Malay', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian',
  'Nepali', 'Norwegian',
  'Odia', 'Oromo',
  'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi',
  'Quechua',
  'Romanian', 'Russian',
  'Samoan', 'Sanskrit', 'Scottish Gaelic', 'Serbian', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish',
  'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Tibetan', 'Tigrinya', 'Turkish', 'Turkmen',
  'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek',
  'Vietnamese',
  'Welsh',
  'Xhosa',
  'Yiddish', 'Yoruba',
  'Zulu',
];

const languageOptions = languages.map((lang) => ({ value: lang, label: lang }));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [language, setLanguage] = useState<string>('English');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && language === 'Zulu') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, language, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Space>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Report settings
        </Button>
        <Text type="secondary">Configure report output preferences</Text>
      </Space>

      <Card size="small" style={{ marginTop: 16, maxWidth: 400 }}>
        <Text type="secondary">Recent reports: 24 · Scheduled: 3 · Failed: 0</Text>
      </Card>

      <Drawer
        title="Report settings"
        placement="right"
        width={420}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div ref={drawerRef}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Report language</Text>
              <Select
                showSearch
                optionFilterProp="label"
                style={{ width: '100%' }}
                listHeight={200}
                value={language}
                onChange={(val) => { setLanguage(val); setApplied(false); }}
                options={languageOptions}
                getPopupContainer={() => drawerRef.current || document.body}
              />
            </div>

            <Space style={{ marginTop: 8 }}>
              <Tag>Format: PDF</Tag>
              <Tag>Encoding: UTF-8</Tag>
            </Space>

            <Button type="primary" onClick={() => setApplied(true)} style={{ marginTop: 16 }}>
              Apply settings
            </Button>
          </Space>
        </div>
      </Drawer>
    </div>
  );
}
