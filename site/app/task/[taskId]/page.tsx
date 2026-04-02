'use client';

import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getTaskById } from '@/registry/taskRegistry';
import { isTaskCompleted, resetTaskState } from '@/utils/finishTask';
import { parseViewModeFromUrl } from '@/utils/viewMode';
import { getThemeColors } from '@/runners/ThemeWrapper';
import type { TaskSpec, ViewMode } from '@/types';
import type { ComponentType } from 'react';
import humanReference from '@/generated/human-reference.json';

const LogViewer = dynamic(() => import('@/components/LogViewer'), { ssr: false });
const RecordOverlay = dynamic(() => import('@/components/RecordOverlay'), { ssr: false });

// Dynamic import map for task runners - code-splits by canonical type for better performance.
// Each runner is only loaded when needed, reducing initial bundle size.
const RunnerMap: Record<string, ComponentType<{ task: TaskSpec }>> = {
  // Command & Navigation
  button: dynamic(() => import('@/runners/ButtonTaskRunner'), { ssr: false }),
  icon_button: dynamic(() => import('@/runners/IconButtonTaskRunner'), { ssr: false }),
  link: dynamic(() => import('@/runners/LinkTaskRunner'), { ssr: false }),
  split_button: dynamic(() => import('@/runners/SplitButtonTaskRunner'), { ssr: false }),
  toolbar: dynamic(() => import('@/runners/ToolbarTaskRunner'), { ssr: false }),
  menu_button: dynamic(() => import('@/runners/MenuButtonTaskRunner'), { ssr: false }),
  breadcrumb: dynamic(() => import('@/runners/BreadcrumbTaskRunner'), { ssr: false }),
  pagination: dynamic(() => import('@/runners/PaginationTaskRunner'), { ssr: false }),
  stepper: dynamic(() => import('@/runners/StepperTaskRunner'), { ssr: false }),
  tabs: dynamic(() => import('@/runners/TabsTaskRunner'), { ssr: false }),
  
  // Disclosure & Progressive
  accordion: dynamic(() => import('@/runners/AccordionTaskRunner'), { ssr: false }),
  carousel: dynamic(() => import('@/runners/CarouselTaskRunner'), { ssr: false }),
  collapsible_disclosure: dynamic(() => import('@/runners/CollapsibleDisclosureTaskRunner'), { ssr: false }),
  feed_infinite_scroll: dynamic(() => import('@/runners/FeedInfiniteScrollTaskRunner'), { ssr: false }),
  window_splitter: dynamic(() => import('@/runners/WindowSplitterTaskRunner'), { ssr: false }),
  
  // Text Entry & Structured Field Input
  text_input: dynamic(() => import('@/runners/TextInputTaskRunner'), { ssr: false }),
  textarea: dynamic(() => import('@/runners/TextareaTaskRunner'), { ssr: false }),
  password_input: dynamic(() => import('@/runners/PasswordInputTaskRunner'), { ssr: false }),
  search_input: dynamic(() => import('@/runners/SearchInputTaskRunner'), { ssr: false }),
  number_input_spinbutton: dynamic(() => import('@/runners/NumberInputSpinbuttonTaskRunner'), { ssr: false }),
  mentions_input: dynamic(() => import('@/runners/MentionsInputTaskRunner'), { ssr: false }),
  pin_input_otp: dynamic(() => import('@/runners/PinInputOtpTaskRunner'), { ssr: false }),
  tags_input: dynamic(() => import('@/runners/TagsInputTaskRunner'), { ssr: false }),
  inline_editable_text: dynamic(() => import('@/runners/InlineEditableTextTaskRunner'), { ssr: false }),
  masked_input: dynamic(() => import('@/runners/MaskedInputTaskRunner'), { ssr: false }),
  
  // Discrete Choice
  checkbox: dynamic(() => import('@/runners/CheckboxTaskRunner'), { ssr: false }),
  checkbox_group: dynamic(() => import('@/runners/CheckboxGroupTaskRunner'), { ssr: false }),
  checkbox_tristate: dynamic(() => import('@/runners/CheckboxTristateTaskRunner'), { ssr: false }),
  switch: dynamic(() => import('@/runners/SwitchTaskRunner'), { ssr: false }),
  radio_group: dynamic(() => import('@/runners/RadioGroupTaskRunner'), { ssr: false }),
  segmented_control: dynamic(() => import('@/runners/SegmentedControlTaskRunner'), { ssr: false }),
  toggle_button: dynamic(() => import('@/runners/ToggleButtonTaskRunner'), { ssr: false }),
  toggle_button_group_multi: dynamic(() => import('@/runners/ToggleButtonGroupMultiTaskRunner'), { ssr: false }),
  rating: dynamic(() => import('@/runners/RatingTaskRunner'), { ssr: false }),
  
  // List-based Selection (Flat)
  listbox_single: dynamic(() => import('@/runners/ListboxSingleTaskRunner'), { ssr: false }),
  listbox_multi: dynamic(() => import('@/runners/ListboxMultiTaskRunner'), { ssr: false }),
  select_native: dynamic(() => import('@/runners/SelectNativeTaskRunner'), { ssr: false }),
  select_custom_multi: dynamic(() => import('@/runners/SelectCustomMultiTaskRunner'), { ssr: false }),
  select_custom_single: dynamic(() => import('@/runners/SelectCustomSingleTaskRunner'), { ssr: false }),
  select_with_search: dynamic(() => import('@/runners/SelectWithSearchTaskRunner'), { ssr: false }),
  transfer_list: dynamic(() => import('@/runners/TransferListTaskRunner'), { ssr: false }),
  
  // Combobox & Autocomplete
  combobox_editable_single: dynamic(() => import('@/runners/ComboboxEditableSingleTaskRunner'), { ssr: false }),
  combobox_editable_multi: dynamic(() => import('@/runners/ComboboxEditableMultiTaskRunner'), { ssr: false }),
  autocomplete_freeform: dynamic(() => import('@/runners/AutocompleteFreeformTaskRunner'), { ssr: false }),
  autocomplete_restricted: dynamic(() => import('@/runners/AutocompleteRestrictedTaskRunner'), { ssr: false }),
  
  // Hierarchical Selection & Navigation
  menu: dynamic(() => import('@/runners/MenuTaskRunner'), { ssr: false }),
  menubar: dynamic(() => import('@/runners/MenubarTaskRunner'), { ssr: false }),
  context_menu: dynamic(() => import('@/runners/ContextMenuTaskRunner'), { ssr: false }),
  tree_view: dynamic(() => import('@/runners/TreeViewTaskRunner'), { ssr: false }),
  tree_select: dynamic(() => import('@/runners/TreeSelectTaskRunner'), { ssr: false }),
  tree_grid: dynamic(() => import('@/runners/TreeGridTaskRunner'), { ssr: false }),
  cascader: dynamic(() => import('@/runners/CascaderTaskRunner'), { ssr: false }),
  
  // Continuous & High-Precision Input
  progress_bar: dynamic(() => import('@/runners/ProgressBarTaskRunner'), { ssr: false }),
  meter: dynamic(() => import('@/runners/MeterTaskRunner'), { ssr: false }),
  slider_range: dynamic(() => import('@/runners/SliderRangeTaskRunner'), { ssr: false }),
  slider_single: dynamic(() => import('@/runners/SliderSingleTaskRunner'), { ssr: false }),
  alpha_slider: dynamic(() => import('@/runners/AlphaSliderTaskRunner'), { ssr: false }),
  color_picker_2d: dynamic(() => import('@/runners/ColorPicker2dTaskRunner'), { ssr: false }),
  color_text_input: dynamic(() => import('@/runners/ColorTextInputTaskRunner'), { ssr: false }),
  color_swatch_picker: dynamic(() => import('@/runners/ColorSwatchPickerTaskRunner'), { ssr: false }),
  
  // Date & Time
  date_input_text: dynamic(() => import('@/runners/DateInputTextTaskRunner'), { ssr: false }),
  date_picker_single: dynamic(() => import('@/runners/DatePickerSingleTaskRunner'), { ssr: false }),
  date_picker_range: dynamic(() => import('@/runners/DatePickerRangeTaskRunner'), { ssr: false }),
  time_input_text: dynamic(() => import('@/runners/TimeInputTextTaskRunner'), { ssr: false }),
  time_picker: dynamic(() => import('@/runners/TimePickerTaskRunner'), { ssr: false }),
  datetime_picker_single: dynamic(() => import('@/runners/DatetimePickerSingleTaskRunner'), { ssr: false }),
  datetime_picker_range: dynamic(() => import('@/runners/DatetimePickerRangeTaskRunner'), { ssr: false }),
  calendar_embedded: dynamic(() => import('@/runners/CalendarEmbeddedTaskRunner'), { ssr: false }),
  
  // Overlays & Transient UI
  tooltip: dynamic(() => import('@/runners/TooltipTaskRunner'), { ssr: false }),
  popover: dynamic(() => import('@/runners/PopoverTaskRunner'), { ssr: false }),
  drawer: dynamic(() => import('@/runners/DrawerTaskRunner'), { ssr: false }),
  alert_dialog_confirm: dynamic(() => import('@/runners/AlertDialogConfirmTaskRunner'), { ssr: false }),
  dialog_modal: dynamic(() => import('@/runners/DialogModalTaskRunner'), { ssr: false }),
  hover_card: dynamic(() => import('@/runners/HoverCardTaskRunner'), { ssr: false }),
  toast_snackbar: dynamic(() => import('@/runners/ToastSnackbarTaskRunner'), { ssr: false }),
  notification_center: dynamic(() => import('@/runners/NotificationCenterTaskRunner'), { ssr: false }),
  tour_teaching_tip: dynamic(() => import('@/runners/TourTeachingTipTaskRunner'), { ssr: false }),
  
  // Structured Data Display
  table_static: dynamic(() => import('@/runners/TableStaticTaskRunner'), { ssr: false }),
  data_table_sortable: dynamic(() => import('@/runners/DataTableSortableTaskRunner'), { ssr: false }),
  data_table_filterable: dynamic(() => import('@/runners/DataTableFilterableTaskRunner'), { ssr: false }),
  data_grid_row_selection: dynamic(() => import('@/runners/DataGridRowSelectionTaskRunner'), { ssr: false }),
  data_grid_editable: dynamic(() => import('@/runners/DataGridEditableTaskRunner'), { ssr: false }),
  virtual_list: dynamic(() => import('@/runners/VirtualListTaskRunner'), { ssr: false }),
  data_table_paginated: dynamic(() => import('@/runners/DataTablePaginatedTaskRunner'), { ssr: false }),
  
  // Files, Clipboard, Downloads
  file_upload_button: dynamic(() => import('@/runners/FileUploadButtonTaskRunner'), { ssr: false }),
  file_dropzone: dynamic(() => import('@/runners/FileDropzoneTaskRunner'), { ssr: false }),
  file_list_manager: dynamic(() => import('@/runners/FileListManagerTaskRunner'), { ssr: false }),
  download_trigger: dynamic(() => import('@/runners/DownloadTriggerTaskRunner'), { ssr: false }),
  clipboard_copy: dynamic(() => import('@/runners/ClipboardCopyTaskRunner'), { ssr: false }),
  
  // Drag/Drop & Workspace Interactions
  drag_drop_sortable_list: dynamic(() => import('@/runners/DragDropSortableListTaskRunner'), { ssr: false }),
  drag_drop_between_lists: dynamic(() => import('@/runners/DragDropBetweenListsTaskRunner'), { ssr: false }),
  kanban_board_drag_drop: dynamic(() => import('@/runners/KanbanBoardDragDropTaskRunner'), { ssr: false }),
  resizable_columns: dynamic(() => import('@/runners/ResizableColumnsTaskRunner'), { ssr: false }),
  
  // Advanced Editors
  rich_text_editor: dynamic(() => import('@/runners/RichTextEditorTaskRunner'), { ssr: false }),
  code_editor: dynamic(() => import('@/runners/CodeEditorTaskRunner'), { ssr: false }),
  markdown_editor: dynamic(() => import('@/runners/MarkdownEditorTaskRunner'), { ssr: false }),
  json_editor: dynamic(() => import('@/runners/JsonEditorTaskRunner'), { ssr: false }),
};

