/**
 * ComponentBench Ontology
 * 14 families, 97 canonical component types
 */

import type { Family, CanonicalComponent, FamilySection } from '../types';

// 14 Families
export const families: Family[] = [
  { id: 'command_navigation', name: 'Command & Navigation', order: 1 },
  { id: 'disclosure_progressive', name: 'Disclosure & Progressive', order: 2 },
  { id: 'text_entry', name: 'Text Entry & Structured Field Input', order: 3 },
  { id: 'discrete_choice', name: 'Discrete Choice', order: 4 },
  { id: 'list_selection', name: 'List-based Selection (Flat)', order: 5 },
  { id: 'combobox_autocomplete', name: 'Combobox & Autocomplete', order: 6 },
  { id: 'hierarchical_navigation', name: 'Hierarchical Selection & Navigation', order: 7 },
  { id: 'continuous_precision', name: 'Continuous & High-Precision Input', order: 8 },
  { id: 'datetime', name: 'Date & Time', order: 9 },
  { id: 'overlays_transient', name: 'Overlays & Transient UI', order: 10 },
  { id: 'structured_data', name: 'Structured Data Display', order: 11 },
  { id: 'files_clipboard', name: 'Files, Clipboard, Downloads', order: 12 },
  { id: 'dragdrop_workspace', name: 'Drag/Drop & Workspace Interactions', order: 13 },
  { id: 'advanced_editors', name: 'Advanced Editors', order: 14 },
];

