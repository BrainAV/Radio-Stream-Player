import { VU_STYLES, setVuStyle } from './visualizer.js';
import { stations as defaultStations } from './stations.js';

const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const vuStyleSelect = document.getElementById('vu-style-select');
const themeSelect = document.getElementById('theme-select');
const addStationBtn = document.getElementById('add-station-btn');
const favoritesOnlyCheck = document.getElementById('favorites-only-check');
const genreSelect = document.getElementById('genre-select');
const nameInput = document.getElementById('custom-station-name');
const genreInput = document.getElementById('custom-station-genre');
const urlInput = document.getElementById('custom-station-url');
const customStationsList = document.getElementById('custom-stations-list');

// Initialize Settings
function initSettings() {
    // Populate VU Style Dropdown
    if (vuStyleSelect) {
        VU_STYLES.forEach((style, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = style.charAt(0).toUpperCase() + style.slice(1);
            vuStyleSelect.appendChild(option);
        });

        // Set initial value from localStorage or default
        const savedStyle = localStorage.getItem('vuStyle');
        if (savedStyle !== null) {
            vuStyleSelect.value = savedStyle;
        } else {
            vuStyleSelect.value = 0;
        }

        // Change Listener
        vuStyleSelect.addEventListener('change', (e) => {
            const index = parseInt(e.target.value, 10);
            setVuStyle(index);
        });
    }

    // Theme Logic
    if (themeSelect) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Function to apply theme
        const applyTheme = (theme) => {
            document.documentElement.classList.toggle('dark-theme', theme === 'dark-theme');
            themeSelect.value = theme;
        };

        // Initial Load
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme(prefersDark.matches ? 'dark-theme' : 'light-theme');
        }

        // User Change
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        });

        // System Preference Change
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark-theme' : 'light-theme');
            }
        });
    }

    // Favorites Only Logic
    if (favoritesOnlyCheck) {
        const savedFavOnly = localStorage.getItem('favoritesOnly') === 'true';
        favoritesOnlyCheck.checked = savedFavOnly;

        favoritesOnlyCheck.addEventListener('change', (e) => {
            localStorage.setItem('favoritesOnly', e.target.checked);
            window.dispatchEvent(new CustomEvent('stationListUpdated'));
        });
    }

    // Genre Filter Logic
    function populateGenres() {
        if (!genreSelect) return;

        const customStations = JSON.parse(localStorage.getItem('customStations')) || [];
        const allStations = [...defaultStations, ...customStations];
        
        // Extract unique genres
        const genres = new Set(allStations.map(s => s.genre).filter(g => g));
        
        // Keep "All" and append sorted genres
        genreSelect.innerHTML = '<option value="all">All Genres</option>';
        Array.from(genres).sort().forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });

        // Restore selection
        const savedGenre = localStorage.getItem('selectedGenre');
        if (savedGenre) {
            genreSelect.value = savedGenre;
        }
    }

    if (genreSelect) {
        populateGenres();
        genreSelect.addEventListener('change', (e) => {
            localStorage.setItem('selectedGenre', e.target.value);
            window.dispatchEvent(new CustomEvent('stationListUpdated'));
        });
    }

    // Render Custom Stations List
    function renderCustomStations() {
        if (!customStationsList) return;
        
        const customStations = JSON.parse(localStorage.getItem('customStations')) || [];
        customStationsList.innerHTML = '';

        if (customStations.length === 0) {
            customStationsList.innerHTML = '<div class="no-stations">No custom stations added.</div>';
            return;
        }

        customStations.forEach((station, index) => {
            const item = document.createElement('div');
            item.className = 'station-item';
            item.innerHTML = `
                <span class="station-name" title="${station.url}">${station.name} ${station.genre ? `(${station.genre})` : ''}</span>
                <button class="delete-btn" data-index="${index}" aria-label="Delete station">&times;</button>
            `;
            customStationsList.appendChild(item);
        });

        // Add delete listeners
        customStationsList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index, 10);
                const stations = JSON.parse(localStorage.getItem('customStations')) || [];
                stations.splice(index, 1);
                localStorage.setItem('customStations', JSON.stringify(stations));
                populateGenres(); // Update genres in case the last station of a genre was deleted
                renderCustomStations();
                window.dispatchEvent(new CustomEvent('stationListUpdated'));
            });
        });
    }

    renderCustomStations();

    // Custom Stations Logic
    if (addStationBtn && nameInput && urlInput) {
        addStationBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const url = urlInput.value.trim();
            const genre = genreInput ? genreInput.value.trim() : '';

            if (name && url) {
                const customStations = JSON.parse(localStorage.getItem('customStations')) || [];
                customStations.push({ name, url, genre });
                localStorage.setItem('customStations', JSON.stringify(customStations));
                
                // Clear inputs
                nameInput.value = '';
                urlInput.value = '';
                if (genreInput) genreInput.value = '';

                populateGenres(); // Update genres list with new genre if applicable
                renderCustomStations();
                // Notify player to refresh list
                window.dispatchEvent(new CustomEvent('stationListUpdated'));
                
                // Optional: Visual feedback could go here
            }
        });
    }

    // Modal Event Listeners
    if (settingsBtn && settingsModal && closeSettingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
        closeSettingsBtn.addEventListener('click', closeSettings);
        
        // Close when clicking outside the content
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }
}

function openSettings() {
    settingsModal.style.display = 'flex';
}

function closeSettings() {
    settingsModal.style.display = 'none';
}

initSettings();