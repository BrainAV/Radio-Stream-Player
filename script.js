import { radioStreamState, initPlayer } from './player.js';
import { initVisualizer } from './visualizer.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('station-select')) {
        
        // Initialize the core player logic
        initPlayer(radioStreamState);

        // Once the player has created the audio context and source, initialize the visualizer
        if (radioStreamState.audioContext && radioStreamState.source) {
            initVisualizer(radioStreamState, radioStreamState.audioContext, radioStreamState.source);
        }
    }
});
