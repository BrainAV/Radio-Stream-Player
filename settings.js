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
const bgUrlInput = document.getElementById('bg-url-input');
const setBgBtn = document.getElementById('set-bg-btn');
const clearBgBtn = document.getElementById('clear-bg-btn');
const bgPresetsContainer = document.getElementById('bg-presets-container');
const favoriteBtn = document.getElementById('favorite-btn');

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
        
        // Initial state: Disable favorite button if filter is active
        if (favoriteBtn) favoriteBtn.disabled = savedFavOnly;

        favoritesOnlyCheck.addEventListener('change', (e) => {
            localStorage.setItem('favoritesOnly', e.target.checked);
            if (favoriteBtn) favoriteBtn.disabled = e.target.checked;
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

    // Personalization Logic
    if (bgUrlInput && setBgBtn && clearBgBtn) {
        // Background Presets
        const backgroundPresets = [
            { name: 'Default', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1950' },
            { name: 'Cyberpunk', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1950' },
            { name: 'Deep Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1950' },
            { name: 'Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1950' }
        ];

        if (bgPresetsContainer) {
            bgPresetsContainer.className = 'bg-preset-grid';
            const currentBg = localStorage.getItem('customBackground') || backgroundPresets[0].url;

            backgroundPresets.forEach(preset => {
                const btn = document.createElement('button');
                btn.className = 'bg-preset-btn';
                if (currentBg === preset.url) btn.classList.add('active');
                btn.style.backgroundImage = `url('${preset.url}')`;
                btn.title = preset.name;
                btn.ariaLabel = `Set background to ${preset.name}`;
                
                btn.onclick = () => {
                    document.body.style.backgroundImage = `url('${preset.url}')`;
                    localStorage.setItem('customBackground', preset.url);
                    bgUrlInput.value = preset.url;
                    
                    // Update active state
                    Array.from(bgPresetsContainer.children).forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                };
                bgPresetsContainer.appendChild(btn);
            });
        }

        const savedBg = localStorage.getItem('customBackground');
        if (savedBg) {
            bgUrlInput.value = savedBg;
        }

        setBgBtn.addEventListener('click', () => {
            const url = bgUrlInput.value.trim();
            if (url) {
                localStorage.setItem('customBackground', url);
                document.body.style.backgroundImage = `url('${url}')`;
                
                // Update presets active state (deselect all if custom URL doesn't match)
                if (bgPresetsContainer) {
                    Array.from(bgPresetsContainer.children).forEach(b => {
                        b.classList.toggle('active', b.style.backgroundImage.includes(url));
                    });
                }
            }
        });

        clearBgBtn.addEventListener('click', () => {
            localStorage.removeItem('customBackground');
            bgUrlInput.value = '';
            // Reset to default background from CSS
            document.body.style.backgroundImage = '';
            
            // Reset presets to default (first one)
            if (bgPresetsContainer && bgPresetsContainer.children[0]) {
                Array.from(bgPresetsContainer.children).forEach(b => b.classList.remove('active'));
                bgPresetsContainer.children[0].classList.add('active');
            }
        });
    }

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