# Nexus

Nexus is a real-time collaborative workspace and multiplayer document editor. Built for teams that move fast, Nexus combines live collaboration, role-based access control, and a rich text editor into a single, seamless platform.

## Features

- **Real-Time Collaboration**: See your teammates' cursors and edits as they happen — no refresh required. Powered by Yjs & Hocuspocus.
- **Role-Based Access Control**: Owners, Admins, Editors, and Viewers. Permissions are enforced at the WebSocket level.
- **Rich Document Editor**: Headings, task lists, code blocks, blockquotes, bold, italic and more — all in a beautiful editor powered by Tiptap.
- **Workspace Management**: Manage multiple workspaces and documents from a dedicated dashboard.
- **Secure by Default**: End-to-end access control. Read-only mode is enforced at the server level — not just the UI.

## Tech Stack

This project is a monorepo built using Turborepo. 

- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: NestJS, GraphQL, Prisma (PostgreSQL), Hocuspocus (WebSockets)
- **Editor**: Tiptap, Yjs (CRDTs)
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js (>= 22.13)
- pnpm (>= 11.1.1)
- PostgreSQL database

### Installation

1. Clone the repository and install dependencies:
   ```sh
   pnpm install
   ```

2. Set up environment variables. Create `.env` files for both the API and Web apps based on the provided examples or your database settings.

3. Generate the Prisma client:
   ```sh
   pnpm --filter api run build
   ```
   *(Or manually run `npx prisma generate` inside `apps/api`)*

4. Start the development server:
   ```sh
   pnpm dev
   ```

This will concurrently start the NestJS backend and Next.js frontend.

## Architecture

- `apps/web`: The Next.js frontend application.
- `apps/api`: The NestJS backend application serving GraphQL and WebSockets.
- `@repo/ui`: Shared React components.
- `@repo/eslint-config`: Shared ESLint configurations.
- `@repo/typescript-config`: Shared TypeScript configurations.
