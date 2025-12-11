import { stations } from './stations.js';

const stationSelect = document.getElementById('station-select');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const nowPlaying = document.getElementById('now-playing');

const audio = new Audio();
audio.crossOrigin = 'anonymous';

let isPlaying = false;

// --- UI Update Functions ---

function updatePlayPauseIcon(playing) {
    const playIcon = playPauseBtn.querySelector('.icon-play');
    const pauseIcon = playPauseBtn.querySelector('.icon-pause');
    if (playIcon && pauseIcon) {
        playIcon.style.display = playing ? 'none' : 'block';
        pauseIcon.style.display = playing ? 'block' : 'none';
    }
}

function updateVolumeSliderTrack(value) {
    const progress = value * 100;
    // Note: We need to get the CSS variables from the document to use them here.
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
    volumeSlider.style.background = `linear-gradient(to right, ${primaryColor} ${progress}%, ${borderColor} ${progress}%)`;
}

function updateNowPlaying() {
    const stationName = stationSelect.options[stationSelect.selectedIndex].text;
    nowPlaying.textContent = `Now Playing: ${stationName}`;
}

// --- Player Logic ---

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        audio.play().catch(err => {
            console.error('Playback failed:', err);
            nowPlaying.textContent = 'Error: Unable to play stream';
            isPlaying = false;
        });
    } else {
        audio.pause();
    }
    updatePlayPauseIcon(isPlaying);
    updateNowPlaying();
}

// --- Event Listeners ---

playPauseBtn.addEventListener('click', togglePlay);

stationSelect.addEventListener('change', () => {
    audio.src = stationSelect.value;
    updateNowPlaying();
    if (isPlaying) {
        audio.play();
    }
});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    updateVolumeSliderTrack(audio.volume);
});

// Notify main window when pop-out is closed
window.addEventListener('beforeunload', () => {
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'popoutClosed' }, '*');
    }
});

// --- Initialization ---

function init() {
    // Populate stations
    stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station.url;
        option.textContent = station.name;
        stationSelect.appendChild(option);
    });

    // Get initial state from URL
    const params = new URLSearchParams(window.location.search);
    const initialStation = params.get('station');
    const theme = params.get('theme');

    // Apply theme
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }

    // Set initial station and volume
    if (initialStation) {
        stationSelect.value = initialStation;
        audio.src = initialStation;
    } else {
        audio.src = stationSelect.value;
    }

    // For simplicity, start with a default volume
    const initialVolume = 0.5;
    audio.volume = initialVolume;
    volumeSlider.value = initialVolume;
    updateVolumeSliderTrack(initialVolume);
    updateNowPlaying();
    updatePlayPauseIcon(false);
}

init();