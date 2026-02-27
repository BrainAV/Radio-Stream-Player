# Project Roadmap

This document outlines the future direction and planned features for the Radio Stream Player. The goals are divided into short-term, mid-term, and long-term milestones.

---

## 🎯 Short-Term Goals (v1.1)

*These are improvements focused on code quality, accessibility, and minor feature additions.*

-   **[x] Code Refactoring:**
    -   Modularize `script.js` by separating the core player logic from the VU meter visualization logic. This will improve maintainability and make it easier to add new visualizers.
-   **[x] Accessibility (A11y) Enhancements:**
    -   Add `aria-label` attributes to all interactive controls (buttons, sliders) for better screen reader support.
    -   Ensure full keyboard navigability for all player functions.
    -   Implement focus-visible states for better keyboard navigation feedback.
-   **[x] UI/UX Improvements:**
    -   **[x]** Add a visual indicator or tooltip to the "Cycle VU Meter" button to show the name of the current style.
    -   **[x]** Improve the pop-out window closing mechanism to be more robust.
-   **[x] Content:**
    -   **[x]** Add more high-quality radio streams to the default list.

---

## 🚀 Mid-Term Goals (v1.2)

*These goals focus on adding significant new user-facing features.*

-   **[ ] UI/UX Enhancements:**
    -   **[x]** Redesign the header to reduce its vertical height, improving usability on smaller screens and mobile devices.
    -   **[ ]** Modernize the player's look and feel with an updated visual design:
        -   **[x]** Implement a "Glassmorphism" (frosted glass) effect for the main player card.
        -   **[x]** Replace text-based controls (Play/Pause, Pop-out) with modern SVG icons.
        -   **[x]** Redesign the volume slider for a more modern appearance.
        -   **[x]** Re-organize player controls into a more compact, horizontal layout.
        -   **[x]** Apply the modern look and feel to the pop-out player for a consistent UX.
-   **[x] Custom Stations:**
    -   **[x]** Implement a feature allowing users to add their own radio stream URLs.
    -   **[x]** Use `localStorage` to save user-added stations so they persist between sessions.
    -   **[x] Favorites System:**
    -   Allow users to mark stations as "favorites" for quick access.
-   **[ ] Personalization:**
    -   **[x] Custom Backgrounds:**
        -   **[x]** Allow users to input a URL to set as the player background.
        -   **[x]** Save the preference in `localStorage`.
-   **[x] Community & Feedback:**
    -   **[x] Station Submission:**
        -   **[x]** Add a mechanism (e.g., link to Google Form or GitHub Issue) for users to suggest new radio stations to be added to the default list.
    -   **[x] Issue Reporting:**
        -   **[x]** Add a "Report Broken Stream" button that allows users to flag stations that are offline or malfunctioning.
-   **[ ] Stream Metadata Display:**
    -   Investigate methods (e.g., ICY metadata) to fetch and display the currently playing song and artist information from the stream, where available. This may require a server-side proxy for CORS reasons.

---

## 🔭 Long-Term Goals (v2.0+)

*These are major architectural changes and features that would represent a significant evolution of the project.*

-   **[ ] Advanced State Management:**
    -   Refactor the simple global `radioStreamState` object into a more robust state management pattern (e.g., a class-based service or a small pub/sub library) to better handle application complexity.
-   **[ ] Build Process Integration:**
    -   Introduce a modern build tool like Vite or Parcel to enable features like ES modules, CSS pre-processing, and code minification for production builds.
-   **[ ] Backend Service (Cloudflare Worker Proxy):**
    -   Implement a "Universal Proxy" using a Cloudflare Worker to tunnel insecure HTTP streams over HTTPS.
    -   **Goal:** Allow the application to be hosted securely (HTTPS) while still playing legacy HTTP streams, solving "Mixed Content" issues.
    -   **Implementation:** Use a single Worker script that accepts a target URL parameter (e.g., `?url=http://...`) and pipes the response back to the client.
    -   **Metadata:** Extend the worker to potentially parse ICY metadata server-side to avoid CORS issues with headers.
-   **[ ] Migration to Self-Hosted Backend (PHP/SQL):**
    -   Migrate away from static GitHub Pages hosting to a full LAMP/LEMP stack environment.
    -   **Goal:** Enable advanced features like user accounts, server-side playlist management, and a robust API.
    -   **Implementation:** Develop a PHP backend with a MySQL/MariaDB database to store stations, user preferences, and analytics.
    -   **File Uploads:** Allow users to upload custom background images (e.g., WebP) instead of just providing URLs.
    -   **Community Features:**
        -   Store user-submitted station suggestions in the database for review.
        -   Log broken stream reports to an admin dashboard.
    -   **Database Schema:** Plan for a robust schema including:
        -   `Station ID`
        -   `Genre` (Categorization)
        -   `Country of Origin`
        -   `Bitrate/Format`
    -   **Search & Filtering:** Implement a search bar and filter controls (by Genre/Country) to easily find stations within the larger database.