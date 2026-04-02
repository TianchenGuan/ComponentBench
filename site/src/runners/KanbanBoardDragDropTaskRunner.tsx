'use client';

import React from 'react';
import { finishTask } from '@/utils/finishTask';
import ThemeWrapper from './ThemeWrapper';
import PlacementWrapper from './PlacementWrapper';
import type { TaskSpec } from '@/types';

// Antd task components
import AntdT01 from './kanban_board_drag_drop/antd/T01';
import AntdT02 from './kanban_board_drag_drop/antd/T02';
import AntdT03 from './kanban_board_drag_drop/antd/T03';
import AntdT04 from './kanban_board_drag_drop/antd/T04';
import AntdT05 from './kanban_board_drag_drop/antd/T05';
import AntdT06 from './kanban_board_drag_drop/antd/T06';
import AntdT07 from './kanban_board_drag_drop/antd/T07';
import AntdT08 from './kanban_board_drag_drop/antd/T08';
import AntdT09 from './kanban_board_drag_drop/antd/T09';
import AntdT10 from './kanban_board_drag_drop/antd/T10';
import AntdV2T33 from './kanban_board_drag_drop/antd/v2/T33';
import AntdV2T34 from './kanban_board_drag_drop/antd/v2/T34';
import AntdV2T35 from './kanban_board_drag_drop/antd/v2/T35';
import AntdV2T36 from './kanban_board_drag_drop/antd/v2/T36';
import AntdV2T37 from './kanban_board_drag_drop/antd/v2/T37';

// MUI task components
import MuiT01 from './kanban_board_drag_drop/mui/T01';
import MuiT02 from './kanban_board_drag_drop/mui/T02';
import MuiT03 from './kanban_board_drag_drop/mui/T03';
import MuiT04 from './kanban_board_drag_drop/mui/T04';
import MuiT05 from './kanban_board_drag_drop/mui/T05';
import MuiT06 from './kanban_board_drag_drop/mui/T06';
import MuiT07 from './kanban_board_drag_drop/mui/T07';
import MuiT08 from './kanban_board_drag_drop/mui/T08';
import MuiT09 from './kanban_board_drag_drop/mui/T09';
import MuiT10 from './kanban_board_drag_drop/mui/T10';
import MuiV2T38 from './kanban_board_drag_drop/mui/v2/T38';
import MuiV2T39 from './kanban_board_drag_drop/mui/v2/T39';
import MuiV2T40 from './kanban_board_drag_drop/mui/v2/T40';
import MuiV2T41 from './kanban_board_drag_drop/mui/v2/T41';
import MuiV2T42 from './kanban_board_drag_drop/mui/v2/T42';

// Mantine task components
import MantineT01 from './kanban_board_drag_drop/mantine/T01';
import MantineT02 from './kanban_board_drag_drop/mantine/T02';
import MantineT03 from './kanban_board_drag_drop/mantine/T03';
import MantineT04 from './kanban_board_drag_drop/mantine/T04';
import MantineT05 from './kanban_board_drag_drop/mantine/T05';
import MantineT06 from './kanban_board_drag_drop/mantine/T06';
import MantineT07 from './kanban_board_drag_drop/mantine/T07';
import MantineT08 from './kanban_board_drag_drop/mantine/T08';
import MantineT09 from './kanban_board_drag_drop/mantine/T09';
import MantineT10 from './kanban_board_drag_drop/mantine/T10';
import MantineV2T43 from './kanban_board_drag_drop/mantine/v2/T43';
import MantineV2T44 from './kanban_board_drag_drop/mantine/v2/T44';
import MantineV2T45 from './kanban_board_drag_drop/mantine/v2/T45';
import MantineV2T46 from './kanban_board_drag_drop/mantine/v2/T46';
import MantineV2T47 from './kanban_board_drag_drop/mantine/v2/T47';
import MantineV2T48 from './kanban_board_drag_drop/mantine/v2/T48';

interface KanbanBoardDragDropTaskRunnerProps {
  task: TaskSpec;
}

