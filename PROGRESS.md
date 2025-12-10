# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.1] - 2025-12-10

### Changed
-   **UI/UX:** Redesigned the header to be more compact, reducing its vertical height to save screen space.

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