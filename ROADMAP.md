# Project Roadmap (Legacy Archive)

> [!IMPORTANT]
> **This version is now in Maintenance Mode.**
> The following goals represent the original development path for the standalone HTML/JS version. Active development of new features (User Accounts, PHP Backend, SQL Database) has migrated to the [Radio-Stream-Player-PHP](https://github.com/BrainAV/Radio-Stream-Player-PHP) repository.

---

## ✅ Completed & Finalized (v1.x)

*The following milestones were successfully reached for the original standalone player.*

-   **[x] Code Refactoring & A11y (v1.1)**
-   **[x] UI/UX & Customizations (v1.2)**
-   **[x] Radio Browser Integration (v1.3)**
-   **[x] Agent Tooling & Frameworks (v1.4)**
-   **[x] Advanced State Management (StateManager Class)**: Refactored the global `radioStreamState` into a robust Pub/Sub model to handle UI synchronization reliably.

---

## 🔒 Legacy State (Maintenance)

*These items were either completed or removed as the project evolved into the PHP-driven version.*

-   **[x] Secure Proxy (Cloudflare Worker)**: Successfully implemented at `api.djay.ca` to handle HTTPS mixed-content and track metadata natively.
-   **[-] Build Process (Vite/Parcel)**: Removed from the roadmap for this repository to maintain its "Zero-Dependency/Static-Only" identity.
-   **[-] Monetization & Ads**: Abandoned in favor of keeping the legacy version clean and donation-focused.
-   **[-] Database Migration**: Moved entirely to the [Radio-Stream-Player-PHP] project.

---

## 🌍 The Future: Radio-Stream-Player-PHP

The vision for v2.0 has evolved into a full-stack PHP/MySQL application. Please visit the new repository for:
- [ ] User Accounts & Authentication
- [ ] Server-side Station Management
- [ ] Dynamic SQL Database Backend
- [ ] User Background Uploads (WebP)
- [ ] Community Admin Dashboard