# Release v1.2.1

*Released on 2026-03-02*

This patch release brings fantastic polish to the `v1.2` feature set, focusing on UI/UX fixes, powerful enhancements to the Popout Player, and crucial optimizations for those self-hosting the Cloudflare Proxy.

## 🚀 Key Improvements

*   **Popout Player Parity:** The tiny popout player has learned a few new tricks! It now fully supports the "Now Playing" scrolling marquee, merges your Custom Stations, and automatically routes through the proxy.
*   **Custom Station Editing:** You can now directly edit the Name, URL, or Genre of any Custom Station in the settings menu without having to delete and recreate it.
*   **Universal CORS Proxying:** We discovered some `https://` streams weren't sending the proper CORS headers, breaking the visualizers. Now, *every* stream is confidently routed through the Cloudflare proxy to guarantee visualizer compatibility.

## 🛠️ Optimizations & Fixes

*   **Smarter Metadata Polling:** The frontend player is now significantly more intelligent and will instantly stop polling for metadata when you pause or stop the audio, saving you massive amounts of API requests.
*   **Marquee Constraints:** Squashed a CSS bug where exceptionally long track titles from continuous DJ mixes would stretch the beautiful glassmorphism player right off your screen!
*   **New Tunes:** Welcome *Hirsch Radio Psytrance* and *Hirsch Radio Progressive* to the default curated station list! 

## 📚 Documentation Updates

*   **Capacity Planning Guide:** Added an extensive guide outlining exactly how Cloudflare requests are calculated. It details how the 100k free tier limit equates to concurrent users and specifically instructs developers on how to adjust the `12000ms` polling interval in the code to multiply their capacity limits by up to 5x.
