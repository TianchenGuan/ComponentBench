/**
 * Component Registry
 * 
 * Links canonical types to recommended task templates and tracks implementation status.
 */

import type { Library } from '../types';

// Template IDs for recommended tasks
export type TemplateId =
  | 'activate'
  | 'open_overlay'
  | 'confirm_cancel'
  | 'toggle_state'
  | 'clear_reset'
  | 'scroll_find'
  | 'match_reference'
  | 'table_operation'
  | 'select_one'
  | 'select_many'
  | 'enter_text'
  | 'enter_formatted'
  | 'set_scalar'
  | 'set_range'
  | 'hierarchical_path_select'
  | 'file_upload'
  | 'drag_operation'
  | 'editor_operation'
  | 'navigate_to'
  | 'disclose'
  | 'open_and_select'
  | 'search_and_select'
  | 'file_manage'
  | 'transfer_move';

// Recommended templates by canonical type
export const recommendedTemplatesByType: Record<string, TemplateId[]> = {
  // Command & Navigation
  button: ['activate', 'open_overlay', 'confirm_cancel', 'toggle_state'],
  icon_button: ['activate', 'toggle_state', 'open_overlay'],
  link: ['activate', 'navigate_to'],
  menu_button: ['open_overlay', 'select_one'],
  split_button: ['activate', 'open_overlay', 'select_one'],
  toolbar: ['activate', 'toggle_state'],
  breadcrumb: ['navigate_to', 'activate'],
  pagination: ['navigate_to', 'set_scalar'],
  stepper: ['navigate_to', 'activate'],
  tabs: ['navigate_to', 'activate'],

  // Disclosure & Progressive
  accordion: ['disclose', 'toggle_state'],
  collapsible_disclosure: ['disclose', 'toggle_state'],
  carousel: ['navigate_to', 'scroll_find'],
  feed_infinite_scroll: ['scroll_find', 'activate'],
  window_splitter: ['drag_operation', 'set_scalar'],

  // Text Entry
  text_input: ['enter_text', 'clear_reset'],
  textarea: ['enter_text', 'clear_reset'],
  password_input: ['enter_text', 'toggle_state'],
  search_input: ['enter_text', 'search_and_select'],
  number_input_spinbutton: ['set_scalar', 'enter_text'],
  masked_input: ['enter_formatted', 'enter_text'],
  pin_input_otp: ['enter_text', 'enter_formatted'],
  tags_input: ['enter_text', 'select_many'],
  mentions_input: ['enter_text', 'search_and_select'],
  inline_editable_text: ['enter_text', 'confirm_cancel'],

  // Discrete Choice
  checkbox: ['toggle_state', 'activate'],
  checkbox_tristate: ['toggle_state', 'activate'],
  checkbox_group: ['select_many', 'toggle_state'],
  radio_group: ['select_one', 'toggle_state'],
  switch: ['toggle_state', 'activate'],
  segmented_control: ['select_one', 'toggle_state'],
  toggle_button: ['toggle_state', 'activate'],
  toggle_button_group_multi: ['select_many', 'toggle_state'],
  rating: ['set_scalar', 'select_one'],

  // List Selection
  listbox_single: ['select_one', 'navigate_to'],
  listbox_multi: ['select_many', 'toggle_state'],
  select_native: ['select_one', 'open_and_select'],
  select_custom_single: ['open_and_select', 'select_one'],
  select_custom_multi: ['open_and_select', 'select_many'],
  select_with_search: ['search_and_select', 'select_one'],
  transfer_list: ['transfer_move', 'select_many'],

  // Combobox & Autocomplete
  combobox_editable_single: ['search_and_select', 'enter_text'],
  combobox_editable_multi: ['search_and_select', 'select_many'],
  autocomplete_restricted: ['search_and_select', 'select_one'],
  autocomplete_freeform: ['search_and_select', 'enter_text'],

  // Hierarchical Navigation
  menu: ['select_one', 'navigate_to'],
  menubar: ['navigate_to', 'open_overlay'],
  context_menu: ['open_overlay', 'select_one'],
  tree_view: ['hierarchical_path_select', 'toggle_state'],
  tree_select: ['hierarchical_path_select', 'open_and_select'],
  tree_grid: ['hierarchical_path_select', 'table_operation'],
  cascader: ['hierarchical_path_select', 'open_and_select'],

  // Continuous & Precision
  slider_single: ['set_scalar', 'match_reference'],
  slider_range: ['set_range', 'match_reference'],
  meter: ['match_reference'],
  progress_bar: ['match_reference'],
  color_swatch_picker: ['select_one', 'match_reference'],
  color_text_input: ['enter_formatted', 'match_reference'],
  color_picker_2d: ['set_range', 'match_reference'],
  alpha_slider: ['set_scalar', 'match_reference'],

  // Date & Time
  date_input_text: ['enter_formatted', 'clear_reset'],
  date_picker_single: ['open_and_select', 'enter_formatted'],
  date_picker_range: ['set_range', 'open_and_select'],
  time_input_text: ['enter_formatted', 'clear_reset'],
  time_picker: ['open_and_select', 'enter_formatted'],
  datetime_picker_single: ['open_and_select', 'enter_formatted'],
  datetime_picker_range: ['set_range', 'open_and_select'],
  calendar_embedded: ['select_one', 'navigate_to'],

  // Overlays & Transient
  dialog_modal: ['open_overlay', 'confirm_cancel'],
  alert_dialog_confirm: ['confirm_cancel', 'activate'],
  drawer: ['open_overlay', 'toggle_state'],
  popover: ['open_overlay', 'toggle_state'],
  tooltip: ['open_overlay'],
  hover_card: ['open_overlay'],
  toast_snackbar: ['activate', 'toggle_state'],
  notification_center: ['activate', 'navigate_to'],
  tour_teaching_tip: ['navigate_to', 'activate'],

  // Structured Data
  table_static: ['scroll_find', 'navigate_to'],
  data_table_sortable: ['table_operation', 'navigate_to'],
  data_table_filterable: ['table_operation', 'search_and_select'],
  data_table_paginated: ['table_operation', 'navigate_to'],
  data_grid_editable: ['table_operation', 'enter_text'],
  data_grid_row_selection: ['table_operation', 'select_many'],
  virtual_list: ['scroll_find', 'select_one'],

  // Files & Clipboard
  file_upload_button: ['file_upload', 'activate'],
  file_dropzone: ['file_upload', 'drag_operation'],
  file_list_manager: ['file_manage', 'activate'],
  download_trigger: ['activate'],
  clipboard_copy: ['activate'],

  // Drag/Drop & Workspace
  drag_drop_sortable_list: ['drag_operation', 'match_reference'],
  drag_drop_between_lists: ['drag_operation', 'transfer_move'],
  kanban_board_drag_drop: ['drag_operation', 'transfer_move'],
  resizable_columns: ['drag_operation', 'set_scalar'],

  // Advanced Editors
  rich_text_editor: ['editor_operation', 'enter_text'],
  code_editor: ['editor_operation', 'enter_text'],
  markdown_editor: ['editor_operation', 'enter_text'],
  json_editor: ['editor_operation', 'enter_formatted'],
};

