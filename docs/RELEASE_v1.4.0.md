# 🎉 Release v1.4.0

This release introduces the **Agent Skills framework** to supercharge future AI-assisted development and completely overhauls the internal engine with **Advanced State Management v2**!

### 🤖 Added (Development & Tooling)
- **Agent Skills framework:** Introduced a `.agent/skills/` directory to establish explicit, file-based instructions for AI coding assistants. These `SKILL.md` files act as "personas" to maintain consistency across the codebase.
  - `station-curator`: Guides strict validation and formatting of new stream URLs.
  - `ui-consistency`: Enforces the project's signature "Glassmorphism" aesthetic.
  - `state-architect`: Enforces the Pub/Sub state management pattern.
  - `a11y-auditor`: Guarantees accessibility standards.
  - `audio-engineer`: Provides Web Audio API best practices.
  - `release-manager`: Automates the Changelog and version-bumping workflows.

### 🏗️ Changed (v2.0 Architecture Refactor)
- **Advanced State Management (The "Modern Restaurant" Refactor):**
  - Replaced the chaotic global `window.radioStreamState` object with a centralized `StateManager` (Pub/Sub pattern) class in `state.js`.
  - Decoupled DOM updating logic from click event listeners. UI components (like the Play button, Volume Slider, and Visualizer) now automatically re-render by *subscribing* to state mutations rather than polling or triggering each other manually.
  - Fixed visualizer behavior where changing styles while paused caused the UI to completely disappear.

### 🐛 Fixed
- Fixed a bug where assigning a non-integer value to the visualizer style in `localStorage` caused the Settings dropdown to go completely blank.
