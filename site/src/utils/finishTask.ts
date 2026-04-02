/**
 * Task Completion Signaling
 * 
 * Provides programmatic signals for task completion that can be detected
 * by BrowserGym and other automation frameworks.
 */

// Global state for task completion
let taskCompleted = false;

/**
 * Signal that a task has been completed successfully
 * 
 * This function:
 * 1. Sets document.documentElement.dataset.taskDone = "true"
 * 2. Sets window.__COMPONENT_BENCH_TASK_DONE__ = true
 * 3. Dispatches a CustomEvent "componentbench:task-success"
 * 4. Returns true to indicate success
 */
export function finishTask(taskId: string): boolean {
  if (taskCompleted) {
    console.warn(`Task ${taskId} already completed`);
    return false;
  }

  taskCompleted = true;

  // 1. Set data attribute on document element
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.taskDone = 'true';
  }

  // 2. Set global window property
  if (typeof window !== 'undefined') {
    (window as Window & { __COMPONENT_BENCH_TASK_DONE__?: boolean }).__COMPONENT_BENCH_TASK_DONE__ = true;
  }

  // 3. Dispatch custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('componentbench:task-success', {
        detail: { taskId, timestamp: Date.now() },
      })
    );
  }

  console.log(`Task completed: ${taskId}`);
  return true;
}

/**
 * Reset task state (useful for testing or navigating between tasks)
 */
export function resetTaskState(): void {
  taskCompleted = false;

  if (typeof document !== 'undefined') {
    delete document.documentElement.dataset.taskDone;
  }

  if (typeof window !== 'undefined') {
    (window as Window & { __COMPONENT_BENCH_TASK_DONE__?: boolean }).__COMPONENT_BENCH_TASK_DONE__ = false;
  }
}

/**
 * Check if task has been completed
 */
export function isTaskCompleted(): boolean {
  return taskCompleted;
}

/**
 * Get the task completion status from DOM/window
 * Useful for external frameworks checking status
 */
export function getTaskStatus(): { completed: boolean; fromDom: boolean; fromWindow: boolean } {
  const fromDom = typeof document !== 'undefined' 
    ? document.documentElement.dataset.taskDone === 'true' 
    : false;
  
  const fromWindow = typeof window !== 'undefined'
    ? (window as Window & { __COMPONENT_BENCH_TASK_DONE__?: boolean }).__COMPONENT_BENCH_TASK_DONE__ === true
    : false;

  return {
    completed: taskCompleted || fromDom || fromWindow,
    fromDom,
    fromWindow,
  };
}