// Wrapper component to handle Suspense for useSearchParams
export default function TaskPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        Loading...
      </div>
    }>
      <TaskPageContent />
    </Suspense>
  );
}

function TaskPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const taskId = params.taskId as string;
  const viewMode = parseViewModeFromUrl(searchParams);
  const isBenchmarkMode = viewMode === 'benchmark';
  const isLogMode = searchParams.get('mode') === 'log';
  const logRunId = searchParams.get('run') || '';
  const logMode = searchParams.get('logMode') || '';
  const isRecordMode = searchParams.get('record') === '1';
  const recordRunId = searchParams.get('runId') || '';
  const recordPass = Number(searchParams.get('pass') || '1');
  const recordIdx = Number(searchParams.get('idx') || '0');
  const recordTotal = Number(searchParams.get('total') || '0');
  const benchVersion = (searchParams.get('bench') === 'v2' ? 'v2' : 'v1') as import('@/types').BenchmarkVersion;
  
  const [task, setTask] = useState<TaskSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const handleRecordFinalized = useCallback(async (status: 'SUCCESS' | 'SKIPPED' | 'ABORTED') => {
    if (status === 'ABORTED') {
      router.push('/record');
      return;
    }
    const addBenchParam = (params: URLSearchParams, tid: string) => {
      if (tid.includes('-v2-')) params.set('bench', 'v2');
    };
    if (recordPass === 1 && status === 'SUCCESS') {
      const params = new URLSearchParams({
        mode: 'presentation', record: '1', runId: recordRunId,
        pass: '2', idx: String(recordIdx), total: String(recordTotal),
      });
      addBenchParam(params, taskId);
      router.push(`/task/${taskId}?${params.toString()}`);
      return;
    }
    try {
      const res = await fetch(`/api/record/run-status?run_id=${encodeURIComponent(recordRunId)}`);
      if (!res.ok) { router.push('/record'); return; }
      const data = await res.json();
      if (data.is_complete || !data.next_task_id) {
        router.push('/record');
        return;
      }
      const params = new URLSearchParams({
        mode: 'presentation', record: '1', runId: recordRunId,
        pass: '1', idx: String(data.next_index), total: String(recordTotal),
      });
      addBenchParam(params, data.next_task_id);
      router.push(`/task/${data.next_task_id}?${params.toString()}`);
    } catch {
      router.push('/record');
    }
  }, [recordRunId, recordPass, recordIdx, recordTotal, router, taskId]);

  // Load task (also resets when pass changes during recording)
  useEffect(() => {
    async function loadTask() {
      setLoading(true);
      resetTaskState();
      setCompleted(false);
      
      try {
        const loadedTask = await getTaskById(taskId, benchVersion);
        if (!loadedTask) {
          setError(`Task not found: ${taskId}`);
        } else {
          setTask(loadedTask);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
      
      setLoading(false);
    }
    
    loadTask();
  }, [taskId, recordPass, benchVersion]);

  // Listen for task completion
  useEffect(() => {
    const handleSuccess = () => {
      setCompleted(true);
    };

    window.addEventListener('componentbench:task-success', handleSuccess);
    
    // Also poll for completion status
    const interval = setInterval(() => {
      if (isTaskCompleted()) {
        setCompleted(true);
      }
    }, 100);

    return () => {
      window.removeEventListener('componentbench:task-success', handleSuccess);
      clearInterval(interval);
    };
  }, []);

  // Get theme colors from task's scene_context (must be before early returns due to hooks rules)
  const themeColors = useMemo(
    () => getThemeColors(task?.scene_context?.theme ?? 'light'),
    [task?.scene_context?.theme]
  );

  // v0.3: Strip test-only DOM attributes in benchmark mode to prevent
  // agent leakage via data-testid, data-cy, data-qa, etc.
  // NOTE: This hook MUST be before any early returns (React hooks rules).
  useEffect(() => {
    if (!isBenchmarkMode) return;
    
    const LEAK_ATTRS = ['data-testid', 'data-test-id', 'data-cy', 'data-qa'];
    const LEAK_PREFIX = 'data-test';
    
    function stripLeakAttrs(el: Element) {
      const attrsToRemove: string[] = [];
      for (const attr of Array.from(el.attributes)) {
        if (LEAK_ATTRS.includes(attr.name) || attr.name.startsWith(LEAK_PREFIX)) {
          attrsToRemove.push(attr.name);
        }
      }
      for (const name of attrsToRemove) {
        el.removeAttribute(name);
      }
    }
    
    // Strip existing elements
    document.querySelectorAll('*').forEach(stripLeakAttrs);
    
    // Watch for newly inserted elements via MutationObserver
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof Element) {
              stripLeakAttrs(node);
              node.querySelectorAll('*').forEach(stripLeakAttrs);
            }
          }
        } else if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          stripLeakAttrs(mutation.target);
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: LEAK_ATTRS,
    });
    
    return () => observer.disconnect();
  }, [isBenchmarkMode]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        Loading task...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
        <div style={{ color: 'red', fontSize: 18 }}>Error: {error || 'Task not found'}</div>
        {!isBenchmarkMode && (
          <Link href={benchVersion === 'v2' ? '/?bench=v2' : '/'} style={{ color: '#1677ff', textDecoration: 'underline' }}>
            Back to Dashboard
          </Link>
        )}
      </div>
    );
  }

  // Benchmark mode: Clean UI with only the component
  if (isBenchmarkMode) {
    return (
      <div
        style={{ 
          minHeight: '100vh', 
          background: themeColors.bgColor,
          color: themeColors.textColor,
        }}
        data-canonical-type={task.canonical_type}
        data-library={task.implementation_source}
        data-task-id={task.id}
        data-view-mode="benchmark"
      >
        {/* Success Banner - Always visible for programmatic detection */}
        {completed && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              background: '#52c41a',
              color: '#fff',
              padding: '12px 24px',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 16,
              zIndex: 9999,
            }}
            id="cb-success-banner"
          >
            ✅ Task completed
          </div>
        )}

        {/* Task Runner only - no header, goal, or details */}
        <main style={{ padding: 24, marginTop: completed ? 48 : 0 }}>
          <TaskRunner task={task} />
        </main>
      </div>
    );
  }

  // Presentation mode: Full UI with navigation, goal, and details
  return (
    <div
      style={{ 
        minHeight: '100vh', 
        background: themeColors.bgColor,
        color: themeColors.textColor,
      }}
      data-canonical-type={task.canonical_type}
      data-library={task.implementation_source}
      data-task-id={task.id}
      data-view-mode="presentation"
    >
      {/* Success Banner */}
      {completed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: '#52c41a',
            color: '#fff',
            padding: '12px 24px',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 16,
            zIndex: 9999,
          }}
          id="cb-success-banner"
        >
          ✅ Task completed
        </div>
      )}

      {/* Header */}
      <header
        style={{
          background: themeColors.headerBg,
          borderBottom: `1px solid ${themeColors.headerBorder}`,
          padding: '16px 24px',
          marginTop: completed ? 48 : 0,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <Link href={benchVersion === 'v2' ? '/?bench=v2' : '/'} style={{ color: themeColors.isDark ? '#aaa' : '#666', textDecoration: 'none', fontSize: 14 }}>
              ← Dashboard
            </Link>
            <span style={{ color: themeColors.headerBorder }}>|</span>
            <span style={{ fontSize: 12, color: themeColors.isDark ? '#888' : '#999' }}>
              {task.canonical_type} / {task.implementation_source}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: themeColors.textColor }}>{task.name}</h1>
          <p style={{ margin: '8px 0 0', color: themeColors.isDark ? '#ccc' : '#333', fontSize: 14 }}>
            Task ID: <code style={{ background: themeColors.isDark ? '#333' : '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>{task.id}</code>
          </p>
        </div>
      </header>

      {/* Goal */}
      <div style={{ background: themeColors.headerBg, borderBottom: `1px solid ${themeColors.headerBorder}`, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: themeColors.isDark ? '#888' : '#999', marginBottom: 4, textTransform: 'uppercase', fontWeight: 500 }}>
            BrowserGym Goal
          </div>
          <div style={{ fontSize: 16, color: themeColors.isDark ? '#ddd' : '#333', lineHeight: 1.5 }}>
            {task.browsergym_goal}
          </div>
        </div>
      </div>

      {/* Human Reference */}
      {(() => {
        const ref = (humanReference as Record<string, { steps: number; duration_ms: number }>)[task.id];
        if (!ref) return null;
        const secs = (ref.duration_ms / 1000).toFixed(1);
        return (
          <div style={{ background: themeColors.headerBg, borderBottom: `1px solid ${themeColors.headerBorder}`, padding: '12px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 12, color: themeColors.isDark ? '#888' : '#999', textTransform: 'uppercase', fontWeight: 500 }}>
                Human Reference
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
                <span style={{ color: themeColors.isDark ? '#ddd' : '#333' }}>
                  <strong>{ref.steps}</strong> {ref.steps === 1 ? 'step' : 'steps'}
                </span>
                <span style={{ color: themeColors.isDark ? '#aaa' : '#666' }}>
                  {secs}s
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Details (collapsible) */}
      <div style={{ background: themeColors.headerBg, borderBottom: `1px solid ${themeColors.headerBorder}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 14,
              color: themeColors.isDark ? '#aaa' : '#666',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ transform: showDetails ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
              ▶
            </span>
            Details
          </button>
          
          {showDetails && (
            <div style={{ padding: '0 24px 16px', borderTop: `1px solid ${themeColors.headerBorder}` }}>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: themeColors.isDark ? '#888' : '#999', marginBottom: 4, fontWeight: 500 }}>UI Copy</div>
                <div style={{ fontSize: 14, color: themeColors.isDark ? '#ddd' : '#333' }}>{task.ui_copy}</div>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: themeColors.isDark ? '#888' : '#999', marginBottom: 4, fontWeight: 500 }}>Setup Description</div>
                <div style={{ fontSize: 14, color: themeColors.isDark ? '#ddd' : '#333', whiteSpace: 'pre-wrap' }}>{task.setup_description}</div>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: themeColors.isDark ? '#888' : '#999', marginBottom: 4, fontWeight: 500 }}>Scene Context</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(task.scene_context).map(([key, value]) => (
                    <span
                      key={key}
                      style={{
                        fontSize: 11,
                        background: themeColors.isDark ? '#333' : '#f0f0f0',
                        color: themeColors.isDark ? '#ddd' : '#333',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: themeColors.isDark ? '#888' : '#999', marginBottom: 4, fontWeight: 500 }}>Difficulty</div>
                <span
                  style={{
                    fontSize: 11,
                    background: task.difficulty.difficulty_bucket === 'easy' ? '#f6ffed' : 
                               task.difficulty.difficulty_bucket === 'medium' ? '#fffbe6' : '#fff2e8',
                    color: task.difficulty.difficulty_bucket === 'easy' ? '#52c41a' :
                           task.difficulty.difficulty_bucket === 'medium' ? '#faad14' : '#ff4d4f',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {task.difficulty.difficulty_bucket} ({task.difficulty.tier})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Runner */}
      <main style={{ padding: 24 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <TaskRunner key={`${taskId}-${recordPass}`} task={task} />

          {/* Log Viewer (shown when mode=log) */}
          {isLogMode && logRunId && logMode && (
            <LogViewer
              episodeUrl={`/api/logs/runs/${logRunId}/episodes/${taskId}?mode=${logMode}`}
              videoBaseUrl={`/api/logs/blob?run=${logRunId}&mode=${logMode}&task=${taskId}`}
            />
          )}
        </div>
      </main>

      {/* Recording overlay (shown when record=1) */}
      {isRecordMode && recordRunId && (
        <RecordOverlay
          runId={recordRunId}
          taskId={taskId}
          pass={recordPass}
          currentIndex={recordIdx}
          totalTasks={recordTotal}
          onFinalized={handleRecordFinalized}
        />
      )}
    </div>
  );
}

// Task runner component that selects the appropriate runner using dynamic imports.
// This provides code-splitting by canonical type - only the needed runner is loaded.
function TaskRunner({ task }: { task: TaskSpec }) {
  const Runner = RunnerMap[task.canonical_type];
  
  if (!Runner) {
    return (
      <div
        style={{
          padding: 48,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Task UI not implemented yet
        </div>
        <div style={{ color: '#999' }}>
          Canonical type: <code>{task.canonical_type}</code>
        </div>
        <div style={{ color: '#999', marginTop: 8 }}>
          Task ID: <code>{task.id}</code>
        </div>
      </div>
    );
  }
  
  return <Runner task={task} />;
}