// 97 Canonical Components (from docs/canonical_components.csv)
export const canonicalComponents: CanonicalComponent[] = [
  // Command & Navigation (10)
  { type: 'button', displayName: 'Button', familyId: 'command_navigation', antd: 'Button', mui: 'Button', mantine: 'Button', notes: 'Primary/secondary/disabled/loading variants.' },
  { type: 'icon_button', displayName: 'Icon Button', familyId: 'command_navigation', antd: 'Button (icon-only) or FloatButton', mui: 'IconButton', mantine: 'ActionIcon', notes: 'Canonical = icon-only clickable button, often circular.' },
  { type: 'link', displayName: 'Link', familyId: 'command_navigation', antd: 'Typography.Link / <a>', mui: 'Link', mantine: 'Anchor', notes: 'Include visited/disabled/underline variants.' },
  { type: 'menu_button', displayName: 'Menu Button', familyId: 'command_navigation', antd: 'Dropdown + Menu + Button', mui: 'Button + Menu', mantine: 'Menu (Menu.Target + Button)', notes: 'Button that opens a menu.' },
  { type: 'split_button', displayName: 'Split Button', familyId: 'command_navigation', antd: 'Dropdown.Button / Button.Group + Dropdown', mui: 'ButtonGroup + Menu (SplitButton pattern)', mantine: 'Group + Button + Menu', notes: 'Primary action + adjacent dropdown.' },
  { type: 'toolbar', displayName: 'Toolbar', familyId: 'command_navigation', antd: 'Flex/Space + Buttons (composite)', mui: 'AppBar + Toolbar', mantine: 'Group / AppShell.Header + Group', notes: 'Horizontal container of controls; often role=toolbar.' },
  { type: 'breadcrumb', displayName: 'Breadcrumb', familyId: 'command_navigation', antd: 'Breadcrumb', mui: 'Breadcrumbs', mantine: 'Breadcrumbs', notes: 'Hierarchical navigation.' },
  { type: 'pagination', displayName: 'Pagination', familyId: 'command_navigation', antd: 'Pagination', mui: 'Pagination', mantine: 'Pagination', notes: 'Page navigation control.' },
  { type: 'stepper', displayName: 'Stepper', familyId: 'command_navigation', antd: 'Steps', mui: 'Stepper', mantine: 'Stepper', notes: 'Progress through ordered steps.' },
  { type: 'tabs', displayName: 'Tabs', familyId: 'command_navigation', antd: 'Tabs', mui: 'Tabs', mantine: 'Tabs', notes: 'Tablist/tabpanel pattern.' },

  // Disclosure & Progressive (5)
  { type: 'accordion', displayName: 'Accordion', familyId: 'disclosure_progressive', antd: 'Collapse (accordion mode)', mui: 'Accordion', mantine: 'Accordion', notes: 'Single/multi expand variants.' },
  { type: 'collapsible_disclosure', displayName: 'Collapsible Disclosure', familyId: 'disclosure_progressive', antd: 'Collapse / Collapse.Panel', mui: 'Collapse', mantine: 'Collapse / Spoiler (alt)', notes: 'Show/hide region; not necessarily accordion.' },
  { type: 'carousel', displayName: 'Carousel', familyId: 'disclosure_progressive', antd: 'Carousel', mui: '(no core) compose with SwipeableViews / external carousel', mantine: '@mantine/carousel: Carousel', notes: 'Swipe/arrow navigation; focusable controls.' },
  { type: 'feed_infinite_scroll', displayName: 'Feed Infinite Scroll', familyId: 'disclosure_progressive', antd: 'List + infinite load pattern (composite)', mui: 'List + onScroll (composite)', mantine: 'ScrollArea + onScroll (composite)', notes: 'Benchmark the scroll-to-load interaction.' },
  { type: 'window_splitter', displayName: 'Window Splitter', familyId: 'disclosure_progressive', antd: 'Splitter', mui: '(no core) external: react-resizable-panels / split.js', mantine: 'External/extension: @gfazioli/mantine-split-pane or react-resizable-panels', notes: 'Resizable panes with draggable handle.' },

  // Text Entry & Structured Field Input (10)
  { type: 'text_input', displayName: 'Text Input', familyId: 'text_entry', antd: 'Input', mui: 'TextField', mantine: 'TextInput', notes: 'Single-line text.' },
  { type: 'textarea', displayName: 'Textarea', familyId: 'text_entry', antd: 'Input.TextArea', mui: 'TextField (multiline)', mantine: 'Textarea', notes: 'Multi-line text.' },
  { type: 'password_input', displayName: 'Password Input', familyId: 'text_entry', antd: 'Input.Password', mui: 'TextField (type=password) / OutlinedInput', mantine: 'PasswordInput', notes: 'Masked entry + reveal toggle variant.' },
  { type: 'search_input', displayName: 'Search Input', familyId: 'text_entry', antd: 'Input.Search / AutoComplete', mui: 'TextField + InputAdornment / Autocomplete', mantine: 'TextInput (+ icon) / Autocomplete', notes: 'Often triggers suggestions/results.' },
  { type: 'number_input_spinbutton', displayName: 'Number Input Spinbutton', familyId: 'text_entry', antd: 'InputNumber', mui: 'Number Field (or TextField type=number)', mantine: 'NumberInput', notes: 'Includes stepper buttons.' },
  { type: 'masked_input', displayName: 'Masked Input', familyId: 'text_entry', antd: 'Input + mask library (react-input-mask)', mui: 'TextField + mask library', mantine: 'TextInput + mask library', notes: 'Not typically first-party; evaluate typing + formatting.' },
  { type: 'pin_input_otp', displayName: 'PIN Input OTP', familyId: 'text_entry', antd: '(compose) multiple Inputs / third-party OTP input', mui: '(compose) multiple TextFields / third-party', mantine: 'PinInput', notes: 'Separated digits; auto-advance; paste handling.' },
  { type: 'tags_input', displayName: 'Tags Input', familyId: 'text_entry', antd: 'Select (mode=tags)', mui: 'Autocomplete (multiple, freeSolo) + Chip', mantine: 'TagsInput / MultiSelect (creatable)', notes: 'Freeform multi-value tokens.' },
  { type: 'mentions_input', displayName: 'Mentions Input', familyId: 'text_entry', antd: 'Mentions', mui: '(compose) TextField + Popper/Menu suggestions', mantine: '(compose) Textarea + Menu/Popover suggestions', notes: 'Trigger \'@\' suggestions and insert mention token.' },
  { type: 'inline_editable_text', displayName: 'Inline Editable Text', familyId: 'text_entry', antd: 'Typography (editable)', mui: '(compose) Typography + TextField', mantine: '(compose) Text + TextInput', notes: 'In-place edit with confirm/cancel.' },

  // Discrete Choice (9)
  { type: 'checkbox', displayName: 'Checkbox', familyId: 'discrete_choice', antd: 'Checkbox', mui: 'Checkbox', mantine: 'Checkbox', notes: 'Binary toggle.' },
  { type: 'checkbox_tristate', displayName: 'Checkbox Tristate', familyId: 'discrete_choice', antd: 'Checkbox (indeterminate)', mui: 'Checkbox (indeterminate)', mantine: 'Checkbox (indeterminate)', notes: 'Checked/unchecked/mixed.' },
  { type: 'checkbox_group', displayName: 'Checkbox Group', familyId: 'discrete_choice', antd: 'Checkbox.Group', mui: 'FormGroup + Checkbox', mantine: 'Checkbox.Group', notes: 'Multiple checkboxes grouped.' },
  { type: 'radio_group', displayName: 'Radio Group', familyId: 'discrete_choice', antd: 'Radio.Group', mui: 'RadioGroup', mantine: 'Radio.Group', notes: 'Single choice from set.' },
  { type: 'switch', displayName: 'Switch', familyId: 'discrete_choice', antd: 'Switch', mui: 'Switch', mantine: 'Switch', notes: 'Binary switch UI.' },
  { type: 'segmented_control', displayName: 'Segmented Control', familyId: 'discrete_choice', antd: 'Segmented', mui: 'ToggleButtonGroup (exclusive)', mantine: 'SegmentedControl', notes: 'Single selection in segmented UI.' },
  { type: 'toggle_button', displayName: 'Toggle Button', familyId: 'discrete_choice', antd: 'Button (toggle state)', mui: 'ToggleButton', mantine: 'ActionIcon/Button (toggle state)', notes: 'Single toggleable button.' },
  { type: 'toggle_button_group_multi', displayName: 'Toggle Button Group Multi', familyId: 'discrete_choice', antd: '(compose) Checkbox.Group styled as buttons', mui: 'ToggleButtonGroup (multiple)', mantine: '(compose) Chips/Checkboxes styled', notes: 'Multi-select button group.' },
  { type: 'rating', displayName: 'Rating', familyId: 'discrete_choice', antd: 'Rate', mui: 'Rating', mantine: 'Rating', notes: 'Star rating; small targets.' },

  // List-based Selection (Flat) (7)
  { type: 'listbox_single', displayName: 'Listbox Single', familyId: 'list_selection', antd: 'Menu (selectable) / List (select state)', mui: 'List + ListItemButton (selected)', mantine: '(compose) List/NavLink with selected state', notes: 'Standalone listbox widget.' },
  { type: 'listbox_multi', displayName: 'Listbox Multi', familyId: 'list_selection', antd: '(compose) Checkbox list / Transfer list left pane', mui: 'List + Checkbox', mantine: 'Checkbox list', notes: 'Multi-select listbox.' },
  { type: 'select_native', displayName: 'Select Native', familyId: 'list_selection', antd: 'Native <select> (no AntD wrapper)', mui: 'Native Select', mantine: 'NativeSelect', notes: 'HTML select; good for agent robustness baseline.' },
  { type: 'select_custom_single', displayName: 'Select Custom Single', familyId: 'list_selection', antd: 'Select', mui: 'Select', mantine: 'Select', notes: 'Custom dropdown select.' },
  { type: 'select_custom_multi', displayName: 'Select Custom Multi', familyId: 'list_selection', antd: 'Select (mode=multiple)', mui: 'Select (multiple) or Autocomplete (multiple)', mantine: 'MultiSelect', notes: 'Multi-select dropdown.' },
  { type: 'select_with_search', displayName: 'Select With Search', familyId: 'list_selection', antd: 'Select (showSearch) / AutoComplete', mui: 'Autocomplete (searchable)', mantine: 'Select (searchable) / Autocomplete', notes: 'Search within options.' },
  { type: 'transfer_list', displayName: 'Transfer List', familyId: 'list_selection', antd: 'Transfer', mui: 'Transfer List', mantine: 'TransferList (if available) or compose (two lists + buttons)', notes: 'Move items between source/target lists; often with search.' },

  // Combobox & Autocomplete (4)
  { type: 'combobox_editable_single', displayName: 'Combobox Editable Single', familyId: 'combobox_autocomplete', antd: 'AutoComplete', mui: 'Autocomplete', mantine: 'Autocomplete / Combobox', notes: 'Editable input + suggestions; single value.' },
  { type: 'combobox_editable_multi', displayName: 'Combobox Editable Multi', familyId: 'combobox_autocomplete', antd: 'Select (mode=tags)', mui: 'Autocomplete (multiple)', mantine: 'TagsInput / MultiSelect + search', notes: 'Editable multi-value combobox.' },
  { type: 'autocomplete_restricted', displayName: 'Autocomplete Restricted', familyId: 'combobox_autocomplete', antd: 'Select / AutoComplete (disable free input)', mui: 'Autocomplete (freeSolo=false)', mantine: 'Select (opinionated, options only)', notes: 'Must choose from given options.' },
  { type: 'autocomplete_freeform', displayName: 'Autocomplete Freeform', familyId: 'combobox_autocomplete', antd: 'AutoComplete / Select (tags)', mui: 'Autocomplete (freeSolo)', mantine: 'Autocomplete / TagsInput', notes: 'Allows new values.' },

  // Hierarchical Selection & Navigation (7)
  { type: 'menu', displayName: 'Menu', familyId: 'hierarchical_navigation', antd: 'Menu', mui: 'Menu', mantine: 'Menu', notes: 'Vertical menu; keyboard nav.' },
  { type: 'menubar', displayName: 'Menubar', familyId: 'hierarchical_navigation', antd: 'Menu (mode=horizontal)', mui: 'AppBar/Toolbar + Menus (composite)', mantine: 'AppShell.Header + Menus (composite)', notes: 'Top-level horizontal menu with submenus.' },
  { type: 'context_menu', displayName: 'Context Menu', familyId: 'hierarchical_navigation', antd: 'Dropdown (trigger=contextMenu) + Menu', mui: 'Menu opened on right-click (composite)', mantine: 'Menu opened via onContextMenu (composite)', notes: 'Right-click menu; focus management.' },
  { type: 'tree_view', displayName: 'Tree View', familyId: 'hierarchical_navigation', antd: 'Tree', mui: 'MUI X Tree View (SimpleTreeView/RichTreeView)', mantine: 'Tree', notes: 'Expand/collapse hierarchical list.' },
  { type: 'tree_select', displayName: 'Tree Select', familyId: 'hierarchical_navigation', antd: 'TreeSelect', mui: '(compose) TextField + Popover + TreeView', mantine: '(compose) TextInput + Popover + Tree', notes: 'Input that opens a tree for selecting nodes.' },
  { type: 'tree_grid', displayName: 'Tree Grid', familyId: 'hierarchical_navigation', antd: 'Table (expandable/tree data)', mui: 'DataGrid with tree data (may require Pro) / compose', mantine: '(compose) Table + Tree grouping', notes: 'Hierarchical rows in a grid; advanced.' },
  { type: 'cascader', displayName: 'Cascader', familyId: 'hierarchical_navigation', antd: 'Cascader', mui: '(no core) external cascader library', mantine: '(no core) external cascader library', notes: 'Multi-level cascading menus.' },

  // Continuous & High-Precision Input (8)
  { type: 'slider_single', displayName: 'Slider Single', familyId: 'continuous_precision', antd: 'Slider', mui: 'Slider', mantine: 'Slider', notes: 'Single-value continuous control.' },
  { type: 'slider_range', displayName: 'Slider Range', familyId: 'continuous_precision', antd: 'Slider (range)', mui: 'Slider (range / multiple thumbs)', mantine: 'RangeSlider', notes: 'Two-thumb range selection.' },
  { type: 'meter', displayName: 'Meter', familyId: 'continuous_precision', antd: 'Progress (as approximation) / native <meter>', mui: 'LinearProgress / native <meter>', mantine: 'Progress / native <meter>', notes: 'Strict meter semantics if using <meter>.' },
  { type: 'progress_bar', displayName: 'Progress Bar', familyId: 'continuous_precision', antd: 'Progress', mui: 'LinearProgress', mantine: 'Progress', notes: 'Display progress (not user input).' },
  { type: 'color_swatch_picker', displayName: 'Color Swatch Picker', familyId: 'continuous_precision', antd: 'ColorPicker presets/swatches', mui: '(no core) compose swatches + click', mantine: 'ColorInput/ColorPicker with swatches + ColorSwatch', notes: 'Discrete swatches; small targets.' },
  { type: 'color_text_input', displayName: 'Color Text Input', familyId: 'continuous_precision', antd: 'ColorPicker (showText/hex input)', mui: 'TextField (hex) + validation', mantine: 'ColorInput', notes: 'Type hex/RGB; verify parsing.' },
  { type: 'color_picker_2d', displayName: 'Color Picker 2D', familyId: 'continuous_precision', antd: 'ColorPicker', mui: '(no core) external color picker', mantine: 'ColorPicker', notes: '2D spectrum + hue slider; high precision.' },
  { type: 'alpha_slider', displayName: 'Alpha Slider', familyId: 'continuous_precision', antd: 'ColorPicker (alpha/opacity)', mui: 'Slider (opacity) + color preview (compose)', mantine: 'ColorPicker (alpha) / Slider + RGBA', notes: 'Opacity control; often hard for agents.' },

  // Date & Time (8)
  { type: 'date_input_text', displayName: 'Date Input Text', familyId: 'datetime', antd: 'DatePicker (allow typing)', mui: 'MUI X Date Field/DatePicker input', mantine: 'DateInput', notes: 'Free-form date parsing; locale issues.' },
  { type: 'date_picker_single', displayName: 'Date Picker Single', familyId: 'datetime', antd: 'DatePicker', mui: 'MUI X DatePicker', mantine: 'DatePickerInput (single) / DatePicker', notes: 'Popup calendar selection.' },
  { type: 'date_picker_range', displayName: 'Date Picker Range', familyId: 'datetime', antd: 'DatePicker.RangePicker', mui: 'MUI X DateRangePicker (may require Pro) or two DatePickers', mantine: 'DatePickerInput (range)', notes: 'Range selection; start/end constraints.' },
  { type: 'time_input_text', displayName: 'Time Input Text', familyId: 'datetime', antd: 'TimePicker (typed input)', mui: 'MUI X TimeField/TimePicker input', mantine: 'TimeInput', notes: 'Locale-dependent formatting.' },
  { type: 'time_picker', displayName: 'Time Picker', familyId: 'datetime', antd: 'TimePicker', mui: 'MUI X TimePicker', mantine: 'TimePicker', notes: 'Dropdown time selection.' },
  { type: 'datetime_picker_single', displayName: 'Datetime Picker Single', familyId: 'datetime', antd: 'DatePicker (showTime)', mui: 'MUI X DateTimePicker', mantine: 'DateTimePicker', notes: 'Combined date+time.' },
  { type: 'datetime_picker_range', displayName: 'Datetime Picker Range', familyId: 'datetime', antd: '(compose) two DatePicker(showTime) / Range + time', mui: '(compose) two DateTimePickers / (if available) DateTimeRangePicker', mantine: '(compose) two DateTimePicker values', notes: 'Less standardized; often composite.' },
  { type: 'calendar_embedded', displayName: 'Calendar Embedded', familyId: 'datetime', antd: 'Calendar', mui: 'DateCalendar (MUI X) / CalendarPicker', mantine: 'Calendar', notes: 'Always-visible calendar widget.' },

  // Overlays & Transient UI (9)
  { type: 'dialog_modal', displayName: 'Dialog Modal', familyId: 'overlays_transient', antd: 'Modal', mui: 'Dialog', mantine: 'Modal', notes: 'Blocking modal dialog.' },
  { type: 'alert_dialog_confirm', displayName: 'Alert Dialog Confirm', familyId: 'overlays_transient', antd: 'Popconfirm / Modal.confirm', mui: 'Dialog (confirm pattern)', mantine: '@mantine/modals openConfirmModal / Modal', notes: 'Confirmation with destructive action.' },
  { type: 'drawer', displayName: 'Drawer', familyId: 'overlays_transient', antd: 'Drawer', mui: 'Drawer', mantine: 'Drawer', notes: 'Side panel overlay.' },
  { type: 'popover', displayName: 'Popover', familyId: 'overlays_transient', antd: 'Popover', mui: 'Popover / Popper', mantine: 'Popover', notes: 'Anchored floating panel; may be interactive.' },
  { type: 'tooltip', displayName: 'Tooltip', familyId: 'overlays_transient', antd: 'Tooltip', mui: 'Tooltip', mantine: 'Tooltip', notes: 'Non-interactive hover/focus hint.' },
  { type: 'hover_card', displayName: 'Hover Card', familyId: 'overlays_transient', antd: 'Popover (trigger=hover)', mui: 'Tooltip/Popover (interactive hover) (compose)', mantine: 'HoverCard', notes: 'Hover-triggered rich content.' },
  { type: 'toast_snackbar', displayName: 'Toast Snackbar', familyId: 'overlays_transient', antd: 'message / notification', mui: 'Snackbar', mantine: '@mantine/notifications', notes: 'Transient notification.' },
  { type: 'notification_center', displayName: 'Notification Center', familyId: 'overlays_transient', antd: '(compose) notification list + Badge', mui: '(compose) Snackbar queue / Alert list', mantine: '(compose) Notifications list', notes: 'Aggregated notification inbox.' },
  { type: 'tour_teaching_tip', displayName: 'Tour Teaching Tip', familyId: 'overlays_transient', antd: 'Tour', mui: '(no core) external tour lib (react-joyride)', mantine: '(no core) external tour lib', notes: 'Step-by-step guided tour.' },

  // Structured Data Display (7)
  { type: 'table_static', displayName: 'Table Static', familyId: 'structured_data', antd: 'Table', mui: 'Table', mantine: 'Table', notes: 'Read-only table.' },
  { type: 'data_table_sortable', displayName: 'Data Table Sortable', familyId: 'structured_data', antd: 'Table (sorter)', mui: 'Table + TableSortLabel (compose) or DataGrid', mantine: 'Table + sort logic (compose)', notes: 'Sorting UI and state.' },
  { type: 'data_table_filterable', displayName: 'Data Table Filterable', familyId: 'structured_data', antd: 'Table (filters)', mui: 'DataGrid (filter) / Table + filter UI (compose)', mantine: 'Table + filter UI (compose)', notes: 'Column filters/search.' },
  { type: 'data_table_paginated', displayName: 'Data Table Paginated', familyId: 'structured_data', antd: 'Table (pagination) / Pagination + Table', mui: 'Table + Pagination / DataGrid pagination', mantine: 'Table + Pagination (compose)', notes: 'Pagination control + table state.' },
  { type: 'data_grid_editable', displayName: 'Data Grid Editable', familyId: 'structured_data', antd: 'Table (editable cells demo)', mui: 'MUI X DataGrid (editing)', mantine: '(no core) external data grid / compose', notes: 'Cell editing, validation.' },
  { type: 'data_grid_row_selection', displayName: 'Data Grid Row Selection', familyId: 'structured_data', antd: 'Table (rowSelection)', mui: 'MUI X DataGrid (row selection)', mantine: 'Table + Checkbox selection (compose)', notes: 'Row selection behavior.' },
  { type: 'virtual_list', displayName: 'Virtual List', familyId: 'structured_data', antd: '(no core) external virtualization (react-window)', mui: '(no core) react-window (docs examples)', mantine: '(no core) @tanstack/react-virtual', notes: 'Large list rendering + scroll; good for grounding.' },

  // Files, Clipboard, Downloads (5)
  { type: 'file_upload_button', displayName: 'File Upload Button', familyId: 'files_clipboard', antd: 'Upload', mui: 'Button + <input type=file> (compose)', mantine: 'FileButton / FileInput', notes: 'Open file picker; single/multiple.' },
  { type: 'file_dropzone', displayName: 'File Dropzone', familyId: 'files_clipboard', antd: 'Upload (drag area) / Dragger', mui: '(no core) react-dropzone', mantine: '@mantine/dropzone: Dropzone', notes: 'Drag-and-drop file selection.' },
  { type: 'file_list_manager', displayName: 'File List Manager', familyId: 'files_clipboard', antd: 'Upload fileList UI / Table/List (compose)', mui: 'List/Table (compose)', mantine: 'List/Table (compose)', notes: 'Remove/reorder/rename uploaded files.' },
  { type: 'download_trigger', displayName: 'Download Trigger', familyId: 'files_clipboard', antd: 'Button + <a download> (compose)', mui: 'Button/Link + download attribute (compose)', mantine: 'Button/Anchor + download (compose)', notes: 'Trigger file download.' },
  { type: 'clipboard_copy', displayName: 'Clipboard Copy', familyId: 'files_clipboard', antd: 'Typography.Text copyable / Button + navigator.clipboard', mui: 'IconButton + navigator.clipboard (compose)', mantine: 'useClipboard hook / (CopyButton)', notes: 'Copy to clipboard + feedback.' },

  // Drag/Drop & Workspace Interactions (4)
  { type: 'drag_drop_sortable_list', displayName: 'Drag Drop Sortable List', familyId: 'dragdrop_workspace', antd: '(no core) external DnD (dnd-kit)', mui: '(no core) external DnD', mantine: '(no core) external DnD', notes: 'Reorder list via drag handle.' },
  { type: 'drag_drop_between_lists', displayName: 'Drag Drop Between Lists', familyId: 'dragdrop_workspace', antd: '(no core) external DnD', mui: '(no core) external DnD', mantine: '(no core) external DnD', notes: 'Move items across lists.' },
  { type: 'kanban_board_drag_drop', displayName: 'Kanban Board Drag Drop', familyId: 'dragdrop_workspace', antd: '(no core) external DnD + columns', mui: '(no core) external DnD + columns', mantine: '(no core) external DnD + columns', notes: 'Card drag across columns.' },
  { type: 'resizable_columns', displayName: 'Resizable Columns', familyId: 'dragdrop_workspace', antd: 'Table + react-resizable (compose)', mui: 'MUI X DataGrid (column resizing) / compose', mantine: '(no core) compose with resizable handles', notes: 'Column resize handles.' },

  // Advanced Editors (4)
  { type: 'rich_text_editor', displayName: 'Rich Text Editor', familyId: 'advanced_editors', antd: '(no core) external editor (Tiptap/Slate)', mui: '(no core) external editor', mantine: '@mantine/tiptap: RichTextEditor', notes: 'WYSIWYG formatting toolbar.' },
  { type: 'code_editor', displayName: 'Code Editor', familyId: 'advanced_editors', antd: '(no core) Monaco/CodeMirror', mui: '(no core) Monaco/CodeMirror', mantine: '(no core) Monaco/CodeMirror', notes: 'Syntax highlighting + editing; heavy widget.' },
  { type: 'markdown_editor', displayName: 'Markdown Editor', familyId: 'advanced_editors', antd: '(no core) external markdown editor', mui: '(no core) external markdown editor', mantine: '(no core) external markdown editor', notes: 'Markdown source + preview; toolbar optional.' },
  { type: 'json_editor', displayName: 'JSON Editor', familyId: 'advanced_editors', antd: '(no core) jsoneditor / react-json-view', mui: '(no core) jsoneditor / react-json-view', mantine: '(no core) react-json-view / mantine extensions', notes: 'Tree + raw JSON editing; validation.' },
];

// Helper: Get family by ID
export function getFamilyById(id: string): Family | undefined {
  return families.find(f => f.id === id);
}

// Helper: Get components grouped by family
export function getFamilySections(): FamilySection[] {
  return families
    .sort((a, b) => a.order - b.order)
    .map(family => ({
      family,
      components: canonicalComponents.filter(c => c.familyId === family.id),
    }));
}

// Helper: Get component by type
export function getComponentByType(type: string): CanonicalComponent | undefined {
  return canonicalComponents.find(c => c.type === type);
}

// Verify count
export const TOTAL_CANONICAL_TYPES = canonicalComponents.length; // Should be 97
export const TOTAL_FAMILIES = families.length; // Should be 14
