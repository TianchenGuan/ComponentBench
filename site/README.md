# ComponentBench Site

The Next.js application that hosts the ComponentBench interactive task pages.

## Setup

```bash
npm install
npm run prebuild   # Generate task indices
npm run dev        # http://localhost:3002
```

## Build

```bash
npm run build
npm start -p 3002
```

## Structure

- `app/` — Next.js App Router pages and API routes
- `app/task/[taskId]/` — Individual task execution pages
- `app/record/` — Human trace recording interface
- `app/api/tasks/` — Task YAML loading API
- `src/runners/` — 97 canonical component type implementations (Ant Design, MUI, Mantine)
- `src/ontology/` — Component taxonomy (14 families, 97 types)
- `src/registry/` — Task and component registration
- `src/types/` — TypeScript type definitions

## Task Data

Task YAMLs are read from `../data/tasks_v1/` (v1, 2910 tasks) and `../data/tasks_v2/` (v2, 912 tasks).
