# Release v1.2.0 - The Metadata & Proxy Update 🎶

This major release officially marks the completion of the Mid-Term (v1.2) goals outlined in our roadmap. It introduces a robust backend solution to securely play all types of online radio stations and finally brings live track information straight to the UI!

### 🌟 Key Features

*   **Universal Streaming (The Cloudflare Worker Proxy):** We've implemented a custom Cloudflare Worker (`api.djay.ca`). This acts as a secure tunnel, permanently solving the dreaded "Mixed Content" warnings. You can now securely play older HTTP-only internet radio stations on our secure HTTPS GitHub Pages site without any browser security errors!
*   **Live "Now Playing" Track Info:** Wondering what song is currently playing? The player now features a sleek "Now Playing" display in the header. If the track name is long, it even features a smooth scrolling marquee effect to ensure you can read it all.
*   **OS Lock Screen Integration:** We didn't stop at the UI. The track and artist information is now dynamically piped into the Media Session API. This means the currently playing track name will show up on your smartphone's lock screen, your smartwatch, or your Windows/macOS media control overlays!

### 🔧 Under the Hood

*   **Smart Auto-Routing:** The frontend `player.js` is now smart enough to detect `http://` URLs and automatically route them through our secure `api.djay.ca` proxy on the fly. Native `https://` streams play directly to save bandwidth.
*   **Secure Metadata Polling:** Getting metadata the old-fashioned way caused horrible audio glitching in the browser. Now, the player silently polls a dedicated `/metadata` endpoint on our proxy every 12 seconds. The proxy extracts the ICY metadata directly from the source server and hands our frontend clean, glitch-free track information!
*   **Proxy Security:** The backend proxy has strict CORS policies and `Origin/Referer` checks built-in to prevent unauthorized domains from draining our bandwidth.
