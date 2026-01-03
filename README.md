Directory Structure:

EXCHANGE/
├─ apps/
│  ├─ api/
│  ├─ chain_indexer/
│  ├─ frontend/
│  │  ├─ mobile/
│  │  └─ web/
│  └─ settlement_worker/
│
├─ docs/
│
├─ engine/
│  └─ matching_engine/
│     ├─ .vs/
│     ├─ include/
│     ├─ out/
│     ├─ src/
│     ├─ CMakeLists.txt
│     ├─ CMakePresets.json
│     ├─ matching_engine.cpp
│     └─ matching_engine.h
│
├─ infra/
└─ packages/


# EXCHANGE

A monorepo for a tokenised-asset exchange:
- **C++ matching engine** (orderbook + matching)
- **Python backend API** (order entry, persistence, WebSocket market data, orchestration)
- **Python blockchain services** (indexer + settlement worker)
- **Frontend apps** (web + mobile)
- **Infra** (local dev + cloud deployment)
- **Shared packages** (schemas/libs shared across services)

---

## Repository layout

### `apps/` (deployable services + client apps)

#### `apps/api/`
**What it does**
- Public backend API for the exchange.
- Handles order placement/cancel, user/account endpoints, and WebSocket streaming for market data.
- Talks to the C++ matching engine (local process or internal network service).
- Persists orders/trades/ledger into the database.

**Language**
- Python (recommended: FastAPI)

**Deployable**
- ✅ Yes

**How to deploy**
- **Local dev:** run the API directly (venv + uv) and connect to local Postgres/Redis.
- **Cloud:** package as a Docker container and deploy to AWS ECS/Fargate behind an ALB (or API Gateway if you later split HTTP/WS).

**Run (example)**
- Create venv, install deps (uv), then run:
  - `uv run uvicorn app.main:app --reload`

---

#### `apps/chain_indexer/`
**What it does**
- Watches the blockchain (RPC/logs) for relevant contract events (mints, burns, transfers, deposits/withdrawals).
- Writes canonical chain state and event records into the database.
- Supports reconciliation against internal ledger.

**Language**
- Python

**Deployable**
- ✅ Yes

**How to deploy**
- **Local dev:** run as a long-lived process that connects to RPC + DB.
- **Cloud:** deploy as a Docker container on ECS/Fargate (or as a scheduled job if polling in intervals).

**Run (example)**
- `python -m chain_indexer` (or equivalent entrypoint you define)

---

#### `apps/settlement_worker/`
**What it does**
- Executes blockchain transactions triggered by the exchange:
  - mint/burn/transfer of tokenised assets
  - withdrawals / on-chain settlements
- Handles retries, nonce management, idempotency, and writes tx status back to DB.

**Language**
- Python

**Deployable**
- ✅ Yes

**How to deploy**
- **Local dev:** run as a worker process and point it at the same DB + RPC.
- **Cloud:** deploy as a Docker container on ECS/Fargate. Typically reads “jobs” from DB, SQS, or a queue.

**Run (example)**
- `python -m settlement_worker` (or equivalent entrypoint you define)

---

#### `apps/frontend/`
Contains client applications.

##### `apps/frontend/web/`
**What it does**
- Web UI for trading: order entry, orderbook display, trades tape, user orders/fills.
- Communicates with `apps/api` via REST + WebSockets.

**Language**
- TypeScript / JavaScript (SvelteKit)

**Deployable**
- ✅ Yes

**How to deploy**
- **Local dev:** `npm run dev`
- **Cloud:** build static/SSR output and deploy to:
  - Vercel/Netlify (quickest), or
  - S3 + CloudFront (static), or
  - ECS (if SSR containerised)

---

##### `apps/frontend/mobile/`
**What it does**
- Mobile client (future): trading UI optimised for phone.
- Communicates with `apps/api`.

**Language**
- TBD (commonly TypeScript with Expo/React Native)

**Deployable**
- ✅ Yes (to App Store / Play Store)

**How to deploy**
- Typically via Expo EAS or native CI pipelines once implemented.

---

### `engine/` (core matching engine)

#### `engine/matching_engine/`
**What it does**
- C++ matching engine that maintains in-memory orderbooks and performs matching (FIFO/price-time priority).
- Intended to be run as a separate process and controlled by `apps/api` over a local protocol (stdin/stdout or TCP/gRPC).

**Language**
- C++

**Deployable**
- ✅ Yes (as an internal service/process; not internet-facing)

**How to deploy**
- **Local dev:** build with CMake and run the binary directly.
- **Cloud:** containerise and deploy on ECS (often EC2-backed for tighter CPU control), then connect from `apps/api` over the private network.

**Notes**
- `.vs/` and `out/` are build artifacts / IDE files and should not be committed.

---

### `infra/` (deployment + local development infrastructure)
**What it does**
- Infrastructure as code and environment setup.
- Usually includes:
  - `docker-compose.yml` for local Postgres/Redis
  - Terraform or CDK for AWS (VPC, ECS, RDS, Redis, ALB, IAM, S3, CloudFront, etc.)

**Language**
- YAML / HCL (Terraform) / scripts (bash)

**Deployable**
- Not a runtime service, but ✅ used to deploy everything.

---

### `packages/` (shared libraries / schemas)
**What it does**
- Shared code used across multiple services/apps.
- Examples:
  - shared API schemas/types
  - shared Python chain utilities
  - shared TS UI components

**Language**
- Mixed (Python + TypeScript), depending on what you place here.

**Deployable**
- ❌ Not directly (these are libraries consumed by deployables)

---

### `docs/`
**What it does**
- Architecture notes, API docs, runbooks, diagrams.

**Deployable**
- ❌ Not directly

---

## Quick “deployable matrix”

| Component | Path | Deployable | Language |
|---|---|---:|---|
| API service | `apps/api` | ✅ | Python |
| Chain indexer | `apps/chain_indexer` | ✅ | Python |
| Settlement worker | `apps/settlement_worker` | ✅ | Python |
| Web frontend | `apps/frontend/web` | ✅ | TypeScript (SvelteKit) |
| Mobile frontend | `apps/frontend/mobile` | ✅ | TBD (likely TypeScript) |
| Matching engine | `engine/matching_engine` | ✅ (internal) | C++ |
| Infra | `infra` | N/A | Terraform/YAML/scripts |
| Shared packages | `packages` | ❌ | Mixed |
| Docs | `docs` | ❌ | Markdown |

---

## Local development (suggested)

Typical local stack:
1. Start Postgres/Redis from `infra/` (docker compose).
2. Build/run `engine/matching_engine`.
3. Run `apps/api` (FastAPI).
4. Run `apps/frontend/web` (SvelteKit).

The API should be configured to connect to:
- Postgres + Redis
- Matching engine (local process or TCP endpoint)
- RPC provider (for chain services)
