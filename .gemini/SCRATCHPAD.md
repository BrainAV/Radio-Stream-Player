# 📝 Developer Scratchpad

Use this file for:
- A temporary to-do list for the current coding session.
- Brainstorming logic before writing code.
- Storing error messages or debug output.

---

## 🚧 Current Session: Cloudflare Worker Proxy & Stream Metadata (v1.2 / v2.0)

**Goal:** Implement a Cloudflare Worker proxy to convert HTTP to HTTPS and parse ICY metadata.

### 🌐 Phase 1: Cloudflare Worker Setup & Proxy Routing (Manual)
- [x] Initializing the Cloudflare Worker project (e.g., `radio-worker`) and deploying to `api.djay.ca` will be done manually by the user.
- [x] Implement core proxy logic to take a `?url=` parameter and return the stream in the `worker.js` script.
- [x] Add CORS headers to allow requests from the frontend domain.

### 🎵 Phase 2: Metadata Extraction (Worker Side)
- [x] Implement a specific endpoint or logic for metadata (e.g., `/api/metadata?url=...`).
- [x] Send `Icy-MetaData: 1` header in the Worker fetch request.
- [x] Parse the `icy-metaint` interval and read the stream chunks to extract the metadata block.
- [x] Return the extracted `StreamTitle` and `StreamUrl` as a JSON response.
- [x] *(Optional but recommended)* Consider Server-Sent Events (SSE) for pushing metadata updates instead of polling, or use a polling mechanism.

### 💻 Phase 3: Frontend Integration
- [x] Refactor `player.js` to route stream URLs through the proxy if they are HTTP.
- [x] Implement a polling or SSE listener in the frontend to fetch current metadata for the active stream.
- [x] Update the UI: Add a "Now Playing" text area with scrolling marquee support for long titles.
- [x] Update the Media Session API to display the dynamically fetched Track/Artist info on the lock screen.

---

## ✅ Completed
*   **[x] Mid-Term Goals (v1.2):** UI/UX modernization, Custom Stations, Custom Backgrounds, and Favorites are complete.