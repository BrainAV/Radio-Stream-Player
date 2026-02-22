import { stations as defaultStations } from './stations.js';

export const radioStreamState = window.radioStreamState || {
    audio: null,
    isPlaying: false,
    currentStation: null,
    volume: 0.5,
    audioContext: null,
    source: null,
    animationFrameId: null,
    popoutWindow: null,
    vuStyle: 1 // Default to LED
};
window.radioStreamState = radioStreamState;

export function initPlayer(state) {
    // DOM Elements
    const stationSelect = document.getElementById('station-select');
    const favoriteBtn = document.getElementById('favorite-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const popoutBtn = document.getElementById('popout-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const nowPlaying = document.getElementById('now-playing');
    const popoutNotice = document.getElementById('popout-notice');

    function populateStations() {
        // Save current selection if possible
        const currentVal = stationSelect.value;
        stationSelect.innerHTML = '';

        // Merge default and custom stations
        const favorites = JSON.parse(localStorage.getItem('favoriteStations')) || [];
        const customStations = JSON.parse(localStorage.getItem('customStations')) || [];
        const allStations = [...defaultStations, ...customStations];
        
        // Filter by Favorites
        const showFavoritesOnly = localStorage.getItem('favoritesOnly') === 'true';
        let filteredStations = allStations;

        if (showFavoritesOnly) {
            filteredStations = filteredStations.filter(s => favorites.includes(s.url));
        }

        // Filter by Genre
        const selectedGenre = localStorage.getItem('selectedGenre') || 'all';
        if (selectedGenre !== 'all') {
            filteredStations = filteredStations.filter(s => s.genre === selectedGenre);
        }

        filteredStations.forEach((station, index) => {
            const option = document.createElement('option');
            option.value = station.url;
            
            // Add star if favorite
            const isFav = favorites.includes(station.url);
            option.textContent = (isFav ? '★ ' : '') + station.name;
            option.dataset.genre = station.genre || '';
            option.dataset.country = station.country || '';
            stationSelect.appendChild(option);
        });

        // Restore selection or default to first
        if (currentVal && Array.from(stationSelect.options).some(opt => opt.value === currentVal)) {
            stationSelect.value = currentVal;
        } else if (filteredStations.length > 0 && !state.currentStation) {
            stationSelect.value = filteredStations[0].url;
        }
        updateFavoriteBtnState();
        updateMediaSession();
    }

    // Initial population
    populateStations();

    // Listen for updates from settings.js
    window.addEventListener('stationListUpdated', populateStations);

    // Audio Setup
    if (!state.audio) {
        state.audio = new Audio();
        state.audio.crossOrigin = 'anonymous';
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.source = state.audioContext.createMediaElementSource(state.audio);
        state.source.connect(state.audioContext.destination);
    }

    function updatePlayPauseIcon(isPlaying) {
        const playIcon = playPauseBtn.querySelector('.icon-play');
        const pauseIcon = playPauseBtn.querySelector('.icon-pause');
        playIcon.style.display = isPlaying ? 'none' : 'block';
        pauseIcon.style.display = isPlaying ? 'block' : 'none';
    }

    function updateVolumeSliderTrack(value) {
        const progress = value * 100;
        const bg = `linear-gradient(to right, var(--primary-color) ${progress}%, var(--border-color) ${progress}%)`;
        volumeSlider.style.background = bg;
    }

    function updateFavoriteBtnState() {
        if (!favoriteBtn) return;
        const currentUrl = stationSelect.value;
        const favorites = JSON.parse(localStorage.getItem('favoriteStations')) || [];
        const isFav = favorites.includes(currentUrl);
        
        favoriteBtn.classList.toggle('active', isFav);
        favoriteBtn.title = isFav ? "Remove from Favorites" : "Add to Favorites";
    }

    function updateMediaSession() {
        if (!('mediaSession' in navigator)) return;

        const selectedOption = stationSelect.options[stationSelect.selectedIndex];
        if (!selectedOption) return;

        // Remove the star if present for the display title
        const stationName = selectedOption.text.replace(/^★\s/, '');
        const genre = selectedOption.dataset.genre || 'Live Radio';
        const country = selectedOption.dataset.country || 'Internet';

        navigator.mediaSession.metadata = new MediaMetadata({
            title: stationName,
            artist: genre,
            album: country,
            artwork: [
                { src: 'https://cdn-icons-png.flaticon.com/512/565/565535.png', sizes: '512x512', type: 'image/png' }
            ]
        });

        navigator.mediaSession.playbackState = state.isPlaying ? 'playing' : 'paused';
    }

    const { audio, audioContext } = state;

    // Initial State
    audio.src = state.currentStation || stationSelect.value;
    audio.volume = state.volume || volumeSlider.value;
    if (state.currentStation) {
        stationSelect.value = state.currentStation;
    }
    volumeSlider.value = audio.volume;
    updateVolumeSliderTrack(audio.volume); // Set initial track color
    updatePlayPauseIcon(state.isPlaying);
    updateNowPlaying();
    updateMediaSession();

    // Event Listeners
    playPauseBtn.addEventListener('click', () => {
        if (state.isPlaying) {
            audio.pause();
        } else {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                nowPlaying.textContent = 'Error: Unable to play stream';
            });
        }
        state.isPlaying = !state.isPlaying;
        updatePlayPauseIcon(state.isPlaying);
        updateNowPlaying();
        updateMediaSession();
    });

    stationSelect.addEventListener('change', () => {
        audio.src = stationSelect.value;
        state.currentStation = stationSelect.value;
        updateNowPlaying();
        updateFavoriteBtnState();
        if (state.isPlaying) {
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                nowPlaying.textContent = 'Error: Unable to play stream';
            });
        }
    });

    // Media Session Action Handlers
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
            if (!state.isPlaying) playPauseBtn.click();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if (state.isPlaying) playPauseBtn.click();
        });
        navigator.mediaSession.setActionHandler('stop', () => {
            if (state.isPlaying) playPauseBtn.click();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            let newIndex = stationSelect.selectedIndex - 1;
            if (newIndex < 0) newIndex = stationSelect.options.length - 1;
            stationSelect.selectedIndex = newIndex;
            stationSelect.dispatchEvent(new Event('change'));
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            let newIndex = stationSelect.selectedIndex + 1;
            if (newIndex >= stationSelect.options.length) newIndex = 0;
            stationSelect.selectedIndex = newIndex;
            stationSelect.dispatchEvent(new Event('change'));
        });
    }

    // Favorite Button Logic
    favoriteBtn?.addEventListener('click', () => {
        const currentUrl = stationSelect.value;
        let favorites = JSON.parse(localStorage.getItem('favoriteStations')) || [];
        
        if (favorites.includes(currentUrl)) {
            favorites = favorites.filter(url => url !== currentUrl);
        } else {
            favorites.push(currentUrl);
        }
        
        localStorage.setItem('favoriteStations', JSON.stringify(favorites));
        
        // Refresh list to show/hide stars
        populateStations();
        updateFavoriteBtnState();
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        state.volume = audio.volume;
        updateVolumeSliderTrack(audio.volume);
    });

    // Only add popout logic if the button exists (it won't in the popout itself)
    if (popoutBtn) {
        popoutBtn.addEventListener('click', () => {
            if (state.popoutWindow && !state.popoutWindow.closed) {
                state.popoutWindow.focus();
                return;
            }
    
            if (state.isPlaying) {
                audio.pause();
                state.isPlaying = false;
                updatePlayPauseIcon(false);
            }
    
            const themeClass = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
            const popoutUrl = `popout.html?station=${encodeURIComponent(stationSelect.value)}&theme=${themeClass}`;
            state.popoutWindow = window.open(popoutUrl, 'RadioStreamPopout', 'width=300,height=278');
    
            // Hide main player and show notice
            document.querySelector('.radiostream-player .player-content').style.display = 'none';
            if (popoutNotice) popoutNotice.style.display = 'block';
    
            // Robustly check if the popout window has been closed
            const popoutCheckInterval = setInterval(() => {
                if (state.popoutWindow && state.popoutWindow.closed) {
                    clearInterval(popoutCheckInterval);
                    // Manually trigger the close logic in case the message event fails
                    handlePopoutClose();
                }
            }, 500); // Check every 500ms
        });
    
        window.addEventListener('message', (event) => {
            if (event.data.type === 'popoutClosed') {
                handlePopoutClose();
            }
        });
    }

    window.addEventListener('beforeunload', cleanup);

    function handlePopoutClose() {
        // Ensure this only runs once
        if (!state.popoutWindow && !window.opener) return;

        document.querySelector('.radiostream-player .player-content').style.display = 'flex';
        if (popoutNotice) popoutNotice.style.display = 'none';

        state.popoutWindow = null;
        if (state.isPlaying) {
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                nowPlaying.textContent = 'Error: Unable to play stream';
            });
            updatePlayPauseIcon(true);
        }
    }

    function updateNowPlaying() {
        const stationName = stationSelect.options[stationSelect.selectedIndex].text;
        nowPlaying.textContent = `Now Playing: ${stationName}`;
        state.currentStation = stationSelect.value;
        updateMediaSession();
    }

    function cleanup() {
        if (state.isPlaying) {
            audio.pause();
            state.isPlaying = false;
        }
        if (state.animationFrameId) {
            cancelAnimationFrame(state.animationFrameId);
            state.animationFrameId = null;
        }
    }
}