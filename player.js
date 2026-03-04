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
    vuStyle: 1, // Default to LED
    metadataInterval: null
};
window.radioStreamState = radioStreamState;

export function initPlayer(state) {
    // DOM Elements
    const stationSelect = document.getElementById('station-select');
    const favoriteBtn = document.getElementById('favorite-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const popoutBtn = document.getElementById('popout-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const nowPlayingStation = document.getElementById('now-playing-station');
    const nowPlayingTrack = document.getElementById('now-playing-track');
    const popoutNotice = document.getElementById('popout-notice');

    const PROXY_URL = 'https://api.djay.ca/';

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

    // Helper: Determine the actual URL to feed the audio element
    function getProxiedAudioUrl(url) {
        if (!url) return '';
        // Route ALL streams through our secure proxy to inject CORS headers.
        // The Web Audio API requires strict CORS (Access-Control-Allow-Origin: *) 
        // to draw the VU meters. Many HTTPS stations do not send this natively.
        return `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    }

    const { audio, audioContext } = state;

    // Initial State Setup
    const initialUrl = state.currentStation || stationSelect.value;
    audio.src = getProxiedAudioUrl(initialUrl);

    audio.volume = state.volume || volumeSlider.value;
    if (state.currentStation) {
        stationSelect.value = state.currentStation;
    }
    volumeSlider.value = audio.volume;
    updateVolumeSliderTrack(audio.volume); // Set initial track color
    updatePlayPauseIcon(state.isPlaying);
    updateNowPlaying();

    // NOTE: updateMediaSession() will be called by updateNowPlaying() / fetchMetadata()

    // Audio Element Event Listeners (Auto-Reconnect Logic)
    let reconnectTimeout = null;

    function handleStreamDrop() {
        if (!state.isPlaying) return; // Ignore drops if we manually paused

        if (nowPlayingTrack) {
            nowPlayingTrack.textContent = "Reconnecting...";
            nowPlayingTrack.classList.remove('marquee-active');
        }

        if (reconnectTimeout) clearTimeout(reconnectTimeout);

        console.log("Stream dropped. Attempting to reconnect in 3 seconds...");
        reconnectTimeout = setTimeout(() => {
            if (state.isPlaying) {
                console.log("Reconnecting...");
                audio.src = getProxiedAudioUrl(stationSelect.value);
                audio.load();
                audio.play().catch(err => {
                    console.error('Reconnect failed:', err);
                    if (nowPlayingTrack) nowPlayingTrack.textContent = 'Reconnect failed. Retry play.';
                    state.isPlaying = false;
                    updatePlayPauseIcon(false);
                });
            }
        }, 3000);
    }

    audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', audio.error);
        handleStreamDrop();
    });

    audio.addEventListener('ended', () => {
        console.warn('Audio stream ended unexpectedly.');
        handleStreamDrop();
    });

    audio.addEventListener('stalled', () => {
        console.warn('Audio stream stalled. Browser is attempting to buffer...');
        // We generally let the browser handle brief network stalls. 
        // If it fully fails, it will emit an 'error' or 'ended' event.
    });

    audio.addEventListener('playing', () => {
        // If we successfully reconnected, clear any pending timeouts
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }

        // Restore appropriate Now Playing text if we just recovered
        if (state.isPlaying && nowPlayingTrack && (nowPlayingTrack.textContent === "Reconnecting..." || nowPlayingTrack.textContent.includes("Reconnect failed"))) {
            // Force a fresh fetch of metadata to update the UI
            fetchMetadata(stationSelect.value);
        }
    });

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
                if (nowPlayingTrack) nowPlayingTrack.textContent = 'Error: Unable to play stream';
            });
        }
        state.isPlaying = !state.isPlaying;
        updatePlayPauseIcon(state.isPlaying);
        updateNowPlaying();
        updateMediaSession();
    });

    stationSelect.addEventListener('change', () => {
        const rawUrl = stationSelect.value;
        audio.src = getProxiedAudioUrl(rawUrl);
        state.currentStation = rawUrl;

        updateNowPlaying();
        updateFavoriteBtnState();

        if (state.isPlaying) {
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                if (nowPlayingTrack) nowPlayingTrack.textContent = 'Error: Unable to play stream';
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

            // If we are favoriting a station that isn't in our current lists 
            // (e.g., from Radio Browser before it was explicitly "Add"ed), 
            // let's ensure it's saved to customStations so we know its name.
            let customStations = JSON.parse(localStorage.getItem('customStations')) || [];
            const allKnown = [...defaultStations, ...customStations];
            if (!allKnown.some(s => s.url === currentUrl)) {
                // Try to get the name from the currently selected option
                const selectedOption = stationSelect.options[stationSelect.selectedIndex];
                const name = selectedOption ? selectedOption.text.replace(/^★\s/, '') : 'Saved Station';
                const genre = selectedOption ? (selectedOption.dataset.genre || '') : '';
                customStations.push({ name, url: currentUrl, genre });
                localStorage.setItem('customStations', JSON.stringify(customStations));
            }
        }

        localStorage.setItem('favoriteStations', JSON.stringify(favorites));

        // Refresh list to show/hide stars
        populateStations();
        updateFavoriteBtnState();
        window.dispatchEvent(new CustomEvent('stationListUpdated'));
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
                if (nowPlayingTrack) nowPlayingTrack.textContent = 'Error: Unable to play stream';
            });
            updatePlayPauseIcon(true);
        }
    }

    async function fetchMetadata(streamUrl) {
        if (!nowPlayingTrack) return;

        try {
            const response = await fetch(`${PROXY_URL}metadata?url=${encodeURIComponent(streamUrl)}`);
            const data = await response.json();

            if (data.title) {
                nowPlayingTrack.textContent = data.title;

                // Add marquee if text is long enough to overflow
                if (nowPlayingTrack.scrollWidth > nowPlayingTrack.parentElement.clientWidth) {
                    nowPlayingTrack.classList.add('marquee-active');
                } else {
                    nowPlayingTrack.classList.remove('marquee-active');
                }
            } else {
                // Fallback if stream doesn't support metadata
                const stationName = stationSelect.options[stationSelect.selectedIndex]?.text.replace(/^★\s/, '') || 'Live Stream';
                nowPlayingTrack.textContent = stationName;
                nowPlayingTrack.classList.remove('marquee-active');
            }
        } catch (error) {
            console.error("Failed to fetch stream metadata:", error);
            nowPlayingTrack.textContent = stationSelect.options[stationSelect.selectedIndex]?.text.replace(/^★\s/, '');
            nowPlayingTrack.classList.remove('marquee-active');
        }

        // Sync the OS media session lockscreen
        updateMediaSession();
    }

    function updateNowPlaying() {
        if (!nowPlayingStation || !nowPlayingTrack) return;

        const selectedOption = stationSelect.options[stationSelect.selectedIndex];
        if (!selectedOption) return;

        const stationName = selectedOption.text.replace(/^★\s/, '');
        nowPlayingStation.textContent = `Now Playing: ${stationName}`;
        state.currentStation = stationSelect.value;

        // Clear existing interval to prevent multiple polling loops
        if (state.metadataInterval) {
            clearInterval(state.metadataInterval);
            state.metadataInterval = null;
        }

        const streamUrl = stationSelect.value;

        if (state.isPlaying) {
            // Indicate loading while fetching
            nowPlayingTrack.textContent = "Loading track info...";
            nowPlayingTrack.classList.remove('marquee-active');
            // Fetch immediately
            fetchMetadata(streamUrl);
        } else {
            nowPlayingTrack.textContent = "Ready to play...";
            nowPlayingTrack.classList.remove('marquee-active');
            // Sync the OS media session lockscreen even if we just have the station name
            updateMediaSession();
        }

        // Then poll every 12 seconds
        state.metadataInterval = setInterval(() => {
            if (state.isPlaying) {
                fetchMetadata(streamUrl);
            }
        }, 12000);
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
        if (state.metadataInterval) {
            clearInterval(state.metadataInterval);
            state.metadataInterval = null;
        }
    }
}