// Components that are implemented for v0
// Add new component types here as they are implemented
const IMPLEMENTED_COMPONENTS: Set<string> = new Set(['button', 'icon_button', 'link', 'menu_button', 'toolbar', 'split_button', 'pagination', 'breadcrumb', 'stepper', 'tabs', 'accordion', 'carousel', 'collapsible_disclosure', 'feed_infinite_scroll', 'window_splitter', 'text_input', 'textarea', 'password_input', 'search_input', 'number_input_spinbutton', 'mentions_input', 'pin_input_otp', 'tags_input', 'inline_editable_text', 'masked_input', 'checkbox', 'checkbox_group', 'checkbox_tristate', 'switch', 'radio_group', 'segmented_control', 'toggle_button', 'toggle_button_group_multi', 'rating', 'listbox_single', 'listbox_multi', 'select_native', 'select_custom_multi', 'select_custom_single', 'select_with_search', 'transfer_list', 'combobox_editable_single', 'combobox_editable_multi', 'autocomplete_freeform', 'autocomplete_restricted', 'menu', 'menubar', 'context_menu', 'tree_view', 'tree_select', 'tree_grid', 'cascader', 'progress_bar', 'meter', 'slider_range', 'slider_single', 'alpha_slider', 'color_picker_2d', 'color_text_input', 'color_swatch_picker', 'date_input_text', 'date_picker_single', 'date_picker_range', 'time_input_text', 'time_picker', 'datetime_picker_single', 'datetime_picker_range', 'calendar_embedded', 'tooltip', 'popover', 'drawer', 'alert_dialog_confirm', 'dialog_modal', 'hover_card', 'toast_snackbar', 'notification_center', 'tour_teaching_tip', 'table_static', 'data_table_sortable', 'data_table_filterable', 'data_table_paginated', 'data_grid_row_selection', 'data_grid_editable', 'virtual_list', 'file_upload_button', 'file_dropzone', 'file_list_manager', 'download_trigger', 'clipboard_copy', 'drag_drop_sortable_list', 'drag_drop_between_lists', 'kanban_board_drag_drop', 'resizable_columns', 'rich_text_editor', 'code_editor', 'markdown_editor', 'json_editor']);

/**
 * Check if a component is implemented for a library
 * For v0, only button is implemented for all libraries
 */
export function isImplemented(canonicalType: string, library: Library): boolean {
  // For v0, only check if the component is in the implemented set
  // In the future, this could check per-library implementation
  void library; // Unused for now
  return IMPLEMENTED_COMPONENTS.has(canonicalType);
}

/**
 * Get count of implemented components for a library
 */
export function getImplementedCount(library: Library): number {
  void library; // Unused for now, same count for all libraries
  return IMPLEMENTED_COMPONENTS.size;
}

/**
 * Get recommended templates for a canonical type
 */
export function getRecommendedTemplates(canonicalType: string): TemplateId[] {
  return recommendedTemplatesByType[canonicalType] || [];
}

/**
 * Mark a component as implemented (for runtime updates)
 */
export function markAsImplemented(canonicalType: string): void {
  IMPLEMENTED_COMPONENTS.add(canonicalType);
}

/**
 * Get all implemented component types
 */
export function getImplementedTypes(): string[] {
  return Array.from(IMPLEMENTED_COMPONENTS);
}
