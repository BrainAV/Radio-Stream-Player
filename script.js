import { initPlayer } from './player.js';
import { initVisualizer } from './visualizer.js';
import { stateManager } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
    // Apply custom background if saved
    const savedBg = localStorage.getItem('customBackground');
    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
    }

    if (document.getElementById('station-select')) {
        
        // Initialize the core player logic
        initPlayer();

        // Once the player has created the audio context and source, initialize the visualizer
        const state = stateManager.getState();
        if (state.audioContext && state.source) {
            initVisualizer();
        }
    }
});
