# Cloudflare Worker Proxy for Radio Stream Player

This directory contains the Cloudflare Worker script required to run the universal streaming proxy for the Radio Stream Player.

## Why is this needed?

Modern web browsers enforce a "Mixed Content" security policy. This means if you host your Radio Stream Player securely over `https://` (like on GitHub Pages), the browser will block any audio streams that use insecure `http://`.

Since many independent and legacy internet radio stations still broadcast over HTTP, this breaks playback.

To solve this, we use a Cloudflare Worker as a secure middleman.

1.  **Audio Proxy (`/`)**: The player sends the `http://` stream URL to the worker. The worker fetches the insecure stream on the server side and securely pipes the raw audio data back to your browser over HTTPS.
2.  **Metadata Extraction (`/metadata`)**: The player polls this endpoint. The worker fetches the stream, extracts the ICY metadata (Track & Artist Name), and returns it as a clean JSON object, preventing the browser from glitching trying to play metadata as audio.

## Deployment Instructions

1.  Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Navigate to **Workers & Pages** -> **Overview**.
3.  Click **Create Application** -> **Create Worker**.
4.  Give your worker a name (e.g., `radio-proxy`) and click **Deploy**.
5.  Click **Edit Code**.
6.  Copy the entire contents of `worker.js` from this folder and paste it into the Cloudflare code editor, replacing the default code.
7.  **(Crucial Step)** In `worker.js`, locate the security check around Line 23:
    ```javascript
    const isAllowed = !requestDomain ||
        requestDomain === "localhost" ||
        requestDomain === "127.0.0.1" ||
        requestDomain.endsWith("YOUR_DOMAIN_HERE.com"); // EDIT THIS
    ```
    Change `djay.ca` to the domain where you are hosting your frontend player to prevent unauthorized sites from stealing your bandwidth.
8.  Click **Deploy** in the top right corner.
9.  Note your new Worker URL (e.g., `https://radio-proxy.your-username.workers.dev`).

## Connecting to the Frontend

Once deployed, you need to tell the frontend player to use your new proxy.

1.  Open `player.js` in your project root.
2.  Locate the `PROXY_URL` constant near the top of the file (around line 26):
    ```javascript
    const PROXY_URL = 'https://api.djay.ca/'; // REPLACE THIS WITH YOUR WORKER URL
    ```
    *Make sure the URL ends with a trailing slash!*
3.  Save the file, and your player will now automatically route HTTP traffic through your newly deployed proxy!
