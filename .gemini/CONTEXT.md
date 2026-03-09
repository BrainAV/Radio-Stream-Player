<PERSONA_FILE>
.gemini/PERSONA.md
</PERSONA_FILE>
<PROJECT_INFO>
**Name**: Radio Stream Player (Legacy)
**Description**: A sleek, modern, and feature-rich web-based radio stream player built with vanilla JavaScript and the Web Audio API.
**Live URL**: http://radio1.djay.ca/
**Goal**: To maintain this minimalist, standalone HTML/JS version as a portable experiment while new development continues in the PHP-based repository.
</PROJECT_INFO>
<TECH_STACK>
Refer to `DEVELOPER_GUIDE.md` for architecture details.
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+ Modules)
- **Core APIs**: Web Audio API
- **State Management**: Centralized `StateManager` class (Pub/Sub pattern).
- **Status**: Legacy/Maintenance Mode.
</TECH_STACK>
<CODING_CONVENTIONS>
- **Architecture**: Maintain strict separation of concerns between modules:
    - `player.js`: Core audio and UI control logic.
    - `visualizer.js`: Web Audio API and canvas/DOM drawing logic.
    - `stations.js`: Station data.
    - `script.js`: Main application initializer.
- **State**: All state changes should ideally be managed through the `player.js` module, which owns the `radioStreamState` object. Avoid direct mutation from other files where possible.
- **Security**: Be mindful of CORS policies related to audio streams. Future backend work will address this more robustly.
- **Documentation**:
    - Update `ROADMAP.md` with new feature ideas.
    - Update `CHANGELOG.md` after implementing features or fixes.
    - Update `DEVELOPER_GUIDE.md` with any architectural changes.
- **Style**: Clean, commented code. Follow `.github/STYLE_GUIDE.md`.
- **Workflow**:
    - Check `ROADMAP.md` for the current goals.
    - Use `.gemini/GEMINI.md` for specific task prompts.
</CODING_CONVENTIONS>
<ROADMAP>
Refer to `ROADMAP.md` for the active project roadmap and planned features.
</ROADMAP>