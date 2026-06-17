<div align="center">

# Arkaans Copilot

**Arkaans Copilot is a Discord bot designed to streamline the management of temporary voice channels within your Discord server.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.js.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

[Documentation](https://copilot.arkaans.com) · [Invite the bot](https://discord.com/oauth2/authorize?client_id=927699980985192449&permissions=8&scope=bot) · [Arkaans Discord server](https://discord.gg/BgRwHfK)

</div>

---

## Overview

Arkaans Copilot is a Discord bot that automatically creates and manages temporary voice channels when users join a configured source channel. When the last member leaves, the temporary channel is deleted automatically.

This repository contains **v3** — a full rewrite in TypeScript with a production-ready architecture, PostgreSQL persistence, concurrent queue handling, and CI/CD pipeline. Previous versions are archived in the [`archive/`](./archive/) directory.

---

## Features

### Core

- **Temporary voice channels** — Automatically created on join, deleted on leave
- **Concurrent queue handling** — Per-guild queues prevent race conditions on simultaneous joins
- **Crash recovery** — Active channels are persisted in DB and cleaned up on bot restart

### Admin commands

| Command             | Description                                                           |
| ------------------- | --------------------------------------------------------------------- |
| `/setchannel`       | Configure a voice channel as a source trigger with a custom name list |
| `/resetchannel`     | Remove the configuration for a specific source channel                |
| `/resetallchannels` | Remove all source channel configurations for the server               |
| `/setwelcome`       | Set up a customizable welcome image for new members                   |
| `/testwelcome`      | Trigger the welcome message manually to preview the result            |

### Common commands

| Command    | Description                                    |
| ---------- | ---------------------------------------------- |
| `/arkaans`     | Invitation link to the official Arkaans server |
| `/help`        | Display all available commands                 |
| `/setlanguage` | Set the bot language for this server           |

---

## Tech Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Language         | TypeScript 5.x                   |
| Runtime          | Node.js 20+                      |
| Discord library  | Discord.js v14                   |
| Database         | PostgreSQL (Supabase)            |
| ORM              | Prisma 7                         |
| Queue            | p-queue                          |
| Image generation | @napi-rs/canvas                  |
| i18n             | i18next (8 languages)            |
| Containerization | Docker                           |
| CI/CD            | GitHub Actions                   |
| Hosting          | Fly.io                           |

---

## Database Schema

```
Guild (1)
├── SourceChannel (Many)
│   └── TempChannel (Many)
└── WelcomeConfig (1)
```

- **Guild** — root entity, one record per Discord server
- **SourceChannel** — configured trigger channels with a custom name list
- **TempChannel** — currently active temporary channels (cleared on restart)
- **WelcomeConfig** — per-guild welcome image configuration

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- A Supabase project ([supabase.com](https://supabase.com))

### Installation

```bash
git clone https://github.com/Boutzi/arkaans-copilot.git
cd arkaans-copilot
npm install
```

### Environment

Create a `.env` file at the root:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id

# Supabase connection pooler (used by the bot)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase direct connection (used for migrations)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
```

### Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Run

```bash
# Development
npm run dev

# Deploy slash commands
npm run deploy

# Production
npm run prod
```

---

## CI/CD Pipeline

```
Push / PR  →  Type check (tsc --noEmit)
Merge main →  Build Docker image (remote) → Deploy to Fly.io
```

Managed via GitHub Actions. The Docker image is built remotely and deployed to Fly.io automatically on merge to `main`.

---

## Roadmap

### v3.0 — Foundation

- [x] TypeScript rewrite
- [x] PostgreSQL schema with Prisma 7
- [x] Per-guild concurrent queue (p-queue)
- [x] Command handler
- [x] Event handler
- [x] `/setchannel`, `/resetchannel`, `/resetallchannels`
- [x] `/setwelcome` + `/testwelcome` — customizable welcome image
- [x] Crash recovery on restart
- [x] Docker setup
- [x] GitHub Actions CI/CD
- [x] Fly.io deployment
- [x] i18n — 8 languages (en, fr, de, es, it, ko, ja, zh) with per-guild setting

### v3.x — Future

- [ ] Monitoring (Sentry)
- [ ] Web dashboard for guild admins

---

## Documentation

Full documentation is available at [copilot.arkaans.com](https://copilot.arkaans.com).

---

## License

[MIT](./LICENSE)
