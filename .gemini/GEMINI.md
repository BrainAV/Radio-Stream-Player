# 🤖 Gemini Playground & Prompt Guide

This file is your **Command Center**. It contains the "Magic Spells" (Prompts) to guide Gemini through the development process defined in `ROADMAP.md`.

## 🏁 How to Use This Guide
1.  **Copy** the "Context Setter" below.
2.  **Paste** it at the start of every new chat session.
3.  **Select** the specific prompt for the goal you are working on.

---

## ⚡ Quick Sync & Workflow

### 1. Start of Session (The "Quick Sync")
*Use this to instantly load the project context. You just used this!*
> "Please read all the project context files (`ROADMAP.md`, `README.md`, `PROGRESS.md`, `DEVELOPER_GUIDE.md`, and the contents of the `.gemini` folder) to get in sync with the current state of the project."

### 2. Feature Development
> "Let's implement the '[Feature Name]' feature from the `ROADMAP.md`."
> "I have an idea for a new feature: '[Description]'. Please add it as a 'To Do' item to the `ROADMAP.md` under the appropriate goal (Mid-Term, Long-Term, etc.)."

### 3. Bug Fixes
> "I've found a bug: [Describe bug]. Let's work on a fix."

### 4. Documentation
> "Please update the `PROGRESS.md` (our changelog) to reflect the recent changes we've made."
> "Let's review all the documentation files to ensure they are consistent and up-to-date."
> "Summarize the changes we made in this session for a Git commit message. Follow the Conventional Commits format."

---

## 🧠 Manual Context Setter (Fallback)
*If the Quick Sync doesn't work, paste this:*
> "You are Gemini Code Assist, a world-class software engineering assistant. We are building a 'Radio Stream Player' web application.
> **Architecture:** Vanilla JavaScript (ES6+), HTML5, CSS3, Web Audio API.
> **Structure:** Modular JS (`player.js`, `visualizer.js`, `stations.js`).
> **Current Goal:** We are working on the Mid-Term Goals (v1.2) from the `ROADMAP.md`.
> **Style:** Clean, accessible, well-commented, and performant code."
---

## 🚀 Mid-Term Goals (v1.2)

### 1. Custom Stations
> "Let's implement the 'Custom Stations' feature. We need to:
> 1. Add a button and a form/modal to the UI for users to input a station name and URL.
> 2. Create functions to add the new station to the station list and update the `<select>` dropdown.
> 3. Use `localStorage` to save the user-added stations so they persist across sessions.
> 4. Add logic to load these custom stations when the application starts."

### 2. Favorites System
> "Let's add a 'Favorites' system. This will involve:
> 1. Adding a 'favorite' icon (e.g., a star) next to the station selector or in the station list.
> 2. When a user favorites a station, save its ID or URL to `localStorage`.
> 3. Modify the station list to show favorited stations at the top."

### 3. Stream Metadata
> "Let's investigate displaying the currently playing song/artist. This is a research-heavy task.
> 1. Research how to access ICY (Icy-MetaData) headers from a stream URL using JavaScript.
> 2. Determine if a server-side proxy is necessary to bypass CORS limitations.
> 3. If possible with frontend-only code, let's try to implement a proof-of-concept to fetch and display the metadata in the 'Now Playing' area."

---

## 🔭 Long-Term Goals (v2.0+)

### 1. Advanced State Management
> "Let's refactor the global `radioStreamState` object into a more robust, class-based state manager as outlined in `DEVELOPER_GUIDE.md`.
> 1. Create a new `state.js` file.
> 2. Implement a `StateManager` class with a private state, public getters, and setter methods.
> 3. Add a simple pub/sub system (`subscribe`, `notify`) to the class.
> 4. Refactor `player.js`, `visualizer.js`, and `script.js` to import and use the new state manager instance, replacing direct state manipulation with setters and subscriptions."

### 2. Build Process
> "Let's introduce a build tool like Vite to the project. This will involve:
> 1. Initializing a new Vite project.
> 2. Moving our existing `index.html`, `popout.html`, JS, and CSS files into the Vite project structure.
> 3. Updating our JS to use modern ES module import/export syntax for all files.
> 4. Configuring Vite to handle our static assets and provide a dev server with hot-reloading."

---

## 📝 Playground Notes
*Use this space below to paste code snippets, error logs, or ideas you want to save for later.*