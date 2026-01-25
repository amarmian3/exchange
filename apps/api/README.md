# Running the API (`run_api.sh`)

This repository includes a convenience script, `run_api.sh`, for running the FastAPI service locally and optionally exposing it via an **ngrok public tunnel**.

This requires having uv already installed into your base python.

---

## What `run_api.sh` Does

When executed, the script:

- Resolves and exports the native matching engine library  
  (`.dll`, `.so`, or `.dylib`) based on the host OS
- Installs Python dependencies using `uv`
- Starts the FastAPI application with Uvicorn
- Optionally starts an **ngrok** tunnel to expose the API publicly

---

## Basic Usage (Local Only)

To run the API locally:

```bash
./scripts/run_api.sh