export default function KanbanBoardDragDropTaskRunner({ task }: KanbanBoardDragDropTaskRunnerProps) {
  const handleSuccess = () => {
    finishTask(task.id);
  };

  const renderTaskComponent = () => {
    const props = { task, onSuccess: handleSuccess };

    switch (task.id) {
      // Antd tasks
      case 'kanban_board_drag_drop-antd-T01':
        return <AntdT01 {...props} />;
      case 'kanban_board_drag_drop-antd-T02':
        return <AntdT02 {...props} />;
      case 'kanban_board_drag_drop-antd-T03':
        return <AntdT03 {...props} />;
      case 'kanban_board_drag_drop-antd-T04':
        return <AntdT04 {...props} />;
      case 'kanban_board_drag_drop-antd-T05':
        return <AntdT05 {...props} />;
      case 'kanban_board_drag_drop-antd-T06':
        return <AntdT06 {...props} />;
      case 'kanban_board_drag_drop-antd-T07':
        return <AntdT07 {...props} />;
      case 'kanban_board_drag_drop-antd-T08':
        return <AntdT08 {...props} />;
      case 'kanban_board_drag_drop-antd-T09':
        return <AntdT09 {...props} />;
      case 'kanban_board_drag_drop-antd-T10':
        return <AntdT10 {...props} />;
      case 'kanban_board_drag_drop-antd-v2-T33':
        return <AntdV2T33 {...props} />;
      case 'kanban_board_drag_drop-antd-v2-T34':
        return <AntdV2T34 {...props} />;
      case 'kanban_board_drag_drop-antd-v2-T35':
        return <AntdV2T35 {...props} />;
      case 'kanban_board_drag_drop-antd-v2-T36':
        return <AntdV2T36 {...props} />;
      case 'kanban_board_drag_drop-antd-v2-T37':
        return <AntdV2T37 {...props} />;

      // MUI tasks
      case 'kanban_board_drag_drop-mui-T01':
        return <MuiT01 {...props} />;
      case 'kanban_board_drag_drop-mui-T02':
        return <MuiT02 {...props} />;
      case 'kanban_board_drag_drop-mui-T03':
        return <MuiT03 {...props} />;
      case 'kanban_board_drag_drop-mui-T04':
        return <MuiT04 {...props} />;
      case 'kanban_board_drag_drop-mui-T05':
        return <MuiT05 {...props} />;
      case 'kanban_board_drag_drop-mui-T06':
        return <MuiT06 {...props} />;
      case 'kanban_board_drag_drop-mui-T07':
        return <MuiT07 {...props} />;
      case 'kanban_board_drag_drop-mui-T08':
        return <MuiT08 {...props} />;
      case 'kanban_board_drag_drop-mui-T09':
        return <MuiT09 {...props} />;
      case 'kanban_board_drag_drop-mui-T10':
        return <MuiT10 {...props} />;
      case 'kanban_board_drag_drop-mui-v2-T38':
        return <MuiV2T38 {...props} />;
      case 'kanban_board_drag_drop-mui-v2-T39':
        return <MuiV2T39 {...props} />;
      case 'kanban_board_drag_drop-mui-v2-T40':
        return <MuiV2T40 {...props} />;
      case 'kanban_board_drag_drop-mui-v2-T41':
        return <MuiV2T41 {...props} />;
      case 'kanban_board_drag_drop-mui-v2-T42':
        return <MuiV2T42 {...props} />;

      // Mantine tasks
      case 'kanban_board_drag_drop-mantine-T01':
        return <MantineT01 {...props} />;
      case 'kanban_board_drag_drop-mantine-T02':
        return <MantineT02 {...props} />;
      case 'kanban_board_drag_drop-mantine-T03':
        return <MantineT03 {...props} />;
      case 'kanban_board_drag_drop-mantine-T04':
        return <MantineT04 {...props} />;
      case 'kanban_board_drag_drop-mantine-T05':
        return <MantineT05 {...props} />;
      case 'kanban_board_drag_drop-mantine-T06':
        return <MantineT06 {...props} />;
      case 'kanban_board_drag_drop-mantine-T07':
        return <MantineT07 {...props} />;
      case 'kanban_board_drag_drop-mantine-T08':
        return <MantineT08 {...props} />;
      case 'kanban_board_drag_drop-mantine-T09':
        return <MantineT09 {...props} />;
      case 'kanban_board_drag_drop-mantine-T10':
        return <MantineT10 {...props} />;

      case 'kanban_board_drag_drop-mantine-v2-T43':
        return <MantineV2T43 {...props} />;
      case 'kanban_board_drag_drop-mantine-v2-T44':
        return <MantineV2T44 {...props} />;
      case 'kanban_board_drag_drop-mantine-v2-T45':
        return <MantineV2T45 {...props} />;
      case 'kanban_board_drag_drop-mantine-v2-T46':
        return <MantineV2T46 {...props} />;
      case 'kanban_board_drag_drop-mantine-v2-T47':
        return <MantineV2T47 {...props} />;
      case 'kanban_board_drag_drop-mantine-v2-T48':
        return <MantineV2T48 {...props} />;

      default:
        return (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              Task not implemented
            </div>
            <div style={{ color: '#999' }}>
              Task ID: <code>{task.id}</code>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeWrapper task={task}>
      <PlacementWrapper placement={task.scene_context.placement}>
        {renderTaskComponent()}
      </PlacementWrapper>
    </ThemeWrapper>
  );
}
