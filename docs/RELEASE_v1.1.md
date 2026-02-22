# Release v1.1: Refactoring & Accessibility

This is a significant foundational release focused on improving the long-term health of the codebase and making the player more accessible and robust for all users. We've refactored the core application logic, enhanced accessibility, and polished key user experience features.

---

### 🧹 Code Quality & Refactoring
*   The monolithic `script.js` has been completely refactored into focused ES modules (`player.js`, `visualizer.js`, `stations.js`). This makes the codebase cleaner and much easier to maintain and extend in the future.
*   The pop-out player now reuses the core `player.js` module, eliminating duplicated code and ensuring consistent behavior between the main and pop-out views.

### ♿ Accessibility (A11y) Enhancements
*   **Screen Reader Support:** All interactive controls now have `aria-label` attributes, providing clear descriptions for users of assistive technologies.
*   **Keyboard Navigation:** Implemented `:focus-visible` states across all buttons, sliders, and selectors to provide a clear visual outline for keyboard-only users without cluttering the UI for mouse users.

### ✨ UI/UX Improvements
*   **Robust Pop-out Player:** The pop-out window's closing mechanism is now more reliable, using a polling fallback to ensure the main player UI is always restored correctly.
*   **Dynamic Tooltip:** The VU meter style-cycle button now features a dynamic tooltip that displays the name of the current style (e.g., "Style: Classic"), improving usability.

### 🎶 Content
*   Added several new high-quality Trance and Psytrance radio streams to the default station list.

---

### 🛠️ Technologies Used

- **HTML5**: For the structure of the player.
- **CSS3**: For styling, including custom properties for theming and responsive design.
- **Vanilla JavaScript (ES6+)**: For all player logic, interactivity, and state management.
- **Web Audio API**: For audio processing and creating the dynamic visualizations.