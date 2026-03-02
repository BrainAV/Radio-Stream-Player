# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
### Changed
### Fixed
### Documentation

---

## [1.2.0] - 2026-03-01

### Added
-   **Backend / Security:** Created a Cloudflare Worker script (`api.djay.ca`) to act as a secure proxy, tunneling insecure HTTP radio streams over HTTPS to bypass Mixed Content restrictions natively. The Worker also includes security checks to only allow traffic from the `djay.ca` and `localhost` domains.
-   **Metadata:** Implemented a new `/metadata` endpoint on the Cloudflare Worker that securely fetches and parses `Icy-MetaData` blocks.
-   **UI / UX:** Added a new "Now Playing" area to the player header. If the track name is too long, a CSS marquee animation is automatically applied.
-   **State Management:** The global `radioStreamState` now tracks a `metadataInterval` polling timer.

### Changed
-   **Audio Routing:** `player.js` now automatically detects `http://` stream URLs and dynamically routes them through the `api.djay.ca` proxy.
-   **Metadata Polling:** `player.js` now polls the `/metadata` endpoint every 12 seconds to fetch the current track name and gracefully falls back to the station name if metadata is unavailable.
-   **Media Integration:** The OS media lock screen (via Media Session API) now dynamically updates with the currently playing track name fetched from the proxy.

### Fixed

### Documentation
-   **Roadmap:** Moved "Stream Metadata Display" and "Backend Service (Cloudflare Worker Proxy)" from Mid/Long-Term goals to Completed status.
-   **Developer Guide:** Updated the Deployment Considerations section to reflect the active Cloudflare Worker architecture.

---

## [1.1.2] - 2026-02-28

### Added
-   **Personalization:** Added "Custom Backgrounds" feature. Users can now set a custom image URL as the player background via the Settings modal.
-   **Personalization:** Added a "Background Presets" grid in Settings, allowing users to quickly switch between curated high-quality themes (Default, Cyberpunk, Deep Space, Abstract).
-   **Community:** Added "Suggest a New Station" and "Report a Broken Stream" links to the Settings modal, pointing to GitHub issue templates.
-   **Visualizer:** Added a new "Neon" VU meter style with a glowing effect.
-   **Metadata:** Implemented Media Session API support. The player now displays station information (Name, Genre, Country) on the OS lock screen and media controls, and supports hardware media keys (Play/Pause/Next/Prev).

### Changed
-   **UI/UX:** The "Favorite" button is now disabled when "Show Favorites Only" is active to prevent accidental removal of the currently playing station from the filtered list.

### Fixed
-   **Visualizer:** Fixed an issue where the "Circular" VU meter was not displaying correctly due to incorrect CSS selectors and SVG class assignment.
-   **Mobile:** Fixed "Classic" and "Neon" VU meters not animating correctly on mobile devices (animating width instead of height).
-   **UI/UX:** Fixed a layout issue where the settings modal was not scrollable on small screens, preventing access to all options.

### Documentation
-   **Roadmap:** Updated the "Backend Service" goal to specifically target a Cloudflare Worker solution for handling HTTP streams on HTTPS sites.
-   **General:** Migrated changelog from `PROGRESS.md` to `CHANGELOG.md`.
-   **Roadmap:** Added plans for "Custom Backgrounds" (Mid-Term) and image uploads (Long-Term).
-   **Roadmap:** Added plans for "Community & Feedback" features, including station submission and broken stream reporting.

## [1.1.1] - 2025-12-10

### Changed
-   **UI/UX:** Redesigned the header to be more compact, reducing its vertical height to save screen space.
-   **UI/UX:** Implemented a "Glassmorphism" (frosted glass) effect for the main player card and header for a more modern look.
-   **UI/UX:** Replaced text-based "Play/Pause" and "Pop-out" buttons with clean SVG icons.
-   **UI/UX:** Redesigned the volume slider with a dynamic "fill" track and updated thumb for a more modern appearance.
-   **UI/UX:** Re-organized player controls into a compact, horizontal layout for a sleeker appearance.
-   **UI/UX:** Applied the modern "Glassmorphism" design and horizontal control layout to the pop-out player for a consistent user experience.

---

## [1.1.0] - 2025-12-09

### Added
-   **Accessibility:** Added `aria-label` attributes to all icon-only buttons for screen reader support.
-   **Accessibility:** Implemented `:focus-visible` CSS states for clear keyboard navigation outlines.
-   **UI/UX:** The VU meter style-cycle button now has a dynamic tooltip that displays the name of the current style.
-   **Content:** Added several new high-quality Trance and Psytrance radio streams.

### Changed
-   **Code Refactoring:** Modularized the monolithic `script.js` into `player.js`, `visualizer.js`, and `stations.js` to improve maintainability.
-   **Pop-out Player:** Refactored the pop-out player logic to reuse the main player module and made the closing mechanism more reliable with a polling fallback.

---

## [1.0.0] - 2025-12-07

### Added
-   **Core Player:** Audio playback, volume controls, and station selector.
-   **State Management:** Remembers last station and volume.
-   **Visualizer Engine:** Real-time audio analysis with 6 initial styles (Classic, LED, Circular, Waveform, Spectrum, Retro).
-   **UI/UX:** Light/Dark themes with auto-detection.
-   **Pop-out Player:** Ability to launch the player in a compact, separate window.
-   **Documentation:** Initial `README.md` and `DEVELOPER_GUIDE.md`.