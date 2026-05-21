/**
 * v2 Generation Units
 *
 * The 19 core units that organize ComponentBench v2 tasks.
 * These replace the v1 14-family × 97-component ontology.
 */

export interface V2Unit {
  id: string;
  title: string;
  members: string[];
}

export const V2_UNITS: V2Unit[] = [
  { id: '01_markdown_code_json_editors',         title: 'Markdown, Code & JSON Editors',           members: ['markdown_editor', 'code_editor', 'json_editor'] },
  { id: '02_rich_text_editor',                   title: 'Rich Text Editor',                        members: ['rich_text_editor'] },
  { id: '03_inline_editable_text_masked_input',  title: 'Inline-Editable Text & Masked Input',     members: ['inline_editable_text', 'masked_input'] },
  { id: '04_autocomplete_search_multi_combobox', title: 'Autocomplete, Search & Multi-Combobox',   members: ['autocomplete_freeform', 'autocomplete_restricted', 'select_with_search', 'combobox_editable_multi'] },
  { id: '05_mentions_tags',                      title: 'Mentions & Tags Input',                   members: ['mentions_input', 'tags_input'] },
  { id: '06_single_select_family',               title: 'Single-Select Family',                    members: ['select_custom_single', 'select_native', 'listbox_single'] },
  { id: '07_multi_select_family',                title: 'Multi-Select Family',                     members: ['select_custom_multi', 'listbox_multi', 'transfer_list'] },
  { id: '08_tree_select_cascader',               title: 'Tree Select & Cascader',                  members: ['tree_select', 'cascader'] },
  { id: '09_tree_view_tree_grid',                title: 'Tree View & Tree Grid',                   members: ['tree_view', 'tree_grid'] },
  { id: '10_data_table_browse_family',           title: 'Data Table Browse Family',                members: ['data_table_filterable', 'data_table_sortable', 'data_table_paginated'] },
  { id: '11_data_grid_editable',                 title: 'Data Grid (Editable)',                    members: ['data_grid_editable'] },
  { id: '12_resizable_layout_family',            title: 'Resizable Layout Family',                 members: ['resizable_columns', 'window_splitter'] },
  { id: '13_dragdrop_workspace_family',          title: 'Drag-and-Drop Workspace Family',          members: ['drag_drop_sortable_list', 'drag_drop_between_lists', 'kanban_board_drag_drop'] },
  { id: '14_slider_family',                      title: 'Slider Family',                           members: ['slider_single', 'slider_range'] },
  { id: '15_color_picker_family',                title: 'Color Picker Family',                     members: ['color_picker_2d', 'color_swatch_picker', 'alpha_slider'] },
  { id: '16_datetime_family',                    title: 'Date/Time Family',                        members: ['date_picker_single', 'date_picker_range', 'datetime_picker_range', 'time_picker', 'calendar_embedded'] },
  { id: '17_context_menu',                       title: 'Context Menu',                            members: ['context_menu'] },
  { id: '18_dialog_modal',                       title: 'Dialog & Modal',                          members: ['dialog_modal'] },
  { id: '19_virtual_list_feed',                  title: 'Virtual List & Feed',                     members: ['virtual_list', 'feed_infinite_scroll'] },
];

export const TOTAL_V2_UNITS = V2_UNITS.length;

export function getV2UnitByComponent(canonicalType: string): V2Unit | undefined {
  return V2_UNITS.find(u => u.members.includes(canonicalType));
}
