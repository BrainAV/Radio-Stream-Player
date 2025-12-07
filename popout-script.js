import { radioStreamState, initPlayer } from './player.js';

/**
 * Initializes the pop-out player.
 */
function initPopoutPlayer() {
    // 1. Get initial state from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');
    const initialStation = urlParams.get('station');

    // 2. Apply the theme
    if (theme) {
        document.documentElement.classList.add(`${theme}-theme`);
    }

    // 3. Set the initial state for the player module
    // We set isPlaying to true so it starts playing immediately.
    radioStreamState.currentStation = initialStation;
    radioStreamState.isPlaying = true;

    // 4. Initialize the shared player logic
    // This will populate stations, set up event listeners, and play the audio.
    initPlayer(radioStreamState);

    // 5. Notify the main window when this pop-out is closed
    window.addEventListener('beforeunload', () => {
        // This message is caught by the main window to restore its UI.
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({ type: 'popoutClosed' }, '*');
            } catch (e) {
                console.error("Could not send message to opener window.", e);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initPopoutPlayer);