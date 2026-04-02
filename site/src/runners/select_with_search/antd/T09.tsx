'use client';

/**
 * select_with_search-antd-T09: Scroll to find Zulu in a long language list
 *
 * Layout: isolated_card centered titled "Reporting".
 * Component: one Ant Design Select labeled "Report language" with showSearch enabled.
 * Options: a long alphabetized list of languages (~120). The dropdown uses a scrollable panel (may be virtualized) with a visible scrollbar.
 * Target option: "Zulu" appears near the very end of the list.
 * Initial state: "English" is selected.
 * Interaction: the dropdown opens as a popover under the Select. Scrolling happens within the dropdown list, not the page.
 *
 * Success: The selected value of the "Report language" Select equals "Zulu".
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Alphabetized list of languages
const languageOptions = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani',
  'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Burmese',
  'Catalan', 'Cebuano', 'Chinese', 'Corsican', 'Croatian', 'Czech',
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
  'Samoan', 'Scottish Gaelic', 'Serbian', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish',
  'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Tigrinya', 'Turkish', 'Turkmen',
  'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek',
  'Vietnamese',
  'Welsh',
  'Xhosa',
  'Yiddish', 'Yoruba',
  'Zulu'
].map(lang => ({ value: lang, label: lang }));

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('English');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Zulu') {
      onSuccess();
    }
  };

  return (
    <Card title="Reporting" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Report language</Text>
      <Select
        data-testid="language-select"
        showSearch
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        options={languageOptions}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        listHeight={250}
      />
    </Card>
  );
}